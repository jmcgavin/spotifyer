import { useEffect, useState } from 'react'
import Promise from 'bluebird'
import { PageHeader, ResultDataTable, Spinner } from '../../components'
import type { LocalFileMetadata, ResultsCount, ResultsFilter, SpotifyTracksForLocalFile } from '../../types'
import { SpotifyPlaylist, SpotifyUser, addToPlaylist, createPlaylist, getPlaylists, searchTracks } from '../../api'
import { useLocalStorage } from '../../hooks'
import { LOCALSTORAGE_KEYS } from '../../constants'
import {
  filterLocalMetadataTrackArtist,
  filterLocalMetadataTrackTitle,
  filterSpotifyTrackInfo,
  findBestMatch,
  goodMatchThreshold
} from '../../helpers'
import { Autocomplete, Box, Button, TextField, Tooltip } from '@mui/material'
import { LibraryAdd } from '@mui/icons-material'
import { ResultsFilterSelect } from '../../components/ResultsFilterSelect'

const initialResultsCount: ResultsCount = {
  all: 0,
  likely: 0,
  unlikely: 0,
  none: 0
}

type Props = {
  data: LocalFileMetadata[]
  user: SpotifyUser | undefined
}

export const SearchResults = ({ data, user }: Props) => {
  const [accessToken] = useLocalStorage(LOCALSTORAGE_KEYS.SPOTIFY_ACCESS_TOKEN, '')
  const [allResults, setAllResults] = useState<SpotifyTracksForLocalFile[]>([])
  const [filteredResults, setFilteredResults] = useState<SpotifyTracksForLocalFile[]>([])
  const [resultsFilter, setResultsFilter] = useState<ResultsFilter>('all')
  const [resultsCount, setResultsCount] = useState<ResultsCount>(initialResultsCount)
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([])
  const [selectedResults, setSelectedResults] = useState<SpotifyTracksForLocalFile[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>()

  useEffect(() => {
    const fetchPlaylists = async () => {
      const playlists = await getPlaylists(accessToken)
      const filteredPlaylists = playlists.filter(playlist => playlist.owner.id === user?.id || playlist.collaborative)
      setPlaylists(filteredPlaylists)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchPlaylists()
  }, [accessToken, user])

  useEffect(() => {
    if (data.length) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const searchResults: SpotifyTracksForLocalFile[] = []
        await Promise.map(data, async (data) => {
          const track = filterLocalMetadataTrackTitle(data.title)
          const artist = filterLocalMetadataTrackArtist(data.artist)
          const tracks = await searchTracks({
            searchQuery: `${track} artist:${artist}`,
            accessToken
          })

          searchResults.push({
            localFileMetadata: data,
            spotifyTracks: tracks.map(track => filterSpotifyTrackInfo(track)),
            bestMatch: findBestMatch(data, tracks.map(track => filterSpotifyTrackInfo(track)))
          })
        }, { concurrency: 5 })

        const resultsCount = searchResults.reduce((acc, curr) => {
          acc.all = acc.all + 1
          if (goodMatchThreshold(curr)) acc.likely =  acc.likely + 1
          else if (!curr.bestMatch) acc.none = acc.none + 1
          else acc.unlikely = acc.unlikely + 1
          return acc
        }, initialResultsCount)
    
        setAllResults(searchResults)
        setFilteredResults(searchResults)
        setResultsCount(resultsCount)
        setSelectedResults(searchResults.filter(result => goodMatchThreshold(result)))
      })()
    }
  }, [accessToken, data])

  const updatedSelected = (data:SpotifyTracksForLocalFile, selected:boolean) => {
    if (selected) {
      setSelectedResults([...selectedResults, data])
    } else {
      setSelectedResults(selectedResults.filter(result => result.localFileMetadata.id !== data.localFileMetadata.id))
    }
  }

  const addToSpotify = async () => {
    const spotifyTrackUris = selectedResults.map(result => result.spotifyTracks[result.bestMatch!.index].spotify_uri)
    const existingPlaylist = playlists.find(playlist => playlist.name === selectedPlaylist)

    if (!existingPlaylist) {
      // Create new playlist
      const playlist = await createPlaylist(selectedPlaylist!, user!.id, accessToken)
      await addToPlaylist(playlist.id, spotifyTrackUris, accessToken)
    } else {
      // Existing playlist
      await addToPlaylist(existingPlaylist.id, spotifyTrackUris, accessToken)
    }
  }

  const filterResults = (filter: ResultsFilter) => {
    setResultsFilter(filter)
    switch (filter) {
      case 'all': return setFilteredResults(allResults)
      case 'likely': return setFilteredResults(allResults.filter(result => goodMatchThreshold(result)))
      case 'unlikely': return setFilteredResults(allResults.filter(result => result.bestMatch && !goodMatchThreshold(result)))
      case 'none': return setFilteredResults(allResults.filter(result => !result.bestMatch))
    }
  }

  return (
    <>
      <PageHeader
        title="Search results"
        text="Confirm the tracks you would like to add to your Spotify playlist."
        actions={[
          <Autocomplete
            key="playlistSelect"
            freeSolo
            autoSelect
            onChange={(_e, value) => setSelectedPlaylist(value)}
            size='small'
            disabled={!allResults.length}
            sx={{ width: 300 }}
            options={playlists.map(playlist => playlist.name)}
            renderInput={(params) =>
              <TextField {...params} label="Select or create a playlist" />
            }
          />,
          <Tooltip key='addToSpotify' title={!selectedPlaylist ? 'A playlist must be selected.' : !selectedResults.length ? 'At least one search result must be selected.' : ''}>
            <span>
              <Button
                key="addToSpotify"
                disabled={!selectedResults.length || !selectedPlaylist}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={addToSpotify}
                variant="contained"
                startIcon={<LibraryAdd />}
              >
                Add to Spotify
              </Button>
            </span>
          </Tooltip>
        ]}
      />
      {allResults.length ?
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', marginBottom: '24px' }}>
            <ResultsFilterSelect
              resultsCount={resultsCount}
              selected={resultsFilter}
              onSelect={filterResults}
            />
            <p style={{ alignSelf: 'end', textAlign: 'end', margin: 0 }}>
              {selectedResults.length} of {allResults.length} selected
            </p>
          </Box>
          <Box sx={{ display: 'flex', flexFlow: 'column', gap: '24px' }}>
            {filteredResults.map(result =>
              <ResultDataTable
                key={result.localFileMetadata.id}
                data={result}
                onSelect={updatedSelected}
                selected={selectedResults.findIndex(selectedResults =>
                  selectedResults.localFileMetadata.id === result.localFileMetadata.id) >= 0
                }
                status={!result.bestMatch ? 'error' : goodMatchThreshold(result) ? 'success' : 'warning'}
              />
            )}
          </Box>
        </>
        :
        <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center', gap: '12px' }}>
          <Spinner />
          Searching Spotify...
        </Box>
      }
    </>
  )
}

import { useEffect, useState } from 'react'
import Promise from 'bluebird'
import { PageHeader, ResultDataTable, Spinner } from '../../components'
import type { LocalFileMetadata, MatchType, SpotifyTracksForLocalFile } from '../../types'
import { SpotifyPlaylist, SpotifyUser, addToPlaylist, createPlaylist, getPlaylists, searchTracks } from '../../api'
import { useLocalStorage } from '../../hooks'
import { LOCALSTORAGE_KEYS } from '../../constants'
import {
  filterLocalMetadataTrackArtist,
  filterLocalMetadataTrackTitle,
  filterSpotifyTrackInfo,
  findBestMatch,
  getMatchType,
  meetsConfidentMatchThreshold
} from '../../helpers'
import { Autocomplete, Box, Button, TextField, Tooltip } from '@mui/material'
import { LibraryAdd } from '@mui/icons-material'
import { ResultsFilterSelect } from '../../components/ResultsFilterSelect'

type Props = {
  data: LocalFileMetadata[]
  user: SpotifyUser
}

export const SearchResults = ({ data, user }: Props) => {
  const [accessToken] = useLocalStorage(LOCALSTORAGE_KEYS.SPOTIFY_ACCESS_TOKEN, '')
  const [allPlaylists, setAllPlaylists] = useState<SpotifyPlaylist[]>([])
  const [allResults, setAllResults] = useState<SpotifyTracksForLocalFile[]>([])
  const [allSelections, setAllSelections] = useState<SpotifyTracksForLocalFile[]>([])
  const [resultsFilter, setResultsFilter] = useState<MatchType | 'all'>('all')
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>()

  useEffect(() => {
    const fetchPlaylists = async () => {
      const playlists = await getPlaylists(accessToken)
      const filteredPlaylists = playlists
        .filter(playlist => playlist.owner.id === user?.id || playlist.collaborative)
        .sort((a, b) => a.name.localeCompare(b.name))
      setAllPlaylists(filteredPlaylists)
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

          const bestMatch = findBestMatch(data, tracks.map(track => filterSpotifyTrackInfo(track)))

          searchResults.push({
            localFileMetadata: data,
            spotifyTracks: tracks.map(track => filterSpotifyTrackInfo(track)),
            bestMatch,
            matchType: getMatchType(bestMatch)
          })
        }, { concurrency: 5 })

        setAllResults(searchResults)
        setAllSelections(searchResults.filter(result => result.matchType === 'confident'))
      })()
    }
  }, [accessToken, data])

  /**
   * Toggle a selection
   * @param {SpotifyTracksForLocalFile} data Track to select/deselect
   * @param {boolean} selected Is the result selected?
   */
  const handleSelection = (data:SpotifyTracksForLocalFile, selected:boolean) => {
    if (selected) {
      setAllSelections([...allSelections, data])
    } else {
      setAllSelections(allSelections.filter(result => result.localFileMetadata.id !== data.localFileMetadata.id))
    }
  }

  /**
   * Add the selected results to the selected playlist on Spotify
   * @async
   */
  const addToSpotify = async () => {
    const spotifyTrackUris = allSelections.map(result => result.spotifyTracks[result.bestMatch!.index].spotify_uri)
    const existingPlaylist = allPlaylists.find(playlist => playlist.name === selectedPlaylist)

    if (!existingPlaylist) {
      // Create new playlist
      const playlist = await createPlaylist(selectedPlaylist!, user!.id, accessToken)
      await addToPlaylist(playlist.id, spotifyTrackUris, accessToken)
    } else {
      // Existing playlist
      await addToPlaylist(existingPlaylist.id, spotifyTrackUris, accessToken)
    }
  }

  /**
   * Filter displayed results according to their confident match threshold.
   * @param {ResultsFilter} filter 
   * @returns 
   */
  const filterResults = (filter: MatchType) => {
    setResultsFilter(filter)
    switch (filter) {
      case 'confident': return allResults.filter(result => result.matchType === 'confident')
      case 'likely': return allResults.filter(result => result.matchType === 'likely')
      case 'none': return allResults.filter(result => result.matchType === 'none')
      default: return allResults
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
            onChange={(_e, value) => setSelectedPlaylist(value || undefined)}
            size='small'
            disabled={allResults.length === 0}
            sx={{ width: 300 }}
            options={allPlaylists.map(playlist => playlist.name)}
            renderInput={(params) =>
              <TextField {...params} label="Select or create a playlist" />
            }
          />,
          <Tooltip key='addToSpotify' title={!selectedPlaylist ? 'A playlist must be selected.' : !allSelections.length ? 'At least one search result must be selected.' : ''}>
            <span>
              <Button
                key="addToSpotify"
                disabled={!allSelections.length || !selectedPlaylist}
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
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            padding: '24px 0',
            marginTop: '-24px',
            zIndex: 1,
            position: 'sticky',
            top: 0,
            background: 'var(--mui-palette-background-default)'
          }}>
            <ResultsFilterSelect
              allResults={allResults}
              allSelections={allSelections}
              selected={resultsFilter}
              onSelect={filterResults}
            />
            <p style={{ alignSelf: 'end', textAlign: 'end', margin: 0 }}>
              {allSelections.length}&nbsp;of&nbsp;{allResults.length} selected
            </p>
          </Box>
          <Box sx={{ display: 'flex', flexFlow: 'column', gap: '24px' }}>
            {(resultsFilter === 'all' ? allResults : allResults.filter(result => result.matchType === resultsFilter)).map(result =>
              <ResultDataTable
                key={result.localFileMetadata.id}
                data={result}
                onSelect={handleSelection}
                selected={allSelections.findIndex(selectedResults =>
                  selectedResults.localFileMetadata.id === result.localFileMetadata.id) >= 0
                }
                status={!result.bestMatch ? 'error' : meetsConfidentMatchThreshold(result.bestMatch) ? 'success' : 'warning'}
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

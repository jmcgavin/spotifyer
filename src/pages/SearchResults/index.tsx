import { useEffect, useState } from 'react'
import Promise from 'bluebird'
import { PageHeader, ResultDataTable, Spinner } from '../../components'
import type { LocalFileMetadata, SpotifyTracksForLocalFile } from '../../types'
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

type Props = {
  data: LocalFileMetadata[]
  user: SpotifyUser | undefined
}

export const SearchResults = ({ data, user }: Props) => {
  const [accessToken] = useLocalStorage(LOCALSTORAGE_KEYS.SPOTIFY_ACCESS_TOKEN, '')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [countdownExpired, setCountdownExpired] = useState<boolean>(false)
  const [results, setResults] = useState<SpotifyTracksForLocalFile[]>([])
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([])
  const [selectedResults, setSelectedResults] = useState<SpotifyTracksForLocalFile[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>()

  useEffect(() => {
    setTimeout(() => {
      setCountdownExpired(true)
    }, 1000)
  }, [])

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
      setResults(searchResults)
      setSelectedResults(searchResults.filter(result => goodMatchThreshold(result)))
      setIsLoading(false)
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

  return (
    <>
      <PageHeader
        title="Search results"
        text="Confirm the tracks you would like to add to your Spotify playlist."
        actions={[
          <Autocomplete
            key="playlistSelect"
            freeSolo
            onChange={(_e, value) => setSelectedPlaylist(value)}
            size='small'
            disabled={isLoading || !countdownExpired || !results.length}
            sx={{ width: 300 }}
            options={playlists.map(playlist => playlist.name)}
            renderInput={(params) =>
              <TextField {...params} label="Select or create a playlist" />
            }
          />,
          <Tooltip key='addToSpotify' title={!selectedPlaylist ? 'A playlist must be selected.' : ''}>
            <span>
              <Button
                key="addToSpotify"
                disabled={isLoading || !countdownExpired || !results.length || !selectedPlaylist}
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
      {isLoading || !countdownExpired &&
        <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center', gap: '12px' }}>
          <Spinner />
          Searching Spotify...
        </Box>
      }
      {!isLoading && countdownExpired && results.length &&
        <>
        <p style={{ textAlign: 'end' }}>
          {selectedResults.length} of {results.length} selected
        </p>
          <Box sx={{ display: 'flex', flexFlow: 'column', gap: '24px' }}>
            {results.map(result =>
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
      }
    </>
  )
}

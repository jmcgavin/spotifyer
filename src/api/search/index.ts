import { createQueryString } from '../../helpers'
import { SpotifyTrack, SpotifyTracksSearchResult } from './types'

export * from './types'

const ENDPOINT = 'https://api.spotify.com/v1/search'

/**
 * Search tracks.
 * @param searchQuery Query value to use for the search
 * @param accessToken Spotify API access token
 */
export const searchTracks = async ({
  searchQuery,
  accessToken
}: {
  searchQuery: string
  accessToken: string
}): Promise<SpotifyTrack[]> => {
  const queryString = createQueryString({
    q: searchQuery,
    type: 'track',
    limit: 5
  })

  const response = await fetch(ENDPOINT + queryString, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => response.json()) as SpotifyTracksSearchResult

  return response.tracks.items
}

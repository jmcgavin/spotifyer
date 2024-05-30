import type { SpotifyUser } from './types'

export * from './types'

const ENDPOINT = 'https://api.spotify.com/v1/me'

/**
 * Get detailed profile information about the current user.
 * @param accessToken Spotify API access token
 */
export const getUser = async (accessToken: string): Promise<SpotifyUser> => {
  return await fetch(ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => response.json()) as SpotifyUser
}

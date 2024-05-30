import type { SpotifyPlaylist, SpotifyPlaylistSnapshoId, SpotifyUserPlaylists } from './types'

export * from './types'

const ENDPOINTS = {
  USER_PLAYLISTS: 'https://api.spotify.com/v1/me/playlists',
  USER: 'https://api.spotify.com/v1/users',
  PLAYLISTS: 'https://api.spotify.com/v1/playlists'
}

/**
 * Get the user's Spotify playlists.
 * @param accessToken Spotify API access token
 */
export const getPlaylists = async (accessToken: string): Promise<SpotifyPlaylist[]> => {
  const response = await fetch(ENDPOINTS.USER_PLAYLISTS, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => response.json()) as SpotifyUserPlaylists

  return response.items
}

/**
 * Create a Spotify playlist.
 * @param userId Spotify User ID
 * @param accessToken Spotify API access token
 */
export const createPlaylist = async(playlistName: string, userId: string, accessToken: string): Promise<SpotifyPlaylist> => {
  const response = await fetch(`${ENDPOINTS.USER}/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name: playlistName
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => response.json()) as SpotifyPlaylist

  return response
}

/**
 * Add items to a Spotify playlist.
 * @param playlistId Spotify Playlist ID
 * @param accessToken Spotify API access token
 */
export const addToPlaylist = async(playlistId: string, spotifyTrackUris: string[], accessToken: string): Promise<SpotifyPlaylistSnapshoId> => {
  const response = await fetch(`${ENDPOINTS.PLAYLISTS}/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({
      uris: spotifyTrackUris
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => response.json()) as SpotifyPlaylistSnapshoId

  return response
}

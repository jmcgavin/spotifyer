import { LOCALSTORAGE_KEYS, REDIRECT_URL } from '../../constants'
import type { SpotifyRequestAccessTokenResponse } from './types'
import { base64encode, generateRandomString, sha256 } from '../../helpers'

export * from './types'

const ENDPOINTS = {
  AUTHORIZE: 'https://accounts.spotify.com/authorize',
  API_TOKEN: 'https://accounts.spotify.com/api/token'
}

/**
 * Generates a PKCE code challenge and redirects to the Spotify authorization server login page by
 * updating the window.location object value. This allows the user to grant permissions to the
 * application.
 *
 * If the user accepts the requested permissions, the OAuth service redirects the user back to the
 * URL specified in the redirect_uri field. This callback contains two query parameters within the
 * URL: code, state
 */
export const requestAuthorization = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const authUrl = new URL(ENDPOINTS.AUTHORIZE)
  const scope =
    'user-read-private playlist-read-collaborative playlist-read-private playlist-modify-private playlist-modify-public'

  const codeVerifier = generateRandomString()

  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed)

  localStorage.setItem(LOCALSTORAGE_KEYS.SPOTIFY_CODE_VERIFIER, codeVerifier)

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URL
  }

  authUrl.search = new URLSearchParams(params).toString()
  window.location.href = authUrl.toString()
}

/**
 * Exchange an authorization code for an API access token.
 * @param code Spotify authorization code that can be exchanged for an access token
 */
export const requestAccessToken = async (code: string) => {
  const codeVerifier = localStorage.getItem(LOCALSTORAGE_KEYS.SPOTIFY_CODE_VERIFIER)

  if (!codeVerifier) {
    throw new Error('Missing code verifier.')
  }

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URL,
      code_verifier: codeVerifier
    })
  }

  const response = await fetch(ENDPOINTS.API_TOKEN, payload)
  const data = (await response.json()) as SpotifyRequestAccessTokenResponse

  localStorage.setItem(LOCALSTORAGE_KEYS.SPOTIFY_ACCESS_TOKEN, data.access_token)
  localStorage.setItem(LOCALSTORAGE_KEYS.SPOTIFY_REFRESH_TOKEN, data.refresh_token)
  localStorage.removeItem(LOCALSTORAGE_KEYS.SPOTIFY_CODE_VERIFIER)
}

/**
 * Access tokens have a lifespan of 1 hour, at the end of which, a new token can be obtained by
 * providing the original refresh token acquired during the authorization token request.
 */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(LOCALSTORAGE_KEYS.SPOTIFY_REFRESH_TOKEN)

  if (!refreshToken) {
    throw new Error('Missing refresh token.')
  }

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID
    })
  }

  const response = await fetch(ENDPOINTS.API_TOKEN, payload)
  const data = (await response.json()) as SpotifyRequestAccessTokenResponse

  localStorage.setItem(LOCALSTORAGE_KEYS.SPOTIFY_ACCESS_TOKEN, data.access_token)
  localStorage.setItem(LOCALSTORAGE_KEYS.SPOTIFY_REFRESH_TOKEN, data.refresh_token)
}

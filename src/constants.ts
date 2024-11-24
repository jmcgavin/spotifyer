export const ROUTES = {
  ROOT: '/',
  CALLBACK: '/callback',
  SEARCH_RESULTS: '/search-results',
  TRACK_SELECTION: '/track-selection'
}

export const REDIRECT_URL = `https://localhost:5173${ROUTES.CALLBACK}`

export const GITHUB_REPO = 'https://github.com/jmcgavin/spotifyer'

export const LOCALSTORAGE_KEYS = {
  SPOTIFY_ACCESS_TOKEN: 'spotify_access_token',
  SPOTIFY_CODE_VERIFIER: 'spotify_code_verifier',
  SPOTIFY_REFRESH_TOKEN: 'spotify_refresh_token'
}

export const RESULT_INNACURACY_THRESHOLD = 0.2

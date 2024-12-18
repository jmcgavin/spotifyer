export type LocalFileMetadata = {
  id: string
  title: string
  artist: string
  album: string
  year: string
  duration?: number
}

export type FilteredSpotifyTrack = {
  id: string
  name: string
  external_url: string
  spotify_uri: string
  artists: string[]
  duration: number
  album: {
    name: string
    release_date: string
  }
}

export type BestMatch = {
  index: number
  differenceScore: number
} | undefined

export type SpotifyTracksForLocalFile = {
  localFileMetadata: LocalFileMetadata
  spotifyTracks: FilteredSpotifyTrack[]
  bestMatch: BestMatch
  matchType: MatchType
}

export type MatchType = 'confident' | 'likely' | 'none'


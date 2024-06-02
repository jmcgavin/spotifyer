export type LocalFileMetadata = {
  id: string
  title: string
  artist: string
  album: string
  year: string
}

export type FilteredSpotifyTrack = {
  id: string
  name: string
  external_url: string
  spotify_uri: string
  artists: string[]
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
}

export type ResultsFilter = 'all' | 'confident' | 'likely' | 'none'

export type ResultsCount = {
  [key in ResultsFilter]: number
}

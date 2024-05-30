export type SpotifyArtist = {
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  type: 'artist'
  uri: string
}

export type SpotifyAlbum = {
  album_type: 'album' | 'single' | 'compilation'
  total_tracks: number
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: [
    {
      url: string
      height: number
      width: number
    }[]
  ]
  name: string
  release_date: string
  release_date_precision: 'year' | 'month' | 'day'
  type: 'album'
  uri: string
  artists: SpotifyArtist[]
}

export type SpotifyTrack = {
  album: SpotifyAlbum
  artists: SpotifyArtist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc?: string
    ean?: string
    upc?: string
  }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  popularity: number
  preview_url: string | null
  track_number: number
  type: 'track'
  uri: string
  is_local: boolean
}

export type SpotifyTracksSearchResult = {
  tracks: {
    href: string
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
    items: SpotifyTrack[]
  }
}

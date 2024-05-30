export type SpotifyPlaylist = {
  collaborative: boolean
  description: string
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
  owner: {
    external_urls: {
      spotify: string
    }
    followers: {
      href: string | null
      total: number
    }
    href: string
    id: string
    type: 'user'
    uri: string
    display_name: string | null
  }
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: 'playlist'
  uri: string
}

export type SpotifyUserPlaylists = {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: SpotifyPlaylist[]
}

export type SpotifyPlaylistSnapshoId = {
  snapshot_id: string
}
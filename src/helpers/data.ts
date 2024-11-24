import { parseBlob } from 'music-metadata'
import { distance } from 'fastest-levenshtein'
import { BestMatch, FilteredSpotifyTrack, LocalFileMetadata, MatchType } from '../types'
import { SpotifyTrack } from '../api'
import { RESULT_INNACURACY_THRESHOLD } from '../constants'

/**
 * Parse an audio file and extract metadata: title, artist, album, year, duration (ms)
 * @param file Audio file to parse
 */
export const parseFile = async (file: File): Promise<LocalFileMetadata> => {
  const { common, format } = await parseBlob(file, { skipCovers: true, duration: true })
  return {
    id: crypto.randomUUID(),
    title: common.title || '',
    artist: common.artist || '',
    album: common.album || '',
    year: common.year ? common.year.toString() : '',
    duration: format.duration && format.duration * 1000
  }
}

/**
 * Filter and format a Spotify track object to keep only relevant data
 * @param track Spotify track
 */
export const filterSpotifyTrackInfo = (track: SpotifyTrack): FilteredSpotifyTrack => ({
  id: track.id,
  name: track.name,
  spotify_uri: track.uri,
  external_url: track.external_urls.spotify,
  artists: track.artists.map(artist => artist.name),
  duration: track.duration_ms,
  album: {
    name: track.album.name,
    release_date: track.album.release_date.substring(0, 4)
  }
})

/**
 * Format a local track's title to remove unwanted characters
 * @param title Local metadata track title
 */
export const formatLocalMetadataTrackTitle = (title: string): string => {
  const result = title.replace(/[()[\]'"{}]/g, '')
  return result.replace(/  +/g, ' ').trim()
}

/**
 * Format a local track's artist to remove unwanted characters and split into array of individual artists
 * @param title Local metadata track title
 */
export const formatLocalMetadataTrackArtist = (artist: string): string[] => {
  const splitCharacter = '_-_'
  const result = artist.replace(/\sfeaturing|\sfeat|\sft|\svs|\sand|\s&|,|\./gi, splitCharacter)
  const artists = result.split(splitCharacter).filter(artist => artist.length)
  return artists.map(artist => artist.replace(/  +/g, ' ').trim())
}

/**
 * Narrow down a list of search results to a single, most likely result.
 * @param localFileMetadata Local file's metadata
 * @param searchResults Search results
 */
export const findBestMatch = (
  localFileMetadata: LocalFileMetadata,
  spotifyTracks: FilteredSpotifyTrack[]
): BestMatch => {
  const similarityComparisons = []
  let differenceScore

  for (let i = 0; i < spotifyTracks.length; i++) {
    const spotifyArtist = spotifyTracks[i].artists.join(' ').toLowerCase()
    const spotifyTitle = spotifyTracks[i].name.toLowerCase()
    const spotifyAlbum = spotifyTracks[i].album.name.toLowerCase()

    const localArtist = formatLocalMetadataTrackArtist(localFileMetadata.artist).join(' ').toLowerCase()
    const localTitle = formatLocalMetadataTrackTitle(localFileMetadata.title).toLowerCase()
    const localAlbum = localFileMetadata.album.toLowerCase()

    const artistDifference = (distance(localArtist, spotifyArtist)) / spotifyArtist.length
    const titleDifference = (distance(localTitle, spotifyTitle)) / spotifyTitle.length
    const albumDifference = (distance(localAlbum, spotifyAlbum)) / spotifyAlbum.length

    differenceScore = (artistDifference + titleDifference + albumDifference) / 3

    similarityComparisons.push({
      index: i,
      differenceScore,
      albumDifference
    })
  }

  similarityComparisons.sort((a, b) => {
    return a.differenceScore - b.differenceScore
  })

  return Array.isArray(spotifyTracks) && spotifyTracks.length ? {
    index: similarityComparisons[0].index,
    differenceScore: similarityComparisons[0].differenceScore
  } : undefined
}

/**
 * Check if a result meets the threshold to be considered a confident match
 */
export const meetsConfidentMatchThreshold = (bestMatch: BestMatch): boolean => {
  return !!bestMatch && bestMatch.differenceScore <= RESULT_INNACURACY_THRESHOLD
}

/**
 * Get the match type. Either 'confident', 'likely' or 'none'
 */
export const getMatchType = (bestMatch: BestMatch): MatchType => {
  if (meetsConfidentMatchThreshold(bestMatch)) return 'confident'
  else if (!bestMatch) return 'none'
  else return 'likely'
}

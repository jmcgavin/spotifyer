/**
 * Generate a randomized string of alphanumeric characters
 * @param length Desired length of the string
 * @returns Randomized string of a given length containing alphanumeric characters
 */
export const generateRandomString = (length = 64) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

/**
 * Transform (hash) a value using the SHA256 algorithm
 * @param value Value to hash
 * @returns Cryptographic digest of a value
 */
export const sha256 = async (value: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  return crypto.subtle.digest('SHA-256', data)
}

/**
 * Encode a value to base64
 * @param value Value to convert to base64
 * @returns Base64 representation of a value
 */
export const base64encode = (value: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(value)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

/**
 * Join an object's key-value pairs to create a URL query string
 * @param params Query parameters object
 */
export const createQueryString = (params: Record<string, string | number>) => {
  const queryString = Object.keys(params)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&')
  return '?' + queryString
}

/**
 * Convert MS to time in HH:MM:SS format
 * @param ms Time in milliseconds
 */
export const msToHMS = (ms: number) => {
  let seconds = Math.floor(ms / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60

  let timeString = ''

  if (hours > 0) {
    timeString += hours + ':'
  }

  timeString += minutes + ':' + (seconds < 10 ? '0' : '') + seconds

  return timeString
}

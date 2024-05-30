import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'

function getStorageValue(key: string, defaultValue: string) {
  const saved = localStorage.getItem(key)
  return saved || defaultValue
}

export const useLocalStorage = (
  key: string,
  defaultValue: string
): [string, Dispatch<SetStateAction<string>>] => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}

import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

const STORAGE_KEY = '@ignitefleet:location'

type LocationProps = {
  latitude: number
  longitude: number
  timestamp: number
}

export function getStorageLocations() {
  const storagedLocations = storage.getString(STORAGE_KEY)
  const response = storagedLocations
    ? JSON.parse(String(storagedLocations))
    : []

  return response
}

export function saveStorageLocation(newLocation: LocationProps) {
  const storagedLocations = getStorageLocations()
  storagedLocations.push(newLocation)

  storage.set(STORAGE_KEY, JSON.stringify(storagedLocations))
}

export function removeStorageLocations() {
  storage.delete(STORAGE_KEY)
}

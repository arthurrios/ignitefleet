/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  removeStorageLocations,
  saveStorageLocation,
} from '@libs/storage/locationStorage'
import {
  Accuracy,
  hasStartedLocationUpdatesAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location'
import * as TaskManager from 'expo-task-manager'

export const BACKGROUND_TASK_NAME = 'location-tracking'

TaskManager.defineTask(BACKGROUND_TASK_NAME, ({ data, error }: any) => {
  try {
    if (error) {
      throw error
    }

    if (data) {
      const { coords, timestamp } = data.locations[0]

      const currentLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp,
      }

      saveStorageLocation(currentLocation)
    }
  } catch (error) {
    console.log(error)
    stopLocationTask()
  }
})

export async function startLocationTask() {
  try {
    const hasStarted =
      await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)

    if (hasStarted) {
      await stopLocationTask()
    }

    await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
      accuracy: Accuracy.Highest,
      distanceInterval: 1,
      timeInterval: 1000,
    })
  } catch (error) {
    console.log(error)
  }
}

export async function stopLocationTask() {
  try {
    const hasStarted =
      await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)

    if (hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME)
      removeStorageLocations()
    }
  } catch (error) {
    console.log(error)
  }
}

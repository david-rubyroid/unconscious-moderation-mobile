import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY_PREFIX = 'async_storage_'

export const AsyncStorageKey = {
  FIRST_TIME_DRINK_TRACKER_POPUPS: 'firstTimeDrinkTrackerPopups',
} as const

const getKey = (key: string) => `${KEY_PREFIX}${key}`

export async function setItem(key: string, value: string) {
  await AsyncStorage.setItem(getKey(key), value)
}

export async function getItem(key: string) {
  return await AsyncStorage.getItem(getKey(key))
}

export async function removeItem(key: string) {
  await AsyncStorage.removeItem(getKey(key))
}

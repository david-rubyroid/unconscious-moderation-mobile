import * as SecureStore from 'expo-secure-store'

/**
 * Secure store keys
 * Ensures type safety and prevents typos when accessing secure storage
 */
export const SecureStoreKey = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  IS_FIRST_LAUNCH: 'isFirstLaunch',
  SELECTED_DRINK_LOG_PHOTO_URI: 'selectedDrinkLogPhotoUri',
} as const

export type SecureStoreKeyType = typeof SecureStoreKey[keyof typeof SecureStoreKey]

export const secureStore = {
  set: async (key: SecureStoreKeyType, value: string) => {
    await SecureStore.setItemAsync(key, value)
  },
  get: async (key: SecureStoreKeyType) => {
    return await SecureStore.getItemAsync(key)
  },
  remove: async (key: SecureStoreKeyType) => {
    await SecureStore.deleteItemAsync(key)
  },
}

import { secureStore, SecureStoreKey } from './secureStore'

export async function checkAuthToken() {
  const token = await secureStore.get(SecureStoreKey.ACCESS_TOKEN)
  return Boolean(token)
}

export async function removeAuthTokens() {
  await secureStore.remove(SecureStoreKey.ACCESS_TOKEN)
  await secureStore.remove(SecureStoreKey.REFRESH_TOKEN)
}

export async function saveAuthTokens(accessToken: string, refreshToken: string) {
  await secureStore.set(SecureStoreKey.ACCESS_TOKEN, accessToken)
  await secureStore.set(SecureStoreKey.REFRESH_TOKEN, refreshToken)
}

export async function checkFirstLaunch() {
  const isFirstLaunch = await secureStore.get(SecureStoreKey.IS_FIRST_LAUNCH)
  return Boolean(isFirstLaunch)
}

export async function setFirstLaunch() {
  await secureStore.set(SecureStoreKey.IS_FIRST_LAUNCH, 'true')
}

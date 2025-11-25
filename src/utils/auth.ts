import { secureStore } from './secureStore'

export async function checkAuthToken() {
  const token = await secureStore.get('accessToken')
  return Boolean(token)
}

export async function removeAuthTokens() {
  await secureStore.remove('accessToken')
  await secureStore.remove('refreshToken')
}

export async function saveAuthTokens(accessToken: string, refreshToken: string) {
  await secureStore.set('accessToken', accessToken)
  await secureStore.set('refreshToken', refreshToken)
}

export async function checkFirstLaunch() {
  const isFirstLaunch = await secureStore.get('isFirstLaunch')
  return Boolean(isFirstLaunch)
}

export async function setFirstLaunch() {
  await secureStore.set('isFirstLaunch', 'true')
}

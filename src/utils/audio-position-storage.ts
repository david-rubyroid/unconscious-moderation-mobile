import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY_PREFIX = 'audio_position_'

const getKey = (uri: string) => `${KEY_PREFIX}${uri}`

export async function saveAudioPosition(
  uri: string,
  positionSeconds: number,
): Promise<void> {
  await AsyncStorage.setItem(getKey(uri), String(positionSeconds))
}

export async function getAudioPosition(uri: string): Promise<number | null> {
  const value = await AsyncStorage.getItem(getKey(uri))
  return value != null ? Number(value) : null
}

export async function clearAudioPosition(uri: string): Promise<void> {
  await AsyncStorage.removeItem(getKey(uri))
}

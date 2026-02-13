import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY_PREFIX = 'async_storage_'

export const AsyncStorageKey = {
  FIRST_TIME_DRINK_TRACKER_POPUPS: 'firstTimeDrinkTrackerPopups',
  FIRST_TIME_ACTION_DAY_POPUP: 'firstTimeActionDayPopup',
  FIRST_TIME_CONNECTION_DAY_POPUP: 'firstTimeConnectionDayPopup',
  DAY_ONE_REMINDER_REQUESTED: 'dayOneReminderRequested',
  FEEDBACK_MODAL_LAST_SHOWN_DATE: 'feedbackModalLastShownDate',
  FEEDBACK_MODAL_HAS_BEEN_SHOWN: 'feedbackModalHasBeenShown',
  FEEDBACK_MODAL_USER_RATED: 'feedbackModalUserRated',
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

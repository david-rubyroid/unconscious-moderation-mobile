import * as Localization from 'expo-localization'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { getResources } from './resources'

export const DEFAULT_LANGUAGE = 'en'
export const deviceLanguage = Localization.getLocales()[0]?.languageCode || DEFAULT_LANGUAGE

i18n.use(initReactI18next).init({
  resources: getResources(),
  lng: deviceLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n

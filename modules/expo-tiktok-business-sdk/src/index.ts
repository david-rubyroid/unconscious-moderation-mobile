import type { ExpoTikTokBusinessModule } from './ExpoTikTokBusinessModule.types'

import { requireNativeModule } from 'expo-modules-core'

/**
 * Custom Expo module for TikTok Business SDK
 * Currently supports iOS only. Android support will be added later.
 */
const ExpoTikTokBusiness = requireNativeModule<ExpoTikTokBusinessModule>('ExpoTikTokBusinessModule')

export * from './ExpoTikTokBusinessModule.types'
export default ExpoTikTokBusiness

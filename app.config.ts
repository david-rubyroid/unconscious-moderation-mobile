import appJson from './app.json'

const easProfile = process.env.EAS_BUILD_PROFILE
const oneSignalMode
  = easProfile === 'production' || easProfile === 'preview'
    ? 'production'
    : 'development'

const config = {
  ...appJson.expo,
  plugins: appJson.expo.plugins.map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === 'onesignal-expo-plugin') {
      return ['onesignal-expo-plugin', { mode: oneSignalMode }]
    }
    return plugin
  }),
}

if (config.ios?.entitlements) {
  config.ios.entitlements['aps-environment'] = oneSignalMode
}

export default config

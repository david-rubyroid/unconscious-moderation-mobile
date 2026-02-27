const { withInfoPlist } = require('@expo/config-plugins')

/**
 * TikTok SKAdNetwork IDs for iOS attribution
 * Source: https://business-api.tiktok.com/portal/docs?id=1739584870973442
 */
const TIKTOK_SKADNETWORK_IDS = [
  '238da6jt44.skadnetwork',
  '22mmun2rn5.skadnetwork',
  'v72qych5uu.skadnetwork',
  'c6k4g5qg8m.skadnetwork',
  '4fzdc2evr5.skadnetwork',
  'v4nxqhlyqp.skadnetwork',
  'ludvb6z3bs.skadnetwork',
  'hs6bdukanm.skadnetwork',
  '4468km3ulz.skadnetwork',
  'mlmmfzh3r3.skadnetwork',
  '2u9pt9hc89.skadnetwork',
  '8s468mfl3y.skadnetwork',
  'klf5c3l5u5.skadnetwork',
  'ppxm28t8ap.skadnetwork',
  'cstr6suwn9.skadnetwork',
  '4w7y6s5ca2.skadnetwork',
  't38b2kh725.skadnetwork',
  '7ug5zh24hu.skadnetwork',
  '9rd848q2bz.skadnetwork',
  'n6fk4nfna4.skadnetwork',
  'kbd757ywx3.skadnetwork',
  'wg4vff78zm.skadnetwork',
  'wzmmz9fp6w.skadnetwork',
  'yclnxrl5pm.skadnetwork',
  'g28c52eehv.skadnetwork',
  'ydx93a7ass.skadnetwork',
  'pwa83g58qe.skadnetwork',
  'v9wttpbfk9.skadnetwork',
  'n38lu8286q.skadnetwork',
  '47vhws6wlr.skadnetwork',
  'kbd757ywx3.skadnetwork',
  '9t245vhmpl.skadnetwork',
  'a2p9lx4jpn.skadnetwork',
  '5lm9lj6jb7.skadnetwork',
  'pwdxu55a5a.skadnetwork',
  'mtkv5xtk9e.skadnetwork',
  '424m5254lk.skadnetwork',
]

/**
 * Add TikTok App ID and SKAdNetwork IDs to iOS Info.plist
 */
function withTikTokIOS(config) {
  return withInfoPlist(config, (config) => {
    const tiktokAppId = process.env.EXPO_PUBLIC_TIKTOK_APP_ID_IOS

    if (tiktokAppId) {
      // Add TikTok App ID to Info.plist
      config.modResults.TikTokAppID = tiktokAppId
      console.warn('[TikTok Config Plugin] Added TikTok App ID to Info.plist')
    }
    else {
      console.warn(
        '[TikTok Config Plugin] Warning: EXPO_PUBLIC_TIKTOK_APP_ID_IOS not found in environment variables',
      )
    }

    // Add or merge SKAdNetworkItems
    if (!config.modResults.SKAdNetworkItems) {
      config.modResults.SKAdNetworkItems = []
    }

    // Get existing SKAdNetwork IDs
    const existingIds = new Set(
      config.modResults.SKAdNetworkItems.map(item => item.SKAdNetworkIdentifier),
    )

    // Add TikTok SKAdNetwork IDs if they don't already exist
    let addedCount = 0
    TIKTOK_SKADNETWORK_IDS.forEach((id) => {
      if (!existingIds.has(id)) {
        config.modResults.SKAdNetworkItems.push({
          SKAdNetworkIdentifier: id,
        })
        addedCount++
      }
    })

    if (addedCount > 0) {
      console.warn(
        `[TikTok Config Plugin] Added ${addedCount} TikTok SKAdNetwork IDs to Info.plist`,
      )
    }
    else {
      console.warn('[TikTok Config Plugin] All TikTok SKAdNetwork IDs already present')
    }

    return config
  })
}

/**
 * Main plugin export
 */
module.exports = (config) => {
  // Apply iOS configuration
  config = withTikTokIOS(config)

  console.warn('[TikTok Config Plugin] Configuration complete')
  return config
}

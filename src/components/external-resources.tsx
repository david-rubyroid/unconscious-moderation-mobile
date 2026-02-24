import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, Share, StyleSheet, View } from 'react-native'

import AmazonIcon from '@/assets/icons/amazon'
import ArrowIcon from '@/assets/icons/arrow'
import DotsIcon from '@/assets/icons/dots'
import ShareIcon from '@/assets/icons/share'
import SupportIcon from '@/assets/icons/support'
import YouTubeIcon from '@/assets/icons/youtube'

import {
  APP_SHARE_URL,
  EXTERNAL_RESOURCES_LINKS,
} from '@/constants/external-resources'
import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: verticalScale(30),
    gap: verticalScale(30),
  },
  items: {
    alignSelf: 'stretch',
    gap: verticalScale(20),
  },
  item: {
    borderRadius: 10,
    padding: scale(11),
    paddingRight: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.8),
  },
  iconContainer: {
    backgroundColor: Colors.light.white,
    height: scale(46),
    width: scale(49),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  text: {
    color: Colors.light.primary4,
  },
})

function ExternalResources() {
  const { t } = useTranslation('external-resources')

  const handleOpenYouTube = () => {
    openBrowserAsync(EXTERNAL_RESOURCES_LINKS.youtube, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    })
  }
  const handleOpenAmazon = () => {
    openBrowserAsync(EXTERNAL_RESOURCES_LINKS.amazon, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    })
  }
  const handleOpenSupport = () => {
    Linking.openURL('mailto:support@um.app')
  }
  const handleShareToFriend = async () => {
    try {
      const message = t('share-message', { appUrl: APP_SHARE_URL })

      await Share.share({
        message,
      })
    }
    catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <View style={styles.container}>
      <DotsIcon />

      <View style={styles.items}>
        <Pressable style={styles.item} onPress={handleOpenYouTube}>
          <View style={styles.iconContainer}>
            <YouTubeIcon />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.text}>{t('youtube')}</ThemedText>

          <ArrowIcon color={Colors.light.primary4} style={styles.arrowIcon} />
        </Pressable>

        <Pressable style={styles.item} onPress={handleOpenAmazon}>
          <View style={styles.iconContainer}>
            <AmazonIcon />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.text}>{t('amazon')}</ThemedText>

          <ArrowIcon color={Colors.light.primary4} style={styles.arrowIcon} />
        </Pressable>

        <Pressable style={styles.item} onPress={handleShareToFriend}>
          <View style={styles.iconContainer}>
            <ShareIcon
              height={24}
              width={29}
              color={Colors.light.primary}
            />
          </View>

          <ThemedText
            type="defaultSemiBold"
            style={styles.text}
          >
            {t('share-to-friend')}
          </ThemedText>

          <ArrowIcon color={Colors.light.primary4} style={styles.arrowIcon} />
        </Pressable>

        <Pressable style={styles.item} onPress={handleOpenSupport}>
          <View style={styles.iconContainer}>
            <SupportIcon />
          </View>

          <ThemedText
            type="defaultSemiBold"
            style={styles.text}
          >
            {t('support')}
          </ThemedText>

          <ArrowIcon color={Colors.light.primary4} style={styles.arrowIcon} />
        </Pressable>
      </View>
    </View>
  )
}

export default ExternalResources

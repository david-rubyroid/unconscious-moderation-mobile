import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, StyleSheet, View } from 'react-native'

import TrailerPlay from '@/assets/icons/trailer-play'
import masterClassLogo from '@/assets/images/master-class.webp'

import { Button, ScreenContainer, ThemedText } from '@/components'

import { MASTER_CLASS } from '@/constants/master-class'
import { Colors, withOpacity } from '@/constants/theme'

import { verticalScale } from '@/utils/responsive'
import { getYouTubeThumbnail, getYouTubeVideoId } from '@/utils/youtube'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 196,
    height: 28,
    marginBottom: verticalScale(60),
  },
  bookContainer: {
    borderRadius: 15,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    width: 310,
    marginBottom: verticalScale(50),
  },
  thumbnailContainer: {
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    position: 'relative',
    width: 310,
    height: 189,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: 310,
    height: 189,
    resizeMode: 'cover',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',

  },
  bookInfo: {
    padding: 12,
    gap: 4,
  },
})

function MasterClassScreen() {
  const { t } = useTranslation('blinkist')

  const { day } = useLocalSearchParams()

  const content = MASTER_CLASS[`day-${day}` as keyof typeof MASTER_CLASS]
  const title = content.title
  const author = content.author
  const trailer = content.trailer
  const link = content.link

  const videoId = trailer ? getYouTubeVideoId(trailer) : null
  const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : null

  const handleTrailerPress = () => {
    if (trailer) {
      Linking.openURL(trailer)
    }
  }

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <Image source={masterClassLogo} style={styles.logo} />

      <View style={styles.bookContainer}>
        {thumbnailUrl && (
          <Pressable onPress={handleTrailerPress} style={styles.thumbnailContainer}>
            <Image source={{ uri: thumbnailUrl }} style={styles.thumbnailImage} />

            <View style={styles.playButtonOverlay}>
              <TrailerPlay />
            </View>
          </Pressable>
        )}

        <View style={styles.bookInfo}>
          <ThemedText type="preSubtitle">{title}</ThemedText>
          <ThemedText type="defaultSemiBold">{author}</ThemedText>
        </View>
      </View>

      <Button
        title={t('watch-now')}
        as="external-link"
        href={link}
      />
    </ScreenContainer>
  )
}

export default MasterClassScreen

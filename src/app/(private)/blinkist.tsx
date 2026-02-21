import { Image } from 'expo-image'

import { useLocalSearchParams } from 'expo-router'

import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import blinkistLogo from '@/assets/images/blinkist/blinkist-logo.webp'

import { Button, ScreenContainer, ThemedText } from '@/components'

import { BLINKIST_BOOKS } from '@/constants/blinkist'
import { Colors, withOpacity } from '@/constants/theme'

import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 30,
    marginBottom: verticalScale(40),
  },
  bookContainer: {
    borderRadius: 15,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    width: 310,
    marginBottom: verticalScale(40),
  },
  bookImage: {
    width: 310,
    height: 340,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  bookInfo: {
    padding: 12,
    gap: 4,
  },
  text: {
    color: Colors.light.primary4,
  },
})

function BlinkistScreen() {
  const { t } = useTranslation('blinkist')

  const { day } = useLocalSearchParams()

  const link = BLINKIST_BOOKS[`day-${day}` as keyof typeof BLINKIST_BOOKS].link
  const image = BLINKIST_BOOKS[`day-${day}` as keyof typeof BLINKIST_BOOKS].image

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <Image source={blinkistLogo} style={styles.logo} />

      <View style={styles.bookContainer}>
        <Image source={image} resizeMode="cover" style={styles.bookImage} />

        <View style={styles.bookInfo}>
          <ThemedText style={styles.text} type="preSubtitle">{t('day-1.title')}</ThemedText>
          <ThemedText style={styles.text} type="preSubtitle">{t('day-1.author')}</ThemedText>
          <ThemedText style={styles.text}>{t('day-1.description')}</ThemedText>
        </View>
      </View>

      <Button
        title={t('listen-now')}
        as="external-link"
        href={link}
      />
    </ScreenContainer>
  )
}

export default BlinkistScreen

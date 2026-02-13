import { useRouter } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'

import { Image, StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'

import { moderateScale, scale, verticalScale } from '@/utils/responsive'
import Button from './button'
import ThemedText from './themed-text'

interface FirstTimePopupProps {
  screenNumber: number
  imageSource: any
}

interface FirstTimePopupContent {
  title: string
  subtitle: string
  description1: string
  description2: string
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  title: {
    color: Colors.light.primary4,
    textAlign: 'center',
    marginBottom: verticalScale(32),
  },
  subtitle: {
    color: Colors.light.primary4,
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  descriptionContainer: {
    backgroundColor: Colors.light.white,
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(16),
    marginHorizontal: scale(16),
    minHeight: verticalScale(273),
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: Colors.light.primary4,
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  descriptionBold: {
    color: Colors.light.primary4,
    fontWeight: '600',
  },
  image: {
    position: 'absolute',
    bottom: -280,
    left: 0,
    right: 0,
    width: '100%',
    height: verticalScale(300),
    resizeMode: 'contain',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: -260,
    left: 16,
    right: 16,
  },
})

function FirstTimePopup({ screenNumber, imageSource }: FirstTimePopupProps) {
  const { t } = useTranslation('home')

  const { back } = useRouter()

  const content = t(`first-time-popups.${screenNumber}`, { returnObjects: true })
  const { title, subtitle } = content as FirstTimePopupContent

  const navigateToHome = () => {
    back()
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      <View style={styles.descriptionContainer}>
        {subtitle && (
          <ThemedText type="defaultSemiBold" style={styles.subtitle}>
            {subtitle}
          </ThemedText>
        )}

        <ThemedText type="default" style={styles.description}>
          <Trans
            i18nKey={`home:first-time-popups.${screenNumber}.description1`}
            components={[
              <ThemedText
                key="0"
                type="defaultSemiBold"
                style={styles.descriptionBold}
              />,
            ]}
          />
        </ThemedText>

        <ThemedText type="default" style={styles.description}>
          <Trans
            i18nKey={`home:first-time-popups.${screenNumber}.description2`}
            components={[
              <ThemedText
                key="0"
                type="defaultSemiBold"
                style={styles.descriptionBold}
              />,
            ]}
          />
        </ThemedText>
      </View>

      <Image source={imageSource} style={styles.image} />

      {screenNumber === 4 && (
        <View style={styles.buttonContainer}>
          <Button
            fullWidth
            variant="secondary"
            title={t('start-now')}
            onPress={navigateToHome}
          />
        </View>
      )}
    </View>
  )
}

export default FirstTimePopup

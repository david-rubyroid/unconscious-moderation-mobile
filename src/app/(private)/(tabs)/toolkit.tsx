import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import BoxBreathingIcon from '@/assets/icons/box-breathing'
import DrinkIcon from '@/assets/icons/drink'
import LampIcon from '@/assets/icons/lamp'
import MoktailIcon from '@/assets/icons/moktail'
import UrgeSurfingMeditationIcon from '@/assets/icons/urge-surfing-meditation'

import boxBreathingImage from '@/assets/images/toolkit/box-breathing.webp'
import drinkTrackerImage from '@/assets/images/toolkit/drink-tracker.webp'
import insightsImage from '@/assets/images/toolkit/insights.webp'
import moktailImage from '@/assets/images/toolkit/moktails.webp'
import urgeSurfingMeditationImage from '@/assets/images/toolkit/urge-surfing-meditation.webp'

import { ExternalResources, ScreenContainer, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(12.5),
  },
  backgroundImage: {
    flex: 1,
  },
  toolkit: {
    minHeight: verticalScale(75),
    paddingVertical: verticalScale(17.5),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolkitOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolkitImageStyle: {
    resizeMode: 'cover',
  },
  toolkitImageFill: {
    ...StyleSheet.absoluteFillObject,
  },
  toolkitText: {
    color: Colors.light.white,
  },
  toolkitContainer: {
    gap: verticalScale(20),
  },
})

function ToolkitScreen() {
  const { t } = useTranslation('toolkit')
  const router = useRouter()

  const navigateToDrinkTracker = () => {
    router.push('/drink-tracker')
  }
  const navigateToBoxBreathing = () => {
    router.push('/box-breathing')
  }
  const navigateToUrgeSurfingMeditation = () => {
    router.push('/urge-surfing-meditation')
  }
  const navigateToInsights = () => {
    void openBrowserAsync('https://um.app/blog/', {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      createTask: false,
    })
  }
  const navigateToMoktails = () => {
    router.push('/moktails')
  }

  return (
    <ScreenContainer>
      <ThemedText style={styles.title} type="subtitle">Toolkit</ThemedText>

      <View style={styles.toolkitContainer}>
        <Pressable onPress={navigateToDrinkTracker}>
          <ImageBackground
            source={drinkTrackerImage}
            style={styles.toolkit}
            imageStyle={styles.toolkitImageStyle}
          >
            <View style={styles.toolkitOverlay} />

            <ThemedText style={styles.toolkitText} type="defaultSemiBold">
              {t('drink-tracker')}
            </ThemedText>

            <DrinkIcon />
          </ImageBackground>
        </Pressable>

        <Pressable onPress={navigateToBoxBreathing}>
          <ImageBackground
            source={boxBreathingImage}
            style={styles.toolkit}
            imageStyle={styles.toolkitImageStyle}
          >
            <View style={styles.toolkitOverlay} />

            <ThemedText style={styles.toolkitText} type="defaultSemiBold">
              {t('box-breathing')}
            </ThemedText>

            <BoxBreathingIcon />
          </ImageBackground>
        </Pressable>

        <Pressable onPress={navigateToUrgeSurfingMeditation}>
          <ImageBackground
            source={urgeSurfingMeditationImage}
            style={styles.toolkit}
            imageStyle={styles.toolkitImageStyle}
          >
            <View style={styles.toolkitOverlay} />

            <ThemedText style={styles.toolkitText} type="defaultSemiBold">
              {t('urge-surfing-meditation')}
            </ThemedText>

            <UrgeSurfingMeditationIcon />
          </ImageBackground>
        </Pressable>

        <Pressable onPress={navigateToMoktails}>
          <ImageBackground
            source={moktailImage}
            style={styles.toolkit}
            imageStyle={styles.toolkitImageStyle}
          >
            <View style={styles.toolkitOverlay} />
            <ThemedText style={styles.toolkitText} type="defaultSemiBold">
              {t('moktails')}
            </ThemedText>
            <MoktailIcon />
          </ImageBackground>
        </Pressable>

        <Pressable onPress={navigateToInsights}>
          <View style={styles.toolkit}>
            <Image
              source={insightsImage}
              style={styles.toolkitImageFill}
              contentPosition={{ bottom: -60 }}
            />
            <View style={styles.toolkitOverlay} />
            <ThemedText style={styles.toolkitText} type="defaultSemiBold">
              {t('insight')}
            </ThemedText>
            <LampIcon />
          </View>
        </Pressable>
      </View>

      <ExternalResources />
    </ScreenContainer>
  )
}

export default ToolkitScreen

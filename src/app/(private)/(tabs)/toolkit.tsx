import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import BoxBreathingIcon from '@/assets/icons/box-breathing'
import UrgeSurfingMeditationIcon from '@/assets/icons/urge-surfing-meditation'
// import DrinkIcon from '@/assets/icons/drink'
import boxBreathingImage from '@/assets/images/toolkit/box-breathing.jpg'
import urgeSurfingMeditationImage from '@/assets/images/toolkit/urge-surfing-meditation.jpg'
// import drinkTrackerImage from '@/assets/images/toolkit/drink-tracker.jpg'

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolkitImageStyle: {
    resizeMode: 'cover',
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

  // const navigateToDrinkTracker = () => {
  //   router.push('/drink-tracker')
  // }

  const navigateToBoxBreathing = () => {
    router.push('/box-breathing')
  }

  const navigateToUrgeSurfingMeditation = () => {
    router.push('/urge-surfing-meditation')
  }

  return (
    <ScreenContainer>
      <ThemedText style={styles.title} type="subtitle">Toolkit</ThemedText>

      <View style={styles.toolkitContainer}>
        {/* <Pressable onPress={navigateToDrinkTracker}>
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
        </Pressable> */}

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
      </View>

      <ExternalResources />
    </ScreenContainer>
  )
}

export default ToolkitScreen

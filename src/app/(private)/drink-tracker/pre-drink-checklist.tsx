import type { Step } from '@/components/progress-steps'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetDrinkSession } from '@/api/queries/drink-session'
import selfHypnosisImage from '@/assets/images/end-of-trial.png'
import mantraImage from '@/assets/images/plan-and-prepare.jpg'

import hydrationImage from '@/assets/images/reflect-and-reinforce.jpg'

import { Button, Header, ProgressSteps, ThemedGradient, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  preparationMessage: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(26),
    fontWeight: '400',
  },
  preparationMessageBold: {
    color: Colors.light.primary4,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  preparationStepsWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: scale(50),
  },
  progressStepsContainer: {
    position: 'absolute',
    left: 0,
    top: verticalScale(35),
    marginRight: scale(15),
  },
  keyMomentsCardsContainer: {
    flex: 1,
    gap: verticalScale(21),
  },
  preparationStepItem: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(20),
    backgroundColor: Colors.light.white,
    borderRadius: scale(20),
    maxHeight: verticalScale(103),
    overflow: 'hidden',
  },
  preparationStepItemImageStyle: {
    resizeMode: 'cover',
    borderRadius: scale(20),
  },
  preparationStepItemOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.85),
    borderRadius: scale(20),
  },
  preparationStepItemTitle: {
    color: Colors.light.white,
  },
  preparationStepItemDescription: {
    color: Colors.light.white,
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
})

function PreDrinkChecklistScreen() {
  const { push } = useRouter()
  const { sessionId } = useLocalSearchParams()

  const { data: session } = useGetDrinkSession(Number(sessionId))

  const { t } = useTranslation('pre-drink-checklist')

  const { top, bottom } = useSafeAreaInsets()

  const steps = [
    {
      id: 'hydration',
      status: session?.hydrated ? 'completed' : 'pending',
    },
    {
      id: 'self-hypnosis',
      status: session?.selfHypnosis ? 'completed' : 'pending',
    },
    {
      id: 'mantra',
      status: session?.mantra ? 'completed' : 'pending',
    },
  ] as Step[]

  const navigateToHydration = () => {
    push({
      pathname: '/drink-tracker/hydration',
      params: { sessionId },
    })
  }
  const navigateToSelfHypnosis = () => {
    push({
      pathname: '/drink-tracker/hypnosis',
      params: { sessionId },
    })
  }
  const navigateToMantra = () => {
    push({
      pathname: '/drink-tracker/mantra',
      params: { sessionId },
    })
  }
  const navigateToDrinkTrackerSteps = () => {
    push({
      pathname: '/drink-tracker/drink-tracker-steps',
      params: { sessionId },
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} />

      <ThemedText type="defaultSemiBold" style={styles.preparationMessage}>
        <Trans
          i18nKey="pre-drink-checklist:description"
          components={[
            <ThemedText type="defaultSemiBold" key="0" style={styles.preparationMessageBold} />,
            <ThemedText type="defaultSemiBold" key="1" style={styles.preparationMessageBold} />,
          ]}
        />
      </ThemedText>

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.preparationStepsWrapper}>
            <View style={styles.progressStepsContainer}>
              <ProgressSteps steps={steps} connectorHeight={verticalScale(80)} />
            </View>

            <View style={styles.keyMomentsCardsContainer}>

              <Pressable onPress={navigateToHydration}>
                <ImageBackground
                  source={hydrationImage}
                  style={styles.preparationStepItem}
                  imageStyle={styles.preparationStepItemImageStyle}
                >
                  <View style={styles.preparationStepItemOverlay} />

                  <ThemedText type="defaultSemiBold" style={styles.preparationStepItemTitle}>
                    {t('hydration')}
                  </ThemedText>

                  <ThemedText type="default" style={styles.preparationStepItemDescription}>
                    {t('hydration-description')}
                  </ThemedText>
                </ImageBackground>
              </Pressable>

              <Pressable onPress={navigateToSelfHypnosis}>
                <ImageBackground
                  source={selfHypnosisImage}
                  style={styles.preparationStepItem}
                  imageStyle={styles.preparationStepItemImageStyle}
                >
                  <View style={styles.preparationStepItemOverlay} />

                  <ThemedText type="defaultSemiBold" style={styles.preparationStepItemTitle}>
                    {t('self-hypnosis')}
                  </ThemedText>

                  <ThemedText type="default" style={styles.preparationStepItemDescription}>
                    {t('self-hypnosis-description')}
                  </ThemedText>
                </ImageBackground>
              </Pressable>

              <Pressable onPress={navigateToMantra}>
                <ImageBackground
                  source={mantraImage}
                  style={styles.preparationStepItem}
                  imageStyle={styles.preparationStepItemImageStyle}
                >
                  <View style={styles.preparationStepItemOverlay} />

                  <ThemedText type="defaultSemiBold" style={styles.preparationStepItemTitle}>
                    {t('mantra')}
                  </ThemedText>

                  <ThemedText type="default" style={styles.preparationStepItemDescription}>
                    {t('mantra-description')}
                  </ThemedText>
                </ImageBackground>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            variant="secondary"
            title={t('ready')}
            onPress={navigateToDrinkTrackerSteps}
          />
        </View>
      </View>

    </ThemedGradient>
  )
}

export default PreDrinkChecklistScreen

import type { Step } from '@/components/progress-steps'
import { useRouter } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'

import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import drinkAwarenessImage from '@/assets/images/drink-with-awareness.jpg'
import planPrepareImage from '@/assets/images/plan-and-prepare.jpg'
import reflectReinforceImage from '@/assets/images/reflect-and-reinforce.jpg'

import {
  Button,
  DrinkTrackerWeekDays,
  Header,
  ProgressSteps,
  ThemedGradient,
  ThemedText,
} from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  content: {
    marginBottom: verticalScale(20),
  },
  keyMomentsText: {
    marginVertical: verticalScale(26),
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: '400',

  },
  keyMomentsTextBold: {
    color: Colors.light.primary4,
  },
  keyMomentsContainer: {
    gap: verticalScale(21),
  },
  keyMomentsWrapper: {
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
  keyMomentsItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(35),
    paddingHorizontal: scale(20),
    backgroundColor: Colors.light.white,
    borderRadius: scale(20),
    maxHeight: verticalScale(103),
    overflow: 'hidden',
  },
  keyMomentsItemOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.85),
    borderRadius: scale(20),
  },
  keyMomentsItemImageStyle: {
    resizeMode: 'cover',
    borderRadius: scale(20),
  },
  keyMomentsItemTitle: {
    color: Colors.light.white,
  },
  keyMomentsItemDescription: {
    color: Colors.light.white,
    textAlign: 'center',
  },
  tipText: {
    marginVertical: verticalScale(26),
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
})

function DrinkTrackerScreen() {
  const router = useRouter()

  const { t } = useTranslation('drink-tracker')

  const { top, bottom } = useSafeAreaInsets()

  const handleStartPlanning = () => {
    router.push('/drink-tracker/plan-and-prepare')
  }

  const steps = [
    {
      id: 'plan-prepare',
      status: 'pending',
    },
    {
      id: 'drink-awareness',
      status: 'pending',
    },
    {
      id: 'reflect-reinforce',
      status: 'pending',
    },
  ] as Step[]

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} />

      <View style={styles.container}>
        <DrinkTrackerWeekDays />

        <ThemedText type="defaultSemiBold" style={styles.keyMomentsText}>
          <Trans
            i18nKey="drink-tracker:key-moments.title"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={styles.keyMomentsTextBold} />,
            ]}
          />
        </ThemedText>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.keyMomentsWrapper}>
            <View style={styles.progressStepsContainer}>
              <ProgressSteps steps={steps} connectorHeight={verticalScale(80)} />
            </View>

            <View style={styles.keyMomentsCardsContainer}>
              <ImageBackground
                source={planPrepareImage}
                style={styles.keyMomentsItem}
                imageStyle={styles.keyMomentsItemImageStyle}
              >
                <View style={styles.keyMomentsItemOverlay} />

                <ThemedText type="defaultSemiBold" style={styles.keyMomentsItemTitle}>
                  {t('key-moments.plan-prepare.title')}
                </ThemedText>

                <ThemedText type="default" style={styles.keyMomentsItemDescription}>
                  {t('key-moments.plan-prepare.description')}
                </ThemedText>
              </ImageBackground>

              <ImageBackground
                source={drinkAwarenessImage}
                style={styles.keyMomentsItem}
                imageStyle={styles.keyMomentsItemImageStyle}
              >
                <View style={styles.keyMomentsItemOverlay} />

                <ThemedText type="defaultSemiBold" style={styles.keyMomentsItemTitle}>
                  {t('key-moments.drink-awareness.title')}
                </ThemedText>

                <ThemedText type="default" style={styles.keyMomentsItemDescription}>
                  {t('key-moments.drink-awareness.description')}
                </ThemedText>
              </ImageBackground>

              <ImageBackground
                source={reflectReinforceImage}
                style={styles.keyMomentsItem}
                imageStyle={styles.keyMomentsItemImageStyle}
              >
                <View style={styles.keyMomentsItemOverlay} />

                <ThemedText type="defaultSemiBold" style={styles.keyMomentsItemTitle}>
                  {t('key-moments.reflect-reinforce.title')}
                </ThemedText>

                <ThemedText type="default" style={styles.keyMomentsItemDescription}>
                  {t('key-moments.reflect-reinforce.description')}
                </ThemedText>
              </ImageBackground>
            </View>
          </View>
        </ScrollView>

        <ThemedText type="defaultSemiBold" style={styles.tipText}>
          {t('tip')}
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Button variant="secondary" title={t('actions.start')} onPress={handleStartPlanning} />
        </View>
      </View>
    </ThemedGradient>
  )
}

export default DrinkTrackerScreen

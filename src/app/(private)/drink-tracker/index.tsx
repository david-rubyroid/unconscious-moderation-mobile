import { useRouter } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button, Header, ThemedGradient, ThemedText } from '@/components'
import { Colors } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(15),
  },
  motivationalMessage: {
    textAlign: 'center',
    fontWeight: '400',
    color: Colors.light.primary4,
    marginBottom: verticalScale(20),
  },
  motivationalMessageBold: {
    fontWeight: '700',
    color: Colors.light.primary4,
  },
  daysContainer: {
    gap: scale(20),
    flexDirection: 'row',
    marginBottom: verticalScale(20),
  },
  daysText: {
    fontWeight: 500,
    color: Colors.light.primary4,
  },
  actionsContainer: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  planSessionButton: {
    width: 174,
  },
})

function DrinkTrackerScreen() {
  const { push } = useRouter()

  const { t } = useTranslation('drink-tracker')

  const { top, bottom } = useSafeAreaInsets()

  const handlePlanSession = () => {
    push('/drink-tracker/plan-session')
  }
  const handleStartTodaySession = () => {
    push('/drink-tracker/drink-tracker-steps')
  }

  return (
    <ThemedGradient style={[{
      paddingTop: top + verticalScale(10),
      paddingBottom: bottom + verticalScale(10),
    }]}
    >
      <Header title={t('title')} />

      <View style={styles.container}>
        <ThemedText
          type="defaultSemiBold"
          style={styles.motivationalMessage}
        >
          <Trans
            i18nKey="drink-tracker:motivational-message"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={styles.motivationalMessageBold} />,
            ]}
          />
        </ThemedText>

        <View style={styles.daysContainer}>
          <ThemedText style={styles.daysText}>{t('won-days', { days: 0 })}</ThemedText>
          <ThemedText style={styles.daysText}>{t('drink-days', { days: 0 })}</ThemedText>
        </View>

        <View style={styles.actionsContainer}>
          <Button onPress={handlePlanSession} style={styles.planSessionButton} title={t('actions.plan-session')} variant="secondary" />
          <Button onPress={handleStartTodaySession} title={t('actions.start-today-session')} variant="secondary" />
        </View>
      </View>
    </ThemedGradient>
  )
}

export default DrinkTrackerScreen

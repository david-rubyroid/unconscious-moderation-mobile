import { useRouter } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useGetCurrentDrinkSession } from '@/api/queries/drink-session'

import {
  Button,
  DrinkSessionsCalendar,
  Header,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors } from '@/constants/theme'
import { verticalScale } from '@/utils/responsive'

import FirstTimePopUp from './first-time-pop-up'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  actionsContainer: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  planSessionButton: {
    width: 174,
  },
  startTodaySessionButton: {
    width: 265,
  },
  calendarContainer: {
    position: 'relative',
    width: '100%',
  },
  calendarMoreButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  calendarMoreButtonText: {
    fontWeight: 400,
    color: Colors.light.primary4,
  },
})

function DrinkTrackerScreen() {
  const { push } = useRouter()

  const { t } = useTranslation('drink-tracker')

  // get current drink session for today if exists or active
  const { data: currentDrinkSession } = useGetCurrentDrinkSession()

  const isSessionActive = currentDrinkSession?.status === 'active'
  const isSessionCompleted = currentDrinkSession?.status === 'completed'

  const startSessionButtonTitle = isSessionActive
    ? t('continue-with-active-session')
    : isSessionCompleted
      ? t('completed-session')
      : t('actions.start-today-session')

  const navigateToPlanSession = () => {
    push('/drink-tracker/plan-session')
  }
  const navigateToInsightsDashboard = () => {
    push('/drink-tracker/insights-dashboard')
  }
  const navigateToStartTodaySession = () => {
    if (!currentDrinkSession) {
      Toast.show({
        type: 'info',
        text1: t('info-no-session-found'),
        text2: t('info-no-session-found-description'),
      })
      return
    }

    if (isSessionCompleted) {
      push({
        pathname: '/drink-tracker/reflect-reinforce',
        params: { sessionId: currentDrinkSession?.id },
      })
      return
    }

    if (isSessionActive) {
      push({
        pathname: '/drink-tracker/drink-with-awareness',
        params: { sessionId: currentDrinkSession?.id },
      })
      return
    }

    push({
      pathname: '/drink-tracker/pre-drink-checklist',
      params: { sessionId: currentDrinkSession?.id },
    })
  }

  return (
    <ScreenContainer>
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

        <View style={styles.calendarContainer}>
          <Pressable onPress={navigateToInsightsDashboard} style={styles.calendarMoreButton}>
            <ThemedText type="defaultSemiBold" style={styles.calendarMoreButtonText}>
              More &gt;
            </ThemedText>
          </Pressable>

          <DrinkSessionsCalendar showWonAndDrinkDays />
        </View>

        <View style={styles.actionsContainer}>
          <Button
            onPress={navigateToPlanSession}
            style={styles.planSessionButton}
            title={t('actions.plan-session')}
            variant="secondary"
          />

          <Button
            onPress={navigateToStartTodaySession}
            title={startSessionButtonTitle}
            variant="secondary"
            style={styles.startTodaySessionButton}
          />
        </View>
      </View>

      <FirstTimePopUp />
    </ScreenContainer>
  )
}

export default DrinkTrackerScreen

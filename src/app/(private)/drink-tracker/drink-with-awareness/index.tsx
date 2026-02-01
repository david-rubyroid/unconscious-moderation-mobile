import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useGetSessionDrinks } from '@/api/queries/drink-log'
import { useGetDrinkSession, useUpdateDrinkSession } from '@/api/queries/drink-session'
import { useGetSessionWater, useLogWater } from '@/api/queries/water-log'
import { queryClient } from '@/api/query-client'

import {
  Button,
  DrinkTrackerWeekDays,
  Header,
  ScreenContainer,
  ThemedText,
} from '@/components'

import {
  useDrinkAwarenessModals,
  useDrinkAwarenessNavigation,
  usePlannedLimitTracker,
} from '@/hooks/drink-with-awareness'

import { getCurrencySymbol } from '@/utils/currency'
import { getDrinkSessionStats } from '@/utils/drink-session-stats'
import { getHypnosisCheckInForHour } from '@/utils/hypnosis-check-in'

import {
  DrinkCounter,
  FinishDrinkingModal,
  HypnosisCheckInBanner,
  HypnosisCheckInModal,
  LoggedDrinksList,
  ManageUrgesModal,
  PlannedLimitWarningModal,
  ProTipCard,
  SessionInfoCards,
  WaterCounter,
  WaterLogSuccessModal,
} from './components'

import { styles } from './drink-with-awareness.styles'

const s = styles.screen

function DrinkWithAwarenessScreen() {
  const { t } = useTranslation('drink-with-awareness')
  const { sessionId } = useLocalSearchParams()

  // Data fetching
  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))
  const { data: sessionDrinks } = useGetSessionDrinks(Number(sessionId))
  const { data: sessionWater } = useGetSessionWater(Number(sessionId))
  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))
  const modals = useDrinkAwarenessModals()

  const { mutate: logWater, isPending: isLoggingWater } = useLogWater(
    Number(sessionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'drink-tracker',
            'sessions',
            Number(sessionId),
            'water',
          ],
        })
      },
    },
  )

  // Computed values
  const {
    actualDrinksCount,
    maxDrinksCount,
    actualSpending,
    budget,
    totalWaterCups,
    timeSinceFirstDrink,
    hoursSinceFirstDrink,
  } = getDrinkSessionStats({ drinkSession, sessionDrinks, sessionWater })

  const hypnosisCheckIn = getHypnosisCheckInForHour(hoursSinceFirstDrink)
  const currencySymbol = getCurrencySymbol(drinkSession?.currency)

  const navigation = useDrinkAwarenessNavigation({
    sessionId,
    updateDrinkSession,
  })

  // Track when drinks count exceeds planned limit
  usePlannedLimitTracker({
    actualDrinksCount,
    maxDrinksCount,
    onLimitExceeded: modals.openPlannedLimitWarning,
  })

  // Handlers
  const handleLogWater = (cups: number) => {
    if (cups === 0) {
      return
    }

    logWater({ cups }, {
      onSuccess: () => {
        if (cups >= 1) {
          modals.openWaterLogSuccessModal()
        }
      },
    })
  }

  const handleManageUrges = () => {
    modals.openManageUrgesModal()
  }
  const handleManageUrgesContinue = () => {
    modals.closeManageUrgesModal()
    navigation.navigateToManageUrges()
  }
  const handleHypnosisConfirm = () => {
    modals.closeHypnosisModal()
    navigation.navigateToSelfHypnosis(
      modals.hypnosisCheckInLink,
      modals.hypnosisCheckInTitle,
      modals.hypnosisCheckInType,
      hoursSinceFirstDrink,
    )
  }
  const handleFinishDrinkingConfirm = () => {
    modals.closeFinishDrinkingModal()
    navigation.handleFinishDrinking()
  }

  return (
    <>
      <ScreenContainer contentContainerStyle={s.screenContentContainer}>
        <Header title={t('title')} />

        <DrinkTrackerWeekDays />

        <ThemedText type="defaultSemiBold" style={s.remember}>
          {t('remember', { mantra: drinkSession?.mantra })}
        </ThemedText>

        <View style={s.countersContainer}>
          <DrinkCounter
            actualDrinksCount={actualDrinksCount}
            maxDrinksCount={maxDrinksCount}
            onLogDrink={navigation.navigateToLogDrink}
          />

          <WaterCounter
            totalWaterCups={totalWaterCups}
            handleLogWater={handleLogWater}
            isLoggingWater={isLoggingWater}
          />
        </View>

        <LoggedDrinksList
          currencySymbol={currencySymbol}
          sessionDrinks={sessionDrinks}
        />

        <ProTipCard />

        <SessionInfoCards
          actualSpending={actualSpending}
          budget={budget}
          timeSinceFirstDrink={timeSinceFirstDrink}
          currencySymbol={currencySymbol}
        />

        <HypnosisCheckInBanner
          sessionId={Number(sessionId)}
          hoursSinceFirstDrink={hoursSinceFirstDrink}
          hypnosisCheckIn={hypnosisCheckIn}
          onPress={modals.openHypnosisModal}
        />

        <View style={s.buttonsContainer}>
          <Button
            onPress={handleManageUrges}
            title={t('manage-urges')}
            style={[s.button, s.manageUrgesButton]}
          />

          <Button
            style={[s.button, s.finishDrinkingButton]}
            title={t('finish-drinking')}
            variant="secondary"
            onPress={modals.openFinishDrinkingModal}
          />
        </View>
      </ScreenContainer>

      <ManageUrgesModal
        visible={modals.isManageUrgesModalVisible}
        onClose={modals.closeManageUrgesModal}
        onContinue={handleManageUrgesContinue}
      />

      <PlannedLimitWarningModal
        visible={modals.isPlannedLimitWarningVisible}
        onClose={modals.closePlannedLimitWarning}
      />

      <HypnosisCheckInModal
        visible={modals.isHypnosisModalVisible}
        onClose={modals.closeHypnosisModal}
        onConfirm={handleHypnosisConfirm}
      />

      <FinishDrinkingModal
        visible={modals.isFinishDrinkingModalVisible}
        onClose={modals.closeFinishDrinkingModal}
        onConfirm={handleFinishDrinkingConfirm}
      />

      <WaterLogSuccessModal
        visible={modals.isWaterLogSuccessModalVisible}
        onClose={modals.closeWaterLogSuccessModal}
      />
    </>
  )
}

export default DrinkWithAwarenessScreen

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useGetSessionDrinks } from '@/api/queries/drink-log'
import { useGetDrinkSession, useUpdateDrinkSession } from '@/api/queries/drink-session'
import { useGetSessionWater, useLogWater } from '@/api/queries/water-log'

import { queryClient } from '@/api/query-client'

import {
  Button,
  DrinkTrackerWeekDays,
  Header,
  Modal,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { getDrinkSessionStats } from '@/utils/drink-session-stats'

import {
  DrinkCounter,
  LoggedDrinksList,
  ProTipCard,
  SessionInfoCards,
  WaterCounter,
} from './_components'

import { styles } from './_drink-with-awareness.styles'

function DrinkWithAwarenessScreen() {
  const [isManageUrgesModalVisible, setIsManageUrgesModalVisible] = useState(false)
  const [isPlannedLimitWarningVisible, setIsPlannedLimitWarningVisible] = useState(false)
  const [isHypnosisModalVisible, setIsHypnosisModalVisible] = useState(false)
  const [isFinishDrinkingModalVisible, setIsFinishDrinkingModalVisible] = useState(false)
  const previousDrinksCountRef = useRef<number>(0)

  const { push, replace } = useRouter()
  const { t } = useTranslation('drink-with-awareness')
  const { sessionId } = useLocalSearchParams()

  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))
  const { data: sessionDrinks } = useGetSessionDrinks(Number(sessionId))
  const { data: sessionWater } = useGetSessionWater(Number(sessionId))
  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))
  const { mutate: logWater, isPending: isLoggingWater } = useLogWater(
    Number(sessionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', Number(sessionId), 'water'] })
      },
    },
  )

  const {
    actualDrinksCount,
    maxDrinksCount,
    actualSpending,
    budget,
    totalWaterCups,
    timeSinceFirstDrink,
  } = getDrinkSessionStats({ drinkSession, sessionDrinks, sessionWater })

  // Modal handlers
  const handleOpenPlannedLimitWarning = () => {
    setIsPlannedLimitWarningVisible(true)
  }
  const handleClosePlannedLimitWarning = () => {
    setIsPlannedLimitWarningVisible(false)
  }
  const handleOpenManageUrgesModal = () => {
    setIsManageUrgesModalVisible(true)
  }
  const handleCloseManageUrgesModal = () => {
    setIsManageUrgesModalVisible(false)
  }
  const handleOpenHypnosisModal = () => {
    setIsHypnosisModalVisible(true)
  }
  const handleCloseHypnosisModal = () => {
    setIsHypnosisModalVisible(false)
  }
  const handleOpenFinishDrinkingModal = () => {
    setIsFinishDrinkingModalVisible(true)
  }
  const handleCloseFinishDrinkingModal = () => {
    setIsFinishDrinkingModalVisible(false)
  }
  // Navigation handlers
  const navigateToLogDrink = () => {
    push({
      pathname: '/drink-tracker/log-drink',
      params: { sessionId },
    })
  }
  const navigateToSelfHypnosis = () => {
    push({
      pathname: '/drink-tracker/hypnosis',
      params: { sessionId },
    })
  }
  const navigateToManageUrges = () => {
    handleOpenManageUrgesModal()
  }
  const handleContinue = () => {
    setIsManageUrgesModalVisible(false)
    push({
      pathname: '/drink-tracker/manage-urges',
      params: { sessionId },
    })
  }
  const handleLogWater = () => {
    logWater({ cups: 1 })
  }
  const handleFinishDrinking = () => {
    updateDrinkSession({
      status: 'completed',
    }, {
      onSuccess: () => {
        replace({
          pathname: '/drink-tracker/reflect-reinforce',
          params: { sessionId },
        })
      },
    })
  }

  // Track when drinks count exceeds planned limit
  useEffect(() => {
    const previousCount = previousDrinksCountRef.current
    const hasExceededLimit = actualDrinksCount > maxDrinksCount
    const hasIncreased = actualDrinksCount > previousCount

    // Show warning if limit is exceeded AND drinks count has increased (not on initial load)
    if (hasExceededLimit && hasIncreased && previousCount > 0) {
      handleOpenPlannedLimitWarning()
    }

    // Update previous count
    previousDrinksCountRef.current = actualDrinksCount
  }, [actualDrinksCount, maxDrinksCount])

  return (
    <>

      <ScreenContainer>
        <Header title={t('title')} />

        <View style={styles.weekDaysContainer}>
          <DrinkTrackerWeekDays />
        </View>

        <ThemedText type="defaultSemiBold" style={styles.remember}>
          {t('remember', { mantra: drinkSession?.mantra })}
        </ThemedText>

        <View style={styles.countersContainer}>
          <DrinkCounter
            actualDrinksCount={actualDrinksCount}
            maxDrinksCount={maxDrinksCount}
            onLogDrink={navigateToLogDrink}
          />

          <WaterCounter
            totalWaterCups={totalWaterCups}
            onLogWater={handleLogWater}
            isLoggingWater={isLoggingWater}
          />
        </View>

        <LoggedDrinksList sessionDrinks={sessionDrinks} />

        <ProTipCard />

        <SessionInfoCards
          actualSpending={actualSpending}
          budget={budget}
          timeSinceFirstDrink={timeSinceFirstDrink}
        />

        <View style={styles.buttonsContainer}>
          <Button
            title={t('self-hypnosis')}
            style={styles.button}
            onPress={handleOpenHypnosisModal}
          />

          <Button
            onPress={navigateToManageUrges}
            title={t('manage-urges')}
            style={[styles.button, styles.manageUrgesButton]}
          />
        </View>

        <Button
          style={styles.finishDrinkingButton}
          title={t('finish-drinking')}
          variant="secondary"
          onPress={handleOpenFinishDrinkingModal}
        />
      </ScreenContainer>

      <Modal
        visible={isManageUrgesModalVisible}
        onClose={handleCloseManageUrgesModal}
      >
        <View style={styles.modalContent}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {t('we-get-it')}
          </ThemedText>

          <ThemedText type="default" style={styles.modalText}>
            <Trans
              i18nKey="drink-with-awareness:struggling-with-an-urge"
              components={[
                <ThemedText key="0" type="defaultSemiBold" style={styles.modalTextBold} />,
                <ThemedText key="1" type="defaultSemiBold" style={styles.modalText} />,
                <ThemedText key="2" type="defaultSemiBold" style={styles.modalText} />,
              ]}
            />
          </ThemedText>

          <ThemedText type="default" style={styles.modalText}>
            <Trans
              i18nKey="drink-with-awareness:first-things-first"
              components={[
                <ThemedText key="0" type="defaultSemiBold" style={styles.modalTextBold} />,
              ]}
            />
          </ThemedText>

          <ThemedText type="default" style={styles.modalText}>
            <Trans
              i18nKey="drink-with-awareness:if-the-urge-feels-overwhelming"
              components={[
                <ThemedText key="0" type="defaultSemiBold" style={styles.modalTextBold} />,
              ]}
            />
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.modalTextBold}>
            {t('you-ve-got-this')}
          </ThemedText>

          <Button
            style={styles.modalButton}
            title={t('continue')}
            onPress={handleContinue}
          />
        </View>
      </Modal>

      <Modal
        visible={isPlannedLimitWarningVisible}
        onClose={handleClosePlannedLimitWarning}
      >
        <View style={styles.modalContent}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {t('warning-exceeding-your-planned-limit')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.modalText}>
            <Trans
              i18nKey="drink-with-awareness:warning-exceeding-your-planned-limit-description"
              components={[
                <ThemedText key="0" type="defaultSemiBold" style={styles.modalTextBold} />,
              ]}
            />
          </ThemedText>

          <Button
            style={styles.modalButton}
            title={t('okay')}
            onPress={handleClosePlannedLimitWarning}
          />
        </View>
      </Modal>

      <Modal
        visible={isHypnosisModalVisible}
        onClose={handleCloseHypnosisModal}
      >
        <View style={styles.modalContent}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {t('time-for-your-hypnosis')}
          </ThemedText>

          <ThemedText type="default" style={styles.modalText}>
            {t('time-for-your-hypnosis-description')}
          </ThemedText>

          <Button
            style={styles.modalButton}
            title={t('continue')}
            onPress={() => {
              handleCloseHypnosisModal()
              navigateToSelfHypnosis()
            }}
          />
        </View>
      </Modal>

      <Modal
        visible={isFinishDrinkingModalVisible}
        onClose={handleCloseFinishDrinkingModal}
      >
        <View style={styles.modalContent}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {t('great-job-tracking-your-drinks-tonight')}
          </ThemedText>

          <ThemedText type="default" style={styles.modalText}>
            {t('great-job-tracking-your-drinks-tonight-description')}
          </ThemedText>

          <Button
            style={styles.modalButton}
            title={t('continue')}
            onPress={() => {
              handleCloseFinishDrinkingModal()
              handleFinishDrinking()
            }}
          />
        </View>
      </Modal>
    </>
  )
}

export default DrinkWithAwarenessScreen

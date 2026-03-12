import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import {
  Button,
  DrinkSessionsCalendar,
  Header,
  ScreenContainer,
  SessionMetrics,
} from '@/components'

import { useMonthlyMetrics } from '@/hooks/use-monthly-metrics'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(26),
  },
  button: {
    flex: 1,
  },
  homeButton: {
    width: 106,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: scale(16),
  },
})

function InsightsDashboardScreen() {
  const { push, back } = useRouter()
  const { t } = useTranslation('drink-tracker')

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const monthlyMetrics = useMonthlyMetrics(selectedMonth, selectedYear)

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  const navigateToDrinkTrackerJournal = () => {
    push('/drink-tracker/drink-tracker-journal')
  }
  const navigateToHome = () => {
    back()
  }

  return (
    <ScreenContainer>
      <Header title={t('insights-dashboard')} backButton={false} />

      <View style={styles.container}>
        <DrinkSessionsCalendar
          withNavigationButtons
          onMonthChange={handleMonthChange}
          month={selectedMonth}
          year={selectedYear}
        />

        <SessionMetrics
          actualDrinksCount={monthlyMetrics.totalDrinks}
          maxDrinksCount={monthlyMetrics.maxDrinks}
          totalWaterCups={monthlyMetrics.totalWater}
          actualSpent={monthlyMetrics.totalSpent}
          showEndTime={false}
        />

        <View style={styles.buttonsContainer}>
          <Button
            style={styles.homeButton}
            title={t('home')}
            onPress={navigateToHome}
          />

          <Button
            style={styles.button}
            title={t('drink-tracker-journal')}
            variant="secondary"
            onPress={navigateToDrinkTrackerJournal}
          />
        </View>
      </View>
    </ScreenContainer>
  )
}

export default InsightsDashboardScreen

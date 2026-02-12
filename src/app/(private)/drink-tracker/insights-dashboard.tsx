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
import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(26),
  },
  button: {
    alignSelf: 'center',
  },
})

function InsightsDashboardScreen() {
  const { push } = useRouter()
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

  return (
    <ScreenContainer>
      <Header title={t('insights-dashboard')} />

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

        <Button
          style={styles.button}
          title={t('drink-tracker-journal')}
          variant="secondary"
          onPress={navigateToDrinkTrackerJournal}
        />
      </View>
    </ScreenContainer>
  )
}

export default InsightsDashboardScreen

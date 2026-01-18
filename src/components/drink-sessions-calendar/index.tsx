import type { CalendarDayData } from '@/components/calendar/types'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'
import { useAuth } from '@/context/auth/use'

import { useCalendarDayModal } from '@/hooks/drink-sessions-calendar/use-calendar-day-modal'
import { useDrinkSessionsCalendar } from '@/hooks/drink-sessions-calendar/use-drink-sessions-calendar'

import { isBeforeAccountCreation, isFutureDay } from '@/utils/calendar-date'
import { scale, verticalScale } from '@/utils/responsive'

import Calendar from '../calendar'
import ThemedText from '../themed-text'
import { CalendarDayContent } from './calendar-day-content'
import DaySummaryModal from './day-summary-modal'

interface DrinkSessionsCalendarProps {
  withNavigationButtons?: boolean
  onMonthChange?: (_month: number, _year: number) => void
  month?: number
  year?: number
  minDate?: Date
  showWonAndDrinkDays?: boolean
}

const styles = StyleSheet.create({
  metricsContainer: {
    gap: scale(20),
    flexDirection: 'row',
    marginVertical: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsText: {
    fontWeight: 500,
    color: Colors.light.primary4,
  },
})

function DrinkSessionsCalendar({
  withNavigationButtons = false,
  onMonthChange,
  month,
  year,
  minDate: minDateProp,
  showWonAndDrinkDays = false,
}: DrinkSessionsCalendarProps) {
  const { user } = useAuth()
  const { t } = useTranslation('drink-tracker')
  const daysData = useDrinkSessionsCalendar(month, year)

  // Set minDate to user's account creation date (can be overridden via prop)
  // Note: extractUTCDate is called inside isBeforeAccountCreation, not here
  const minDate = minDateProp ?? (user?.createdAt ? new Date(user.createdAt) : undefined)

  // Calculate won-days and drink-days from current month sessions
  const metrics = useMemo(() => {
    const completedSessions = daysData.filter(
      session => session.status === 'completed',
    )
    const drinkDaysCount = completedSessions.length

    // Won days are days with planned sessions that were not completed (abstained)
    const plannedSessions = daysData.filter(
      session => session.status === 'planned',
    )
    const wonDaysCount = plannedSessions.length

    return {
      wonDays: wonDaysCount,
      drinkDays: drinkDaysCount,
    }
  }, [daysData])

  const {
    selectedDay,
    selectedDayData,
    isModalVisible,
    handleDayPress,
    handleCloseModal,
  } = useCalendarDayModal({ daysData })

  const renderDayContent = (day: Date, dayData?: CalendarDayData) => {
    const futureDay = isFutureDay(day)
    const beforeAccount = isBeforeAccountCreation(day, minDate)

    return (
      <CalendarDayContent
        day={day}
        dayData={dayData}
        isFutureDay={futureDay}
        isBeforeAccount={beforeAccount}
      />
    )
  }

  return (
    <>
      <Calendar
        withNavigationButtons={withNavigationButtons}
        daysData={daysData}
        renderDayContent={renderDayContent}
        onDayPress={handleDayPress}
        onMonthChange={onMonthChange}
        initialMonth={month}
        initialYear={year}
        minDate={minDate}
      />

      {showWonAndDrinkDays && (
        <View style={styles.metricsContainer}>
          <ThemedText style={styles.metricsText}>
            {t('won-days', { days: metrics.wonDays })}
          </ThemedText>
          <ThemedText style={styles.metricsText}>
            {t('drink-days', { days: metrics.drinkDays })}
          </ThemedText>
        </View>
      )}

      <DaySummaryModal
        visible={isModalVisible}
        day={selectedDay}
        dayData={selectedDayData}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default DrinkSessionsCalendar

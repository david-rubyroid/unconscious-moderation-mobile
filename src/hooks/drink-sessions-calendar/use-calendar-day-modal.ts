import type { CalendarDayData } from '@/components/calendar/types'

import { useState } from 'react'

import { findDayData, isFutureDay } from '@/utils/calendar-date'

interface UseCalendarDayModalProps {
  daysData: CalendarDayData[]
}

interface UseCalendarDayModalReturn {
  selectedDay: Date | null
  selectedDayData: CalendarDayData | undefined
  isModalVisible: boolean
  handleDayPress: (_day: Date, _dayData?: CalendarDayData) => void
  handleCloseModal: () => void
}

export function useCalendarDayModal({ daysData }: UseCalendarDayModalProps): UseCalendarDayModalReturn {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleDayPress = (day: Date, dayData?: CalendarDayData) => {
    const futureDay = isFutureDay(day)

    // Show modal for:
    // - Past days: completed sessions or abstained days (no dayData)
    // - Any day: planned sessions (can be future or past)
    if (dayData?.status === 'planned') {
      // Always show modal for planned sessions
      setSelectedDay(day)
      setIsModalVisible(true)
    }
    else if (!futureDay) {
      // For past days: show for completed sessions or abstained days
      if (!dayData || dayData.status === 'completed') {
        setSelectedDay(day)
        setIsModalVisible(true)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedDay(null)
  }

  // Find dayData for selected day
  const selectedDayData = selectedDay ? findDayData(selectedDay, daysData) : undefined

  return {
    selectedDay,
    selectedDayData,
    isModalVisible,
    handleDayPress,
    handleCloseModal,
  }
}

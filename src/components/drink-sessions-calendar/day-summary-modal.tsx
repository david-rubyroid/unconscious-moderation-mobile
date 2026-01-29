import type { CalendarDayData } from '@/components/calendar/types'

import { StyleSheet, View } from 'react-native'

import { useDaySummaryLogic } from '@/hooks/drink-sessions-calendar/use-day-summary-logic'

import Modal from '../modal'

import { AbstainedDayContent } from './day-summary/abstained-day-content'
import { CompletedSessionContent } from './day-summary/completed-session-content'
import { PlannedSessionContent } from './day-summary/planned-session-content'

interface DaySummaryModalProps {
  visible: boolean
  day: Date | null
  dayData?: CalendarDayData
  onClose: () => void
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
})

function DaySummaryModal({
  visible,
  day,
  dayData,
  onClose,
}: DaySummaryModalProps) {
  const logic = useDaySummaryLogic({ day, dayData, onClose })

  if (!day) {
    return null
  }

  // Show modal for: completed sessions, planned sessions, or abstained days (no dayData)
  if (dayData && !['completed', 'planned'].includes(dayData.status || '')) {
    return null
  }

  return (
    <Modal
      variant="gradient"
      fullWidth
      visible={visible}
      onClose={onClose}
    >
      <View style={styles.card}>
        {logic.isAbstained && (
          <AbstainedDayContent dayName={logic.dayName} />
        )}

        {logic.isPlanned && dayData && (
          <PlannedSessionContent
            dayData={dayData}
            onEdit={logic.handleEditSession}
            onDelete={logic.handleDeleteSession}
          />
        )}

        {(logic.isFollowed || logic.isExceeded) && dayData && (
          <CompletedSessionContent
            dayName={logic.dayName}
            dayData={dayData}
            isExceeded={logic.isExceeded}
          />
        )}
      </View>
    </Modal>
  )
}

export default DaySummaryModal

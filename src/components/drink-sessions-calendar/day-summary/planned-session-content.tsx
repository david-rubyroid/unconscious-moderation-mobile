import type { CalendarDayData } from '@/components/calendar/types'

import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Button, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

interface PlannedSessionContentProps {
  dayData: CalendarDayData
  onEdit: () => void
  onDelete: () => void
}

const styles = StyleSheet.create({
  statsContainer: {
    alignItems: 'center',
    gap: verticalScale(5),
  },
  messageText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  messageBold: {
    color: Colors.light.primary4,
  },
  plannedSessionDetailsContainer: {
    gap: scale(13),
    marginTop: verticalScale(16),
  },
  plannedSessionDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plannedSessionDetailsItemText: {
    width: '100%',
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    paddingHorizontal: scale(11),
    paddingVertical: verticalScale(21),
    color: Colors.light.primary4,
    textAlign: 'center',
    borderRadius: scale(8),
  },
  plannedSessionDetailsButtonContainer: {
    gap: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plannedSessionDetailsButton: {
    marginTop: verticalScale(37),
    width: 130,
  },
})

export function PlannedSessionContent({ dayData, onEdit, onDelete }: PlannedSessionContentProps) {
  const { t } = useTranslation('drink-tracker')

  return (
    <View style={styles.statsContainer}>
      <ThemedText style={styles.messageText}>
        <Trans
          i18nKey="drink-tracker:day-summary.planned-session-reminder"
          components={[
            <ThemedText
              key="0"
              type="defaultSemiBold"
              style={styles.messageBold}
            />,
          ]}
        />
      </ThemedText>

      <View style={styles.plannedSessionDetailsContainer}>
        <View style={styles.plannedSessionDetailsItem}>
          <ThemedText type="defaultSemiBold" style={styles.plannedSessionDetailsItemText}>
            {t('day-summary.drink-type', { type: dayData?.drinkType || '' })}
          </ThemedText>
        </View>

        <View style={styles.plannedSessionDetailsItem}>
          <ThemedText type="defaultSemiBold" style={styles.plannedSessionDetailsItemText}>
            {t('day-summary.max-drinks', { maxDrinks: dayData?.maxDrinkCount || 0 })}
          </ThemedText>
        </View>

        <View style={styles.plannedSessionDetailsItem}>
          <ThemedText type="defaultSemiBold" style={styles.plannedSessionDetailsItemText}>
            {t('day-summary.budget', { budget: dayData?.budget || 0 })}
          </ThemedText>
        </View>
      </View>

      <View style={styles.plannedSessionDetailsButtonContainer}>
        <Button
          variant="secondary"
          title={t('day-summary.edit-session')}
          onPress={onEdit}
          style={styles.plannedSessionDetailsButton}
        />

        <Button
          variant="secondary"
          title={t('day-summary.delete-session')}
          onPress={onDelete}
          style={styles.plannedSessionDetailsButton}
        />
      </View>
    </View>
  )
}

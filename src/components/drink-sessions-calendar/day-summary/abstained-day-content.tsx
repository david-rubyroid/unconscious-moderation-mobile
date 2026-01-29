import { Trans } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HeartOutlineIcon from '@/assets/icons/heart-outline'

import { Colors } from '@/constants/theme'

import { verticalScale } from '@/utils/responsive'

import ThemedText from '../../themed-text'

interface AbstainedDayContentProps {
  dayName: string
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  dayName: {
    color: Colors.light.primary4,
  },
  messageText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  messageBold: {
    color: Colors.light.primary4,
  },
})

export function AbstainedDayContent({
  dayName,
}: AbstainedDayContentProps) {
  return (
    <View style={styles.container}>
      <ThemedText
        type="subtitle"
        style={styles.dayName}
      >
        {dayName}
      </ThemedText>

      <HeartOutlineIcon color={Colors.light.primary4} />

      <ThemedText style={styles.messageText}>
        <Trans
          i18nKey="drink-tracker:day-summary.abstained"
          components={[
            <ThemedText key="0" type="defaultSemiBold" style={styles.messageBold} />,
          ]}
        />
      </ThemedText>
    </View>
  )
}

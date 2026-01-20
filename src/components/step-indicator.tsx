import { StyleSheet, View } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'

import { scale } from '@/utils/responsive'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  circleFilled: {
    backgroundColor: Colors.light.primary,
  },
  circleEmpty: {
    backgroundColor: Colors.light.white,
  },
  line: {
    height: 2,
    width: scale(40),
    backgroundColor: Colors.light.primary,
  },
  lineInactive: {
    backgroundColor: withOpacity(Colors.light.primary, 0.3),
  },
})

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isFilled = isCompleted || isCurrent

        return (
          <View key={stepNumber} style={styles.stepContainer}>
            <View
              style={[
                styles.circle,
                isFilled ? styles.circleFilled : styles.circleEmpty,
              ]}
            />

            {stepNumber < totalSteps && (
              <View
                style={[
                  styles.line,
                  isCompleted ? undefined : styles.lineInactive,
                ]}
              />
            )}
          </View>
        )
      })}
    </View>
  )
}

export default StepIndicator

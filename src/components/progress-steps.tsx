import { MaterialIcons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

export type StepStatus = 'completed' | 'pending' | 'active'

export interface Step {
  id?: string | number
  status: StepStatus
  label?: string
}

interface ProgressStepsProps {
  steps: Step[]
  connectorHeight?: number
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  circle: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  circleCompleted: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  circlePending: {
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.primary4,
  },
  circleActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary4,
  },
  connector: {
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.light.primary4,
    marginVertical: verticalScale(8),
  },
  label: {
    marginTop: verticalScale(8),
  },
})

function ProgressSteps({ steps, connectorHeight = 40 }: ProgressStepsProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isCompleted = step.status === 'completed'
        const isPending = step.status === 'pending'
        const isActive = step.status === 'active'

        return (
          <View key={step.id ?? index} style={styles.stepContainer}>
            <View
              style={[
                styles.circle,
                isCompleted && styles.circleCompleted,
                isPending && styles.circlePending,
                isActive && styles.circleActive,
              ]}
            >
              {isCompleted && (
                <MaterialIcons
                  name="check"
                  size={scale(20)}
                  color={Colors.light.white}
                />
              )}
            </View>
            {!isLast && (
              <View
                style={[
                  styles.connector,
                  {
                    height: verticalScale(connectorHeight),
                  },
                ]}
              />
            )}
          </View>
        )
      })}
    </View>
  )
}

export default ProgressSteps

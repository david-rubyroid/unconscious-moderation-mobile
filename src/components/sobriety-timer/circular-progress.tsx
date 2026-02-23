import type { CircularProgressProps } from './types'

import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { Colors } from '@/constants/theme'

import ThemedText from '../themed-text'

import { formatUnitValue } from './time-calculator'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontWeight: 500,
    color: Colors.light.black,
  },
  labelText: {
    color: Colors.light.black,
    fontWeight: 500,
    textTransform: 'uppercase',
    marginTop: -5,
  },
})

function CircularProgressComponent({
  value,
  label,
  progress,
  size = 36,
  strokeWidth = 3,
  valueSize,
  labelSize,
  color = Colors.light.primary,
  backgroundColor = Colors.light.gray2,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const center = size / 2

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedText style={[styles.valueText, { fontSize: valueSize }]}>
          {formatUnitValue(value)}
        </ThemedText>

        <ThemedText style={[styles.labelText, { fontSize: labelSize }]}>
          {label.toUpperCase()}
        </ThemedText>
      </View>
    </View>
  )
}

export const CircularProgress = memo(CircularProgressComponent)

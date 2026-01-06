import type { StyleProp, ViewStyle } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet } from 'react-native'

import { Colors } from '@/constants/theme'

interface ThemedGradientProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  colors?: readonly [string, string, ...string[]]
  start?: { x: number, y: number }
  end?: { x: number, y: number }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

// Default gradient colors (old): #E5E5E5 -> #62BC8C
const defaultGradientColors = [Colors.light.gradientStart, Colors.light.gradientEnd] as const

function ThemedGradient({ children, style, colors, start, end }: ThemedGradientProps) {
  return (
    <LinearGradient
      style={[styles.container, style]}
      colors={colors || defaultGradientColors}
      start={start || { x: 0, y: 0 }}
      end={end || { x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  )
}

export default ThemedGradient

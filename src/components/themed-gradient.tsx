import type { StyleProp, ViewStyle } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet } from 'react-native'

import { Colors } from '@/constants/theme'

interface ThemedGradientProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  colors?: [string, string]
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

function ThemedGradient({ children, style, colors }: ThemedGradientProps) {
  return (
    <LinearGradient
      style={[styles.container, style]}
      colors={colors || [Colors.light.gradientStart, Colors.light.gradientEnd]}
    >
      {children}
    </LinearGradient>
  )
}

export default ThemedGradient

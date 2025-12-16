import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { scale, verticalScale } from '@/utils/responsive'
import ThemedGradient from './themed-gradient'

interface ScreenContainerProps {
  children: ReactNode
  horizontalPadding?: number
  scrollable?: boolean
  showsScrollIndicator?: boolean
  contentContainerStyle?: StyleProp<ViewStyle>
  gradientColors?: readonly [string, string, ...string[]]
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
})

function ScreenContainer({
  children,
  horizontalPadding = 21,
  scrollable = true,
  showsScrollIndicator = false,
  contentContainerStyle,
  gradientColors,
}: ScreenContainerProps) {
  const { top, bottom } = useSafeAreaInsets()

  const Container = scrollable ? ScrollView : View

  const containerStyle = {
    flex: 1,
    paddingHorizontal: scale(horizontalPadding),
  }

  const scrollContentStyle = scrollable
    ? [styles.scrollContent, contentContainerStyle]
    : undefined

  return (
    <ThemedGradient
      colors={gradientColors}
      style={{
        paddingTop: top + verticalScale(10),
        paddingBottom: bottom + verticalScale(10),
      }}
    >
      <Container
        style={containerStyle}
        contentContainerStyle={scrollContentStyle}
        showsVerticalScrollIndicator={showsScrollIndicator}
      >
        {children}
      </Container>
    </ThemedGradient>
  )
}

export default ScreenContainer

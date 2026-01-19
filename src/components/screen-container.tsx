import type { ReactNode } from 'react'
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native'

import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native'
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
  backgroundImage?: ImageSourcePropType
  withOutSafeAreaPadding?: boolean
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  imageBackground: {
    flex: 1,
  },
})

function ScreenContainer({
  children,
  horizontalPadding = 21,
  scrollable = true,
  showsScrollIndicator = false,
  contentContainerStyle,
  gradientColors,
  backgroundImage,
  withOutSafeAreaPadding = false,
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

  const paddingStyle = withOutSafeAreaPadding
    ? undefined
    : {
        paddingTop: top + verticalScale(10),
        paddingBottom: bottom + verticalScale(10),
      }

  const content = (
    <Container
      style={containerStyle}
      contentContainerStyle={scrollContentStyle}
      showsVerticalScrollIndicator={showsScrollIndicator}
    >
      {children}
    </Container>
  )

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={[styles.imageBackground, paddingStyle]}
      >
        {content}
      </ImageBackground>
    )
  }

  return (
    <ThemedGradient colors={gradientColors} style={paddingStyle}>
      {content}
    </ThemedGradient>
  )
}

export default ScreenContainer

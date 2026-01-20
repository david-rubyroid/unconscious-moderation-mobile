import type { ReactNode } from 'react'
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native'

import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
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
  keyboardAvoiding?: boolean
  keyboardVerticalOffset?: number
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
  keyboardAvoiding = true,
  keyboardVerticalOffset = 0,
}: ScreenContainerProps) {
  const { top, bottom } = useSafeAreaInsets()

  const Container = scrollable ? ScrollView : View

  const containerStyle = {
    position: 'relative' as const,
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

  const scrollViewProps = scrollable
    ? {
        keyboardShouldPersistTaps: 'handled' as const,
        keyboardDismissMode: 'on-drag' as const,
        showsVerticalScrollIndicator: showsScrollIndicator,
      }
    : {}

  const content = (
    <Container
      style={containerStyle}
      contentContainerStyle={scrollContentStyle}
      {...scrollViewProps}
    >
      {children}
    </Container>
  )

  const wrappedContent = keyboardAvoiding
    ? (
        scrollable
          ? (
              // For ScrollView: use KeyboardAvoidingView without TouchableWithoutFeedback
              // ScrollView handles keyboard interactions natively
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={keyboardVerticalOffset}
              >
                {content}
              </KeyboardAvoidingView>
            )
          : (
              // For View: use TouchableWithoutFeedback to dismiss keyboard on tap
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={keyboardVerticalOffset}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={{ flex: 1 }}>
                    {content}
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            )
      )
    : (
        content
      )

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={[styles.imageBackground, paddingStyle]}
      >
        {wrappedContent}
      </ImageBackground>
    )
  }

  return (
    <ThemedGradient colors={gradientColors} style={paddingStyle}>
      {wrappedContent}
    </ThemedGradient>
  )
}

export default ScreenContainer

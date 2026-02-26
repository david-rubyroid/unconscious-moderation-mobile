import type { StyleProp, ViewStyle } from 'react-native'

import { StyleSheet, View } from 'react-native'

import BuddyDialog from '@/assets/icons/buddy-dialog'
import NarissaDialog from '@/assets/icons/narissa-dialog'

import ThemedText from '@/components/themed-text'

import { Colors, getResponsiveLineHeight } from '@/constants/theme'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'

interface SpeechBubbleProps {
  text: string
  character: 'buddy' | 'narissa'
  style?: StyleProp<ViewStyle>
  width?: number
  height?: number
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  textContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(22),
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.light.primary4,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: moderateScale(12),
    lineHeight: getResponsiveLineHeight(12, 1.1),
  },
})

function SpeechBubble({
  text,
  character,
  style,
  width = 163,
  height = 116,
}: SpeechBubbleProps) {
  const DialogSvg = character === 'buddy' ? BuddyDialog : NarissaDialog

  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={styles.svgContainer}>
        <DialogSvg
          width={width}
          height={height}
        />
      </View>

      <View style={[styles.textContainer, { width, height }]}>
        <ThemedText style={styles.text}>
          {text}
        </ThemedText>
      </View>
    </View>
  )
}

export default SpeechBubble

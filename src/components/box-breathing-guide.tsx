import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, Path } from 'react-native-svg'

import { Colors } from '@/constants/theme'

import { scale } from '@/utils/responsive'

import ThemedText from './themed-text'

const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface BoxBreathingGuideProps {
  instructionLabel: string
  audioCurrentTime: number
  audioDuration: number
  phaseDuration: number // Duration of each phase in seconds
}

const BOX_SIZE = 300
const PROGRESS_STROKE_WIDTH = 16
const INDICATOR_SIZE = 33
const CIRCLE_SIZE = 125
const PROGRESS_COLOR = '#77AF91'
const BOX_COLOR = Colors.light.white

// RectangleIcon dimensions
const ICON_WIDTH = 256
const RECT_X = 10
const RECT_Y = 6
const RECT_WIDTH = 236
const RECT_HEIGHT = 244
const RECT_RADIUS = 21
const RECT_STROKE = 12

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  svgContainer: {
    width: scale(BOX_SIZE),
    height: scale(BOX_SIZE),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  innerCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: Colors.light.white,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    color: Colors.light.primary4,
  },
})

function BoxBreathingGuide({
  instructionLabel,
  audioCurrentTime,
  audioDuration,
  phaseDuration,
}: BoxBreathingGuideProps) {
  // Audio progress (0 to 1) - like in audio-player
  const progress = audioDuration > 0 ? audioCurrentTime / audioDuration : 0
  const animatedProgress = useSharedValue(progress)
  const animatedAudioTime = useSharedValue(audioCurrentTime)
  const prevAudioTimeRef = useRef(audioCurrentTime)

  // Update progress with smooth animation (like audio-player)
  // But skip animation on reset (when time jumps back to 0)
  useEffect(() => {
    const prevTime = prevAudioTimeRef.current
    const isReset = prevTime > 0 && audioCurrentTime === 0

    if (isReset) {
      // Reset without animation
      animatedProgress.value = 0
      animatedAudioTime.value = 0
    }
    else {
      // Normal smooth animation
      animatedProgress.value = withTiming(progress, {
        duration: 1000,
        easing: Easing.linear,
      })
      animatedAudioTime.value = withTiming(audioCurrentTime, {
        duration: 1000,
        easing: Easing.linear,
      })
    }

    prevAudioTimeRef.current = audioCurrentTime
  }, [progress, audioCurrentTime, animatedProgress, animatedAudioTime])

  // Calculate scale smoothly directly from audio time in worklet
  const animatedScale = useDerivedValue(() => {
    'worklet'
    const cycleDuration = phaseDuration * 4 // 4 phases
    const cyclePosition = animatedAudioTime.value % cycleDuration
    const phaseIndex = Math.floor(cyclePosition / phaseDuration)
    const phaseProgress = (cyclePosition % phaseDuration) / phaseDuration

    if (phaseIndex === 0) {
      // Inhale: grow from 1.0 to 1.5
      return 1 + phaseProgress * 0.5
    }
    else if (phaseIndex === 1) {
      // Hold after inhale: stay at 1.5
      return 1.5
    }
    else if (phaseIndex === 2) {
      // Exhale: shrink from 1.5 to 1.0
      return 1.5 - phaseProgress * 0.5
    }
    else {
      // Hold after exhale: stay at 1.0
      return 1.0
    }
  }, [phaseDuration])

  // Calculate scaled dimensions
  const scaledBoxSize = scale(BOX_SIZE)
  const scaleX = scaledBoxSize / ICON_WIDTH

  // Rectangle dimensions
  const rectX = RECT_X * scaleX
  const rectY = RECT_Y * scaleX
  const rectWidth = RECT_WIDTH * scaleX
  const rectHeight = RECT_HEIGHT * scaleX
  const cornerRadius = RECT_RADIUS * scaleX
  const strokeWidth = RECT_STROKE * scaleX

  // Progress path - along the center of the stroke
  const strokeCenter = strokeWidth / 2
  const progressLeft = rectX + strokeCenter
  const progressTop = rectY + strokeCenter
  const progressRight = rectX + rectWidth - strokeCenter
  const progressBottom = rectY + rectHeight - strokeCenter

  const indicatorRadius = scale(INDICATOR_SIZE / 2)

  // Full path around rectangle
  const fullPath = `
    M ${progressLeft + cornerRadius} ${progressTop}
    L ${progressRight - cornerRadius} ${progressTop}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${progressRight} ${progressTop + cornerRadius}
    L ${progressRight} ${progressBottom - cornerRadius}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${progressRight - cornerRadius} ${progressBottom}
    L ${progressLeft + cornerRadius} ${progressBottom}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${progressLeft} ${progressBottom - cornerRadius}
    L ${progressLeft} ${progressTop + cornerRadius}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${progressLeft + cornerRadius} ${progressTop}
  `.trim()

  // Calculate perimeter length (for strokeDasharray)
  const straightWidth = (progressRight - progressLeft) - 2 * cornerRadius
  const straightHeight = (progressBottom - progressTop) - 2 * cornerRadius
  const cornerArc = (Math.PI / 2) * cornerRadius
  const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc

  const animatedPathProps = useAnimatedProps(() => {
    'worklet'
    const strokeDashoffset = totalPerimeter * (1 - animatedProgress.value)
    return { strokeDashoffset }
  })

  // Calculate indicator position based on progress
  const animatedIndicatorProps = useAnimatedProps(() => {
    'worklet'
    const progress = animatedProgress.value
    const distanceAlongPath = progress * totalPerimeter

    let indicatorX = progressLeft + cornerRadius
    let indicatorY = progressTop

    // Top edge (left to right)
    if (distanceAlongPath <= straightWidth) {
      indicatorX = progressLeft + cornerRadius + distanceAlongPath
      indicatorY = progressTop
    }
    // Top-right corner arc
    else if (distanceAlongPath <= straightWidth + cornerArc) {
      const arcProgress = (distanceAlongPath - straightWidth) / cornerArc
      const angle = -Math.PI / 2 + arcProgress * (Math.PI / 2)
      indicatorX = progressRight - cornerRadius + cornerRadius * Math.cos(angle)
      indicatorY = progressTop + cornerRadius + cornerRadius * Math.sin(angle)
    }
    // Right edge (top to bottom)
    else if (distanceAlongPath <= straightWidth + cornerArc + straightHeight) {
      const edgeProgress = distanceAlongPath - straightWidth - cornerArc
      indicatorX = progressRight
      indicatorY = progressTop + cornerRadius + edgeProgress
    }
    // Bottom-right corner arc
    else if (distanceAlongPath <= straightWidth + 2 * cornerArc + straightHeight) {
      const arcProgress = (distanceAlongPath - straightWidth - cornerArc - straightHeight) / cornerArc
      const angle = arcProgress * (Math.PI / 2)
      indicatorX = progressRight - cornerRadius + cornerRadius * Math.cos(angle)
      indicatorY = progressBottom - cornerRadius + cornerRadius * Math.sin(angle)
    }
    // Bottom edge (right to left)
    else if (distanceAlongPath <= 2 * straightWidth + 2 * cornerArc + straightHeight) {
      const edgeProgress = distanceAlongPath - straightWidth - 2 * cornerArc - straightHeight
      indicatorX = progressRight - cornerRadius - edgeProgress
      indicatorY = progressBottom
    }
    // Bottom-left corner arc
    else if (distanceAlongPath <= 2 * straightWidth + 3 * cornerArc + straightHeight) {
      const arcProgress = (distanceAlongPath - 2 * straightWidth - 2 * cornerArc - straightHeight) / cornerArc
      const angle = Math.PI / 2 + arcProgress * (Math.PI / 2)
      indicatorX = progressLeft + cornerRadius + cornerRadius * Math.cos(angle)
      indicatorY = progressBottom - cornerRadius + cornerRadius * Math.sin(angle)
    }
    // Left edge (bottom to top)
    else if (distanceAlongPath <= 2 * straightWidth + 3 * cornerArc + 2 * straightHeight) {
      const edgeProgress = distanceAlongPath - 2 * straightWidth - 3 * cornerArc - straightHeight
      indicatorX = progressLeft
      indicatorY = progressBottom - cornerRadius - edgeProgress
    }
    // Top-left corner arc
    else {
      const arcProgress = (distanceAlongPath - 2 * straightWidth - 3 * cornerArc - 2 * straightHeight) / cornerArc
      const angle = Math.PI + arcProgress * (Math.PI / 2)
      indicatorX = progressLeft + cornerRadius + cornerRadius * Math.cos(angle)
      indicatorY = progressTop + cornerRadius + cornerRadius * Math.sin(angle)
    }

    return {
      cx: indicatorX,
      cy: indicatorY,
      opacity: progress > 0 ? 1 : 0,
    }
  })

  // Animated circle scale
  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedScale.value }],
  }))

  // Calculate SVG size with padding for indicator (so it doesn't get clipped)
  const svgPadding = indicatorRadius
  const svgSize = scaledBoxSize + svgPadding * 2

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg
          width={svgSize}
          height={svgSize}
          viewBox={`${-svgPadding} ${-svgPadding} ${svgSize} ${svgSize}`}
          style={{ position: 'absolute', overflow: 'visible' }}
        >

          <Path
            d={fullPath}
            stroke={BOX_COLOR}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <AnimatedPath
            d={fullPath}
            animatedProps={animatedPathProps}
            stroke={PROGRESS_COLOR}
            strokeWidth={scale(PROGRESS_STROKE_WIDTH)}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={totalPerimeter}
          />

          <AnimatedCircle
            animatedProps={animatedIndicatorProps}
            r={indicatorRadius}
            fill={PROGRESS_COLOR}
          />
        </Svg>

        <Animated.View style={[styles.innerCircle, animatedCircleStyle]}>
          <ThemedText type="title" style={styles.instructionText}>
            {instructionLabel}
          </ThemedText>
        </Animated.View>
      </View>
    </View>
  )
}

export default BoxBreathingGuide

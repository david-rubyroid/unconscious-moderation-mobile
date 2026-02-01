import { StyleSheet, View } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'

import { Button, ThemedText } from '@/components'
import { Colors, Fonts, getResponsiveFontSize, getResponsiveLineHeight } from '@/constants/theme'

import useCountdownTimer from '@/hooks/use-countdown-timer'

import { scale, verticalScale } from '@/utils/responsive'

const DEFAULT_INITIAL_MINUTES = 20
const CIRCLE_SIZE = scale(105)
const CIRCLE_STROKE_WIDTH = 5

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(13),
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timeTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: Colors.light.primary4,
    fontFamily: Fonts.mono,
    lineHeight: getResponsiveLineHeight(28, 1.2),
    fontSize: getResponsiveFontSize(28),
  },
  button: {
    width: 100,
    height: 22,
    borderRadius: 36,
    paddingHorizontal: scale(0),
    alignSelf: 'center',
  },
})

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export interface CountdownTimerProps {
  initialMinutes?: number
  onComplete?: () => void
  size?: number
}

function CountdownTimer({
  initialMinutes = DEFAULT_INITIAL_MINUTES,
  onComplete,
  size = CIRCLE_SIZE,
}: CountdownTimerProps) {
  const initialSeconds = initialMinutes * 60
  const {
    remainingSeconds,
    isRunning,
    start,
    reset,
  } = useCountdownTimer({
    initialSeconds,
    onComplete,
  })

  const isIdle = remainingSeconds === initialSeconds && !isRunning
  const buttonTitle = isIdle ? 'Start' : 'Reset'
  const handleButtonPress = () => (isIdle ? start() : reset())

  const radius = (size - CIRCLE_STROKE_WIDTH) / 2
  const center = size / 2
  const circumference = radius * 2 * Math.PI
  const progressPercent = initialSeconds > 0 ? ((initialSeconds - remainingSeconds) / initialSeconds) * 100 : 0
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <View style={styles.container}>
      <View style={[
        styles.circleWrapper,
        { width: size, height: size },
      ]}
      >
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient
              id="countdownProgressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#77AF91" stopOpacity="1" />
              <Stop offset="100%" stopColor="#65CB93" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={Colors.light.white}
            strokeWidth={CIRCLE_STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#countdownProgressGradient)"
            strokeWidth={CIRCLE_STROKE_WIDTH}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        </Svg>
        <View style={[styles.timeTextWrapper, { width: size, height: size }]}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.timeText}
          >
            {formatTime(remainingSeconds)}
          </ThemedText>
        </View>
      </View>

      <Button
        variant="secondary"
        title={buttonTitle}
        onPress={handleButtonPress}
        style={styles.button}
      />
    </View>
  )
}

export default CountdownTimer

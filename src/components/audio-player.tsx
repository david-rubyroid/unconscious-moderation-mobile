import { useEffect, useRef } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'

import PauseIcon from '@/assets/icons/pause'
import PlayIcon from '@/assets/icons/play'

import { Colors, Fonts } from '@/constants/theme'

import { useAudioPlayer } from '@/hooks/use-audio-player'

import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface AudioPlayerProps {
  audioUri: string
  instructionText?: string
}

const CIRCLE_SIZE = 300
const CIRCLE_STROKE_WIDTH = 16
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE_WIDTH) / 2
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(35),
  },
  progressCircle: {
    position: 'relative',
  },
  playPauseButton: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseIconContainer: {
    width: scale(150),
    height: scale(150),
    borderRadius: scale(75),
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  currentTime: {
    fontSize: scale(60),
    fontWeight: '700',
    color: Colors.light.primary,
    lineHeight: scale(60),
    fontFamily: Fonts.mono,
  },
  totalTime: {
    fontSize: scale(30),
    fontWeight: '400',
    color: Colors.light.primary2,
    lineHeight: scale(30),
    fontFamily: Fonts.mono,
  },
  instructionText: {
    fontSize: scale(20),
    fontWeight: '500',
    color: Colors.light.primary,
    textAlign: 'center',
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(48),
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 233,
    alignSelf: 'center',
  },
  volumeIcon: {
    marginRight: scale(12),
  },
  volumeSlider: {
    flex: 1,
    height: verticalScale(4),
    backgroundColor: Colors.light.white,
    borderRadius: 2,
    position: 'relative',
  },
  volumeSliderTrack: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  volumeSliderThumb: {
    position: 'absolute',
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: Colors.light.primary,
    top: verticalScale(-6),
    left: 0,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
})

function AudioPlayer({ audioUri, instructionText = 'Close your eyes, breathe \n deeply, and let go ...' }: AudioPlayerProps) {
  // TODO: remove this if we don't need it
  // const [sliderWidth, setSliderWidth] = useState(233)
  // const thumbPosition = useSharedValue(0)
  // const startX = useSharedValue(0)

  const hasRestartedRef = useRef(false)

  const {
    // volume,
    // setVolume,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    isLoading,
    play,
    seekTo,
  } = useAudioPlayer(audioUri)

  const progress = duration > 0 ? currentTime / duration : 0
  const animatedProgress = useSharedValue(progress)

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.linear,
    })
  }, [progress, animatedProgress])

  // useEffect(() => {
  //   thumbPosition.value = withTiming(volume * sliderWidth, {
  //     duration: 0,
  //   })
  // }, [volume, sliderWidth, thumbPosition])

  // Automatic restart when the audio ends
  useEffect(() => {
    if (duration > 0 && progress >= 0.99 && !hasRestartedRef.current) {
      hasRestartedRef.current = true
      seekTo(0)
      // Small delay before restarting for proper work
      const timer = setTimeout(() => {
        play()
      }, 100)

      // Reset the flag after a delay to allow restart
      const resetTimer = setTimeout(() => {
        hasRestartedRef.current = false
      }, 1000)

      return () => {
        clearTimeout(timer)
        clearTimeout(resetTimer)
      }
    }

    // Reset the flag when audio is reset to beginning manually
    if (progress < 0.01) {
      hasRestartedRef.current = false
    }
  }, [progress, duration, seekTo, play])

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - animatedProgress.value)
    return {
      strokeDashoffset,
    }
  })

  // TODO: remove this if we don't need it
  // const updateVolume = (newVolume: number) => {
  //   setVolume(newVolume)
  // }

  // const panGesture = Gesture.Pan()
  //   .onStart(() => {
  //     startX.value = thumbPosition.value
  //   })
  //   .onUpdate((event) => {
  //     const newPosition = Math.max(0, Math.min(sliderWidth, startX.value + event.translationX))
  //     thumbPosition.value = newPosition
  //     const newVolume = Math.max(0, Math.min(1, newPosition / sliderWidth))
  //     runOnJS(updateVolume)(newVolume)
  //   })
  //   .onEnd(() => {
  //     const finalVolume = Math.max(0, Math.min(1, thumbPosition.value / sliderWidth))
  //     runOnJS(updateVolume)(finalVolume)
  //   })

  // const handleVolumePress = (event: any) => {
  //   const { locationX } = event.nativeEvent
  //   const newVolume = Math.max(0, Math.min(1, locationX / sliderWidth))
  //   thumbPosition.value = withTiming(newVolume * sliderWidth, {
  //     duration: 200,
  //     easing: Easing.out(Easing.ease),
  //   })
  //   setVolume(newVolume)
  // }

  // const animatedThumbStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateX: thumbPosition.value }],
  // }))

  // const animatedTrackStyle = useAnimatedStyle(() => ({
  //   width: thumbPosition.value,
  // }))

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            <Defs>
              <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#77AF91" stopOpacity="1" />
                <Stop offset="100%" stopColor="#65CB93" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke={Colors.light.white}
              strokeWidth={CIRCLE_STROKE_WIDTH}
              fill="none"
            />
            <AnimatedCircle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke="url(#progressGradient)"
              strokeWidth={CIRCLE_STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeLinecap="round"
              transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
              animatedProps={animatedCircleProps}
            />
          </Svg>

          <Pressable
            style={styles.playPauseButton}
            onPress={togglePlayPause}
          >
            <View style={styles.playPauseIconContainer}>
              {isLoading
                ? (
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                  )
                : isPlaying
                  ? (
                      <PauseIcon />
                    )
                  : (
                      <PlayIcon />
                    )}
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <ThemedText style={styles.currentTime}>
          {formatTime(currentTime)}
        </ThemedText>
        <ThemedText style={styles.totalTime}>
          {formatTime(duration)}
        </ThemedText>
      </View>

      {instructionText && (
        <ThemedText style={styles.instructionText}>
          {instructionText}
        </ThemedText>
      )}

      {/* TODO: remove this if we don't need it */}
      {/* <View style={styles.volumeContainer}>
        <MaterialIcons
          name="volume-up"
          size={scale(30)}
          color={Colors.light.primary}
          style={styles.volumeIcon}
        />

        <View
          style={styles.volumeSlider}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout
            setSliderWidth(width)
            thumbPosition.value = volume * width
          }}
        >
          <Animated.View style={[styles.volumeSliderTrack, animatedTrackStyle]} />
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.volumeSliderThumb,
                animatedThumbStyle,
              ]}
            />
          </GestureDetector>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleVolumePress}
          />
        </View>
      </View> */}
    </View>
  )
}

export default AudioPlayer

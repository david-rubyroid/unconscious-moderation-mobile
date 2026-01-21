import type { AudioPlayer as ExpoAudioPlayer } from 'expo-audio'
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
  onPlayStart?: () => void
  onPlayerReady?: (_player: ExpoAudioPlayer | null) => void
  textColor?: string
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
    fontWeight: '500',
    color: Colors.light.primary,
    textAlign: 'center',
  },
})

function AudioPlayer({
  audioUri,
  instructionText = 'Close your eyes, breathe \n deeply, and let go ...',
  onPlayStart,
  onPlayerReady,
  textColor = Colors.light.primary,
}: AudioPlayerProps) {
  const hasRestartedRef = useRef(false)
  const hasCalledOnPlayStartRef = useRef(false)

  const {
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    isLoading,
    play,
    seekTo,
    player,
  } = useAudioPlayer(audioUri)

  const progress = duration > 0 ? currentTime / duration : 0
  const animatedProgress = useSharedValue(progress)
  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - animatedProgress.value)
    return {
      strokeDashoffset,
    }
  })

  // Expose player instance to parent component
  useEffect(() => {
    if (player && onPlayerReady) {
      onPlayerReady(player)
    }
  }, [player, onPlayerReady])

  // Call onPlayStart when playback starts
  useEffect(() => {
    if (onPlayStart && isPlaying && currentTime > 0.1 && !hasCalledOnPlayStartRef.current) {
      hasCalledOnPlayStartRef.current = true
      onPlayStart()
    }
    // Reset when audio is stopped or reset
    if (!isPlaying || currentTime < 0.1) {
      hasCalledOnPlayStartRef.current = false
    }
  }, [isPlaying, currentTime, onPlayStart])

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.linear,
    })
  }, [progress, animatedProgress])

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
        <ThemedText style={[styles.currentTime, { color: textColor }]}>
          {formatTime(currentTime)}
        </ThemedText>
        <ThemedText style={[styles.totalTime, { color: textColor }]}>
          {formatTime(duration)}
        </ThemedText>
      </View>

      {instructionText && (
        <ThemedText type="preSubtitle" style={[styles.instructionText, { color: textColor }]}>
          {instructionText}
        </ThemedText>
      )}
    </View>
  )
}

export default AudioPlayer

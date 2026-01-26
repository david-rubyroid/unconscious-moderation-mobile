import { Asset } from 'expo-asset'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { scheduleOnRN } from 'react-native-worklets'

import PauseIcon from '@/assets/icons/pause'
import PlayIcon from '@/assets/icons/play'

import { Colors, Fonts } from '@/constants/theme'

import { useAudioPlayer } from '@/hooks/use-audio-player'

import { getAudioPosition, saveAudioPosition } from '@/utils/audio-position-storage'
import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface AudioPlayerProps {
  audioUri: string
  instructionText?: string
  onPlayStart?: () => void
  textColor?: string
  lockScreenTitle?: string
  lockScreenArtist?: string
  showLockScreenControls?: boolean
}

const CIRCLE_SIZE = 300
const CIRCLE_STROKE_WIDTH = 16
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE_WIDTH) / 2
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS
const THUMB_R_BASE = 6
const THUMB_R_DRAGGING = 14
const CIRCLE_PADDING = THUMB_R_DRAGGING
const SVG_SIZE = CIRCLE_SIZE + 2 * CIRCLE_PADDING
const CIRCLE_CENTER = SVG_SIZE / 2
const SAVE_POSITION_INTERVAL_MS = 5000
const PREVIEW_OFFSET = 28

function getAngleProgressFromPosition(x: number, y: number): number {
  const dx = x - CIRCLE_CENTER
  const dy = y - CIRCLE_CENTER
  let angle = Math.atan2(dy, dx) + Math.PI / 2
  if (angle < 0)
    angle += 2 * Math.PI
  return Math.max(0, Math.min(1, angle / (2 * Math.PI)))
}

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
    left: CIRCLE_PADDING,
    top: CIRCLE_PADDING,
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
  previewTooltip: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 48,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 8,
  },
  previewTooltipText: {
    fontSize: scale(14),
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
})

function AudioPlayer({
  audioUri,
  instructionText = 'Close your eyes, breathe \n deeply, and let go ...',
  onPlayStart,
  textColor = Colors.light.primary,
  lockScreenTitle,
  lockScreenArtist = 'Unconscious Moderation',
  showLockScreenControls = true,
}: AudioPlayerProps) {
  const hasCalledOnPlayStartRef = useRef(false)

  const {
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    isLoading,
    player,
    seekTo,
  } = useAudioPlayer(audioUri)

  const hasRestoredRef = useRef(false)
  const lastSavedAtRef = useRef(0)
  const lastSeekAtRef = useRef(0)
  const didSeekRef = useRef(false)
  const [savedPosition, setSavedPosition] = useState<number | null>(null)
  const [previewTime, setPreviewTime] = useState(0)

  const progress = duration > 0 ? currentTime / duration : 0
  const animatedProgress = useSharedValue(progress)
  const isDragging = useSharedValue(false)
  const dragProgress = useSharedValue(0)
  const durationShared = useSharedValue(0)

  const displayProgress = useDerivedValue(() =>
    isDragging.value ? dragProgress.value : animatedProgress.value,
  )
  const dragScale = useSharedValue(0)

  useAnimatedReaction(
    () => isDragging.value,
    (dragging) => {
      dragScale.value = withTiming(dragging ? 1 : 0, { duration: 150 })
    },
  )

  useAnimatedReaction(
    () => ({ d: isDragging.value, p: dragProgress.value, dur: durationShared.value }),
    (curr) => {
      if (curr.d && curr.dur > 0)
        scheduleOnRN(setPreviewTime, curr.p * curr.dur)
    },
  )

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - displayProgress.value)
    return {
      strokeDashoffset,
    }
  })

  const thumbAnimatedProps = useAnimatedProps(() => {
    const p = displayProgress.value
    const angle = p * 2 * Math.PI
    const cx = CIRCLE_CENTER + CIRCLE_RADIUS * Math.sin(angle)
    const cy = CIRCLE_CENTER - CIRCLE_RADIUS * Math.cos(angle)
    const r = interpolate(dragScale.value, [0, 1], [THUMB_R_BASE, THUMB_R_DRAGGING])
    return { cx, cy, r }
  })

  const previewAnimatedStyle = useAnimatedStyle(() => {
    const p = displayProgress.value
    const angle = p * 2 * Math.PI
    const r = CIRCLE_RADIUS + PREVIEW_OFFSET
    const x = CIRCLE_CENTER + r * Math.sin(angle) - 24
    const y = CIRCLE_CENTER - r * Math.cos(angle) - 14

    return {
      opacity: isDragging.value ? 1 : 0,
      transform: [{ translateX: x }, { translateY: y }],
    }
  })

  const handleSeek = useCallback(
    (progress: number) => {
      if (duration <= 0)
        return
      const now = Date.now()
      if (now - lastSeekAtRef.current < 100)
        return
      lastSeekAtRef.current = now
      didSeekRef.current = true
      seekTo(progress * duration * 1000)
    },
    [duration, seekTo],
  )

  const handleSeekFromGesture = useCallback(
    (x: number, y: number) => {
      const progress = getAngleProgressFromPosition(x, y)
      handleSeek(progress)
    },
    [handleSeek],
  )

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onStart((e) => {
      'worklet'
      const dx = e.x - CIRCLE_CENTER
      const dy = e.y - CIRCLE_CENTER
      let angle = Math.atan2(dy, dx) + Math.PI / 2
      if (angle < 0)
        angle += 2 * Math.PI
      const p = Math.max(0, Math.min(1, angle / (2 * Math.PI)))
      isDragging.value = true
      dragProgress.value = p
      scheduleOnRN(handleSeekFromGesture, e.x, e.y)
    })
    .onUpdate((e) => {
      'worklet'
      const dx = e.x - CIRCLE_CENTER
      const dy = e.y - CIRCLE_CENTER
      let angle = Math.atan2(dy, dx) + Math.PI / 2
      if (angle < 0)
        angle += 2 * Math.PI
      dragProgress.value = Math.max(0, Math.min(1, angle / (2 * Math.PI)))
      scheduleOnRN(handleSeekFromGesture, e.x, e.y)
    })
    .onEnd((e) => {
      'worklet'
      const dx = e.x - CIRCLE_CENTER
      const dy = e.y - CIRCLE_CENTER
      let angle = Math.atan2(dy, dx) + Math.PI / 2
      if (angle < 0)
        angle += 2 * Math.PI
      const p = Math.max(0, Math.min(1, angle / (2 * Math.PI)))
      dragProgress.value = p
      animatedProgress.value = p
      scheduleOnRN(handleSeekFromGesture, e.x, e.y)
      isDragging.value = false
    })

  const tapGesture = Gesture.Tap().onEnd(() => {
    'worklet'
    scheduleOnRN(togglePlayPause)
  })

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture)

  // Enable lock screen controls (only when player is loaded)
  useEffect(() => {
    if (!player || !showLockScreenControls || duration === 0) {
      return
    }
    if (!lockScreenTitle && !lockScreenArtist) {
      return
    }

    let artworkUrl: string | undefined

    const setup = async () => {
      // Load artwork
      try {
        // eslint-disable-next-line ts/no-require-imports
        const asset = Asset.fromModule(require('@/assets/app-icons/ios-light.png'))
        await asset.downloadAsync()
        artworkUrl = asset.localUri ?? undefined
      }
      catch {
        // Ignore artwork loading errors
      }

      // Enable lock screen
      player.setActiveForLockScreen(true, {
        title: lockScreenTitle,
        artist: lockScreenArtist,
        artworkUrl,
      })
    }

    setup()

    return () => {
      try {
        player?.clearLockScreenControls()
      }
      catch {
        // Player may already be disposed
      }
    }
  }, [
    player,
    lockScreenTitle,
    lockScreenArtist,
    showLockScreenControls,
    duration,
  ])
  // Call onPlayStart when playback starts
  useEffect(() => {
    if (onPlayStart && isPlaying && !hasCalledOnPlayStartRef.current) {
      hasCalledOnPlayStartRef.current = true
      onPlayStart()
    }
  }, [isPlaying, onPlayStart])
  useEffect(() => {
    if (didSeekRef.current) {
      didSeekRef.current = false
      animatedProgress.value = progress
    }
    else {
      animatedProgress.value = withTiming(progress, {
        duration: 1000,
        easing: Easing.linear,
      })
    }
  }, [progress, animatedProgress])
  useEffect(() => {
    durationShared.value = duration
  }, [duration, durationShared])
  // Set loop mode
  useEffect(() => {
    if (player) {
      player.loop = true
    }
  }, [player])
  // Load saved position on mount
  useEffect(() => {
    getAudioPosition(audioUri).then(setSavedPosition)
  }, [audioUri])
  // Restore position when audio is loaded
  useEffect(() => {
    if (savedPosition == null || duration <= 0 || hasRestoredRef.current)
      return
    hasRestoredRef.current = true
    seekTo(savedPosition * 1000)
  }, [savedPosition, duration, seekTo])
  // Save position periodically while playing
  useEffect(() => {
    const now = Date.now()
    if (!isPlaying || duration <= 0)
      return

    if (now - lastSavedAtRef.current < SAVE_POSITION_INTERVAL_MS)
      return

    lastSavedAtRef.current = now
    saveAudioPosition(audioUri, currentTime)
  }, [isPlaying, duration, currentTime, audioUri])
  // Save position on unmount
  useEffect(() => {
    return () => {
      if (duration > 0)
        saveAudioPosition(audioUri, currentTime)
    }
  }, [audioUri, duration, currentTime])

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <GestureDetector gesture={composedGesture}>
          <View style={styles.progressCircle}>
            <Svg width={SVG_SIZE} height={SVG_SIZE}>
              <Defs>
                <LinearGradient
                  id="progressGradient"
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
                cx={CIRCLE_CENTER}
                cy={CIRCLE_CENTER}
                r={CIRCLE_RADIUS}
                stroke={Colors.light.white}
                strokeWidth={CIRCLE_STROKE_WIDTH}
                fill="none"
              />

              <AnimatedCircle
                cx={CIRCLE_CENTER}
                cy={CIRCLE_CENTER}
                r={CIRCLE_RADIUS}
                stroke="url(#progressGradient)"
                strokeWidth={CIRCLE_STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeLinecap="round"
                transform={`rotate(-90 ${CIRCLE_CENTER} ${CIRCLE_CENTER})`}
                animatedProps={animatedCircleProps}
              />
              <AnimatedCircle
                fill="#65CB93"
                stroke={Colors.light.white}
                strokeWidth={2}
                animatedProps={thumbAnimatedProps}
              />
            </Svg>

            <View style={styles.playPauseButton}>
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
            </View>

            <Animated.View
              pointerEvents="none"
              style={[styles.previewTooltip, previewAnimatedStyle]}
            >
              <ThemedText style={[
                styles.previewTooltipText,
                { color: Colors.light.primary },
              ]}
              >
                {formatTime(previewTime)}
              </ThemedText>
            </Animated.View>
          </View>
        </GestureDetector>
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
        <ThemedText
          type="preSubtitle"
          style={[styles.instructionText, { color: textColor }]}
        >
          {instructionText}
        </ThemedText>
      )}
    </View>
  )
}

export default AudioPlayer

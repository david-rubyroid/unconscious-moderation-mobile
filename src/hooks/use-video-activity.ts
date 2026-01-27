import type { VideoPlayer } from 'expo-video'
import { useVideoPlayer } from 'expo-video'

import { useEffect, useRef } from 'react'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import { useCanStartPlayback } from '@/hooks/use-video-buffering'
import { useVideoLoading } from '@/hooks/use-video-loading'

interface UseVideoActivityOptions {
  videoUrl: string | null
  /**
   * Optional: Mark activity as completed when playback starts
   */
  activityCompletion?: {
    day: number
    activityType: 'hypnosis' | 'journaling' | 'reading' | 'movement'
  }
  /**
   * Minimum buffer seconds before allowing playback (default: 5)
   */
  minBufferSeconds?: number
}

interface UseVideoActivityReturn {
  player: VideoPlayer | null
  loadingState: ReturnType<typeof useVideoLoading>
  canStartPlayback: boolean
}

/**
 * Reusable hook for video screens with optional activity completion tracking
 */
export function useVideoActivity({
  videoUrl,
  activityCompletion,
  minBufferSeconds = 5,
}: UseVideoActivityOptions): UseVideoActivityReturn {
  const hasCompletedRef = useRef(false)
  const wasPlayingRef = useRef(false)

  const { mutateAsync: completeActivity } = useCompleteActivity()

  const player = useVideoPlayer(
    videoUrl || null,
    (player) => {
      player.play()
    },
  )

  const loadingState = useVideoLoading(player)
  const canStartPlayback = useCanStartPlayback(player, minBufferSeconds)

  // Mark activity as completed when playback starts
  useEffect(() => {
    if (!player || !activityCompletion || hasCompletedRef.current) {
      return
    }

    const { day, activityType } = activityCompletion

    // Validate day range
    if (day < 1 || day > 30) {
      return
    }

    const checkPlaying = () => {
      const isPlaying = player.playing
      if (isPlaying && !wasPlayingRef.current && !hasCompletedRef.current) {
        hasCompletedRef.current = true
        completeActivity({
          day,
          activityType,
        })
      }
      wasPlayingRef.current = isPlaying
    }

    // Initialize initial state
    wasPlayingRef.current = player.playing

    // Check playback status changes
    const subscription = player.addListener('statusChange', () => {
      checkPlaying()
    })

    // Also check periodically in case the event didn't fire
    const interval = setInterval(checkPlaying, 500)

    // Initial check
    checkPlaying()

    return () => {
      subscription.remove()
      clearInterval(interval)
    }
  }, [player, activityCompletion, completeActivity])

  return {
    player,
    loadingState,
    canStartPlayback,
  }
}

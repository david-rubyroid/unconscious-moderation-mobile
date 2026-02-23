import type { VideoPlayer } from 'expo-video'

import { useEffect, useState } from 'react'

export interface BufferingProgress {
  bufferedTime: number
  duration: number
  progress: number // 0-1
  isBuffering: boolean
}

/**
 * Hook for tracking video buffering progress
 * Allows determining how much video has been loaded and is ready for playback
 */
export function useVideoBuffering(player: VideoPlayer | null): BufferingProgress {
  const [progress, setProgress] = useState<BufferingProgress>({
    bufferedTime: 0,
    duration: 0,
    progress: 0,
    isBuffering: false,
  })

  useEffect(() => {
    if (!player)
      return

    const updateProgress = () => {
      const duration = player.duration || 0
      const currentTime = player.currentTime || 0
      // For streaming, we estimate that approximately 10-15 seconds ahead are buffered
      // This is an approximation since expo-video doesn't provide exact buffer data
      const estimatedBufferedTime = currentTime + 15
      const bufferedTime = Math.min(estimatedBufferedTime, duration)
      const progressValue = duration > 0 ? bufferedTime / duration : 0

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setProgress({
        bufferedTime,
        duration,
        progress: progressValue,
        isBuffering: player.status === 'loading',
      })
    }

    // Update on status change
    const statusSubscription = player.addListener('statusChange', () => {
      updateProgress()
    })

    // Update on playback time change
    const timeUpdateInterval = setInterval(updateProgress, 500)

    // Initial update
    updateProgress()

    return () => {
      statusSubscription.remove()
      clearInterval(timeUpdateInterval)
    }
  }, [player])

  return progress
}

/**
 * Checks if enough video has been loaded to start playback
 * @param player VideoPlayer instance
 * @param minBufferSeconds Minimum number of seconds needed to start playback (default: 3)
 */
export function useCanStartPlayback(
  player: VideoPlayer | null,
  minBufferSeconds: number = 3,
): boolean {
  const { duration, bufferedTime, isBuffering } = useVideoBuffering(player)

  // If video metadata loaded (duration > 0), consider it ready for local videos
  if (duration > 0 && !isBuffering) {
    return true
  }

  // If video is short (less than minBufferSeconds), can start immediately
  if (duration > 0 && duration < minBufferSeconds) {
    return !isBuffering && duration > 0
  }

  // For long videos, need to load at least minBufferSeconds
  return !isBuffering && bufferedTime >= minBufferSeconds
}

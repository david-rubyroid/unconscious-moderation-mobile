import type { VideoPlayer } from 'expo-video'

import { useEffect, useState } from 'react'

export interface VideoLoadingState {
  isLoading: boolean
  isBuffering: boolean
  canPlay: boolean
  hasError: boolean
  status: string
}

// VideoPlayer status types from expo-video
type VideoPlayerStatus = 'idle' | 'loading' | 'error'

/**
 * Hook for tracking video loading and buffering state
 * Distinguishes between initial loading and buffering during playback
 */
export function useVideoLoading(player: VideoPlayer | null): VideoLoadingState {
  const [state, setState] = useState<VideoLoadingState>(() => {
    if (!player) {
      return {
        isLoading: false,
        isBuffering: false,
        canPlay: false,
        hasError: false,
        status: 'idle',
      }
    }
    const status = player.status as VideoPlayerStatus
    return {
      isLoading: status === 'loading',
      // expo-video doesn't have a separate 'buffering' status, we use 'loading'
      isBuffering: status === 'loading',
      // Video is ready to play when not loading and not in error state
      canPlay: status !== 'loading' && status !== 'error',
      hasError: status === 'error',
      status,
    }
  })

  useEffect(() => {
    if (!player)
      return

    const subscription = player.addListener('statusChange', ({ status }) => {
      const playerStatus = status as VideoPlayerStatus
      setState({
        isLoading: playerStatus === 'loading',
        // expo-video doesn't have a separate 'buffering' status, we use 'loading'
        isBuffering: playerStatus === 'loading',
        // Video is ready to play when not loading and not in error state
        canPlay: playerStatus !== 'loading' && playerStatus !== 'error',
        hasError: playerStatus === 'error',
        status: playerStatus,
      })
    })

    return () => {
      subscription.remove()
    }
  }, [player])

  return state
}

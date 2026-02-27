import type { VideoPlayer } from 'expo-video'

import { useVideoPlayer } from 'expo-video'

import { useCanStartPlayback } from '@/hooks/use-video-buffering'
import { useVideoLoading } from '@/hooks/use-video-loading'

interface UseVideoActivityOptions {
  videoUrl: string | null
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
 * Reusable hook for video screens with loading and buffering states
 */
export function useVideoActivity({
  videoUrl,
  minBufferSeconds = 5,
}: UseVideoActivityOptions): UseVideoActivityReturn {
  const player = useVideoPlayer(
    videoUrl || null,
    (player) => {
      player.play()
    },
  )

  const loadingState = useVideoLoading(player)
  const canStartPlayback = useCanStartPlayback(player, minBufferSeconds)

  return {
    player,
    loadingState,
    canStartPlayback,
  }
}

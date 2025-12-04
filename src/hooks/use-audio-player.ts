import { useAudioPlayerStatus, useAudioPlayer as useExpoAudioPlayer } from 'expo-audio'
import { useEffect, useState } from 'react'

interface UseAudioPlayerReturn {
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  volume: number
  play: () => void
  pause: () => void
  togglePlayPause: () => void
  setVolume: (_value: number) => void
  seekTo: (_positionMillis: number) => void
}

export function useAudioPlayer(audioUri: string): UseAudioPlayerReturn {
  const [volume, setVolumeState] = useState(1)
  const player = useExpoAudioPlayer(audioUri)
  const status = useAudioPlayerStatus(player)

  useEffect(() => {
    if (player && volume !== undefined) {
      player.volume = volume
    }
  }, [player, volume])

  const isPlaying = status?.playing ?? false
  const currentTime = status?.currentTime ?? 0
  const duration = status?.duration ?? 0
  const isLoading = status === undefined || (duration === 0 && currentTime === 0)

  const play = () => {
    player?.play()
  }
  const pause = () => {
    player?.pause()
  }
  const togglePlayPause = () => {
    if (isPlaying) {
      pause()
    }
    else {
      play()
    }
  }

  const setVolume = (value: number) => {
    const clampedVolume = Math.max(0, Math.min(1, value))
    if (player) {
      player.volume = clampedVolume
    }
    setVolumeState(clampedVolume)
  }

  const seekTo = (positionMillis: number) => {
    player?.seekTo(positionMillis / 1000)
  }

  return {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    play,
    pause,
    togglePlayPause,
    setVolume,
    seekTo,
  }
}

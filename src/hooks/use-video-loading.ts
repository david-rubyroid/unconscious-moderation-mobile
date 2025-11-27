import type { VideoPlayer } from 'expo-video'

import { useEffect, useState } from 'react'

export function useVideoLoading(player: VideoPlayer) {
  const [isLoading, setIsLoading] = useState(() => player.status === 'loading')

  useEffect(() => {
    const subscription = player.addListener('statusChange', ({ status }) => {
      setIsLoading(status === 'loading')
    })

    return () => {
      subscription.remove()
    }
  }, [player])

  return isLoading
}

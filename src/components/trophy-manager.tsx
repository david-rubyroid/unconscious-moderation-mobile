import type { TrophyType } from '@/api/queries/sobriety-tracker/dto'

import { useEffect, useState } from 'react'

import { useGetPendingTrophies, useMarkTrophiesAsShown } from '@/api/queries/sobriety-tracker'

import TrophyModal from './trophy-modal'

function TrophyManager() {
  // Trophy modal state
  const [trophyModalVisible, setTrophyModalVisible] = useState(false)
  const [currentTrophy, setCurrentTrophy] = useState<{
    type: TrophyType
    id: number
  } | null>(null)

  // Fetch pending trophies
  const { data: pendingTrophies } = useGetPendingTrophies()
  const { mutate: markTrophiesAsShown } = useMarkTrophiesAsShown()

  // Check for pending trophies on mount
  useEffect(() => {
    if (pendingTrophies && pendingTrophies.length > 0) {
      // Get the highest (last) trophy
      const highestTrophy = pendingTrophies[pendingTrophies.length - 1]

      // If multiple trophies, mark all except the highest as shown immediately
      if (pendingTrophies.length > 1) {
        const trophiesToMarkAsShown = pendingTrophies.slice(0, -1)
        const idsToMark = trophiesToMarkAsShown.map(trophy => trophy.id)
        markTrophiesAsShown({ ids: idsToMark })
      }

      // Show modal with the highest trophy
      const timeoutId = setTimeout(() => {
        setCurrentTrophy({
          type: highestTrophy.trophy_type,
          id: highestTrophy.id,
        })
        setTrophyModalVisible(true)
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [pendingTrophies, markTrophiesAsShown])

  const handleCloseTrophyModal = () => {
    if (currentTrophy) {
      // Mark current trophy as shown when modal closes
      markTrophiesAsShown({ ids: [currentTrophy.id] })
    }
    setTrophyModalVisible(false)
    setCurrentTrophy(null)
  }

  return currentTrophy
    ? (
        <TrophyModal
          visible={trophyModalVisible}
          trophyType={currentTrophy.type}
          onClose={handleCloseTrophyModal}
        />
      )
    : null
}

export default TrophyManager

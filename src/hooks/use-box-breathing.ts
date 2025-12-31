import { useMemo } from 'react'

export type BreathingPhase = 'inhale' | 'hold' | 'exhale'

interface UseBoxBreathingOptions {
  phaseDuration?: number // Duration per phase in seconds
  audioCurrentTime?: number // Current time from audio player (in seconds)
}

interface UseBoxBreathingReturn {
  currentPhase: BreathingPhase
  phaseProgress: number // 0 to 1
  phaseIndex: number // 0 = inhale, 1 = hold, 2 = exhale, 3 = hold
}

const PHASE_SEQUENCE: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'hold']

function useBoxBreathing({
  phaseDuration = 4,
  audioCurrentTime = 0,
}: UseBoxBreathingOptions = {}): UseBoxBreathingReturn {
  const { phaseIndex, phaseProgress } = useMemo(() => {
    // Calculate cycle duration (4 phases)
    const cycleDuration = phaseDuration * PHASE_SEQUENCE.length

    // Calculate position within cycle (0 to cycleDuration)
    const cyclePosition = audioCurrentTime % cycleDuration

    // Calculate current phase index (0-3)
    const currentPhaseIndex = Math.floor(cyclePosition / phaseDuration)

    // Calculate progress within current phase (0 to 1)
    const phasePosition = cyclePosition % phaseDuration
    const currentPhaseProgress = phaseDuration > 0 ? phasePosition / phaseDuration : 0

    return {
      phaseIndex: currentPhaseIndex,
      phaseProgress: Math.min(Math.max(currentPhaseProgress, 0), 1),
    }
  }, [audioCurrentTime, phaseDuration])

  const currentPhase = PHASE_SEQUENCE[phaseIndex]

  return {
    currentPhase,
    phaseProgress,
    phaseIndex,
  }
}

export default useBoxBreathing

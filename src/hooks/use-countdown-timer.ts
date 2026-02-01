import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_INITIAL_SECONDS = 20 * 60 // 20 minutes

interface UseCountdownTimerOptions {
  initialSeconds?: number
  onComplete?: () => void
}

function useCountdownTimer(options: UseCountdownTimerOptions = {}) {
  const {
    initialSeconds = DEFAULT_INITIAL_SECONDS,
    onComplete,
  } = options

  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const startTimeRef = useRef<number>(0)
  const remainingAtStartRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCompleteRef = useRef(onComplete)
  const initialSecondsRef = useRef(initialSeconds)

  onCompleteRef.current = onComplete
  initialSecondsRef.current = initialSeconds

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
    remainingAtStartRef.current = remainingSeconds
    setIsRunning(true)
  }, [remainingSeconds])

  const pause = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    startTimeRef.current = 0
    remainingAtStartRef.current = 0
    setRemainingSeconds(initialSecondsRef.current)
    setIsRunning(false)
  }, [])

  useEffect(() => {
    if (!isRunning)
      return

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const newRemaining = Math.max(remainingAtStartRef.current - elapsed, 0)

      setRemainingSeconds(newRemaining)

      if (newRemaining > 0) {
        const nextTick = 1000 - ((Date.now() - startTimeRef.current) % 1000)
        timeoutRef.current = setTimeout(tick, nextTick)
      }
      else {
        setIsRunning(false)
        onCompleteRef.current?.()
      }
    }

    timeoutRef.current = setTimeout(tick, 0)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isRunning])

  return {
    remainingSeconds,
    isRunning,
    isFinished: remainingSeconds === 0,
    start,
    pause,
    reset,
  }
}

export default useCountdownTimer

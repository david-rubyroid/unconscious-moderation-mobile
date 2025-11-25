import { useCallback, useEffect, useRef, useState } from 'react'

function useCountdown(initialSeconds: number) {
  const [count, setCount] = useState(initialSeconds)
  const [resetKey, setResetKey] = useState(0)
  const startTimeRef = useRef(Date.now())
  const timeoutRef = useRef<number | null>(null)
  const initialSecondsRef = useRef(initialSeconds)

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    startTimeRef.current = Date.now()
    initialSecondsRef.current = initialSeconds
    setCount(initialSeconds)
    setResetKey(prev => prev + 1)
  }, [initialSeconds])

  useEffect(() => {
    initialSecondsRef.current = initialSeconds
    startTimeRef.current = Date.now()

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const newCount = Math.max(initialSecondsRef.current - elapsed, 0)

      setCount(newCount)

      if (newCount > 0) {
        // Calculate the delay to the next exact "tick"
        const nextTick = 1000 - ((Date.now() - startTimeRef.current) % 1000)
        timeoutRef.current = setTimeout(tick, nextTick)
      }
    }

    timeoutRef.current = setTimeout(tick, 0)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [initialSeconds, resetKey])

  return {
    count,
    reset,
    isFinished: count === 0,
    isRunning: count > 0,
  }
}

export default useCountdown

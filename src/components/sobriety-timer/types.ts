import type { ViewStyle } from 'react-native'

export interface TimeBreakdown {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface DisplayUnit {
  value: number
  label: string
  maxValue: number
  progress: number // 0-100
  unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'
}

export interface SobrietyTimerProps {
  size?: 'default' | 'large'
  showIcon?: boolean
  onError?: (_error: Error) => void
  style?: ViewStyle
  streakStartDate?: Date
  maxUnits?: number
  circleColor?: string
  circleBackgroundColor?: string
  autoUpdate?: boolean
  customSize?: {
    circleSize: number
    strokeWidth: number
    valueSize: number
    labelSize: number
  }
  disableScroll?: boolean
}

export interface CircularProgressProps {
  value: number
  maxValue: number
  progress: number
  label: string
  size: number
  strokeWidth: number
  valueSize: number
  labelSize: number
  color?: string
  backgroundColor?: string
}

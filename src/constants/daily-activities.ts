import actionDay2Image from '@/assets/images/today-adventure/action-day/action-day-2.webp'
import actionDay9Image from '@/assets/images/today-adventure/action-day/action-day-9.webp'
import actionDay16Image from '@/assets/images/today-adventure/action-day/action-day-16.webp'
import actionDay23Image from '@/assets/images/today-adventure/action-day/action-day-23.webp'
import actionDay30Image from '@/assets/images/today-adventure/action-day/action-day-30.webp'
import connectionDay3Image from '@/assets/images/today-adventure/connection-day/connection-day-3.webp'
import connectionDay10Image from '@/assets/images/today-adventure/connection-day/connection-day-10.webp'
import connectionDay15Image from '@/assets/images/today-adventure/connection-day/connection-day-15.webp'
import connectionDay17Image from '@/assets/images/today-adventure/connection-day/connection-day-17.webp'
import connectionDay23Image from '@/assets/images/today-adventure/connection-day/connection-day-23.webp'

export const ACTION_DAY_DAYS = [2, 9, 16, 23, 30] as const
export const CONNECTION_DAY_DAYS = [3, 10, 15, 17, 23] as const
export const BLOOD_PRESSURE_REQUIRED_DAYS = [2, 30] as const

export const BLOOD_PRESSURE_RANGES = {
  systolic: { min: 70, max: 200 },
  diastolic: { min: 40, max: 130 },
} as const

export const ACTION_DAY_IMAGES = {
  2: actionDay2Image,
  9: actionDay9Image,
  16: actionDay16Image,
  23: actionDay23Image,
  30: actionDay30Image,
} as const

export const CONNECTION_DAY_IMAGES = {
  3: connectionDay3Image,
  10: connectionDay10Image,
  15: connectionDay15Image,
  17: connectionDay17Image,
  23: connectionDay23Image,
} as const

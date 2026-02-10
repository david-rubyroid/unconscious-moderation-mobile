import day1Image from '@/assets/images/reading/day-1.webp'
import day2Image from '@/assets/images/reading/day-2.webp'
import day3Image from '@/assets/images/reading/day-3.webp'
import day4Image from '@/assets/images/reading/day-4.webp'
import day5Image from '@/assets/images/reading/day-5.webp'
import day6Image from '@/assets/images/reading/day-6.webp'
import day7Image from '@/assets/images/reading/day-7.webp'
import day8Image from '@/assets/images/reading/day-8.webp'
import day9Image from '@/assets/images/reading/day-9.webp'

import day10Image from '@/assets/images/reading/day-10.webp'
import day11Image from '@/assets/images/reading/day-11.webp'
import day12Image from '@/assets/images/reading/day-12.webp'
import day13Image from '@/assets/images/reading/day-13.webp'
import day14Image from '@/assets/images/reading/day-14.webp'
import day15Image from '@/assets/images/reading/day-15.webp'
import day16Image from '@/assets/images/reading/day-16.webp'

export const READING_IMAGES: Record<number, any> = {
  1: day1Image,
  2: day2Image,
  3: day3Image,
  4: day4Image,
  5: day5Image,
  6: day6Image,
  7: day7Image,
  8: day8Image,
  9: day9Image,
  10: day10Image,
  11: day11Image,
  12: day12Image,
  13: day13Image,
  14: day14Image,
  15: day15Image,
  16: day16Image,
  // For days 17-30, assign random images from days 1-16 each time
}

export function getReadingImage(day: number | string | string[]) {
  const dayNumber = Array.isArray(day) ? Number(day[0]) : Number(day)
  return READING_IMAGES[dayNumber] || READING_IMAGES[Math.floor(Math.random() * 12) + 1]
}

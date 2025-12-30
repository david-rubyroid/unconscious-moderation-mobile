import day1Image from '@/assets/images/reading/day-1.jpg'
import day2Image from '@/assets/images/reading/day-2.jpg'
import day3Image from '@/assets/images/reading/day-3.jpg'
import day4Image from '@/assets/images/reading/day-4.jpg'
import day5Image from '@/assets/images/reading/day-5.jpg'
import day6Image from '@/assets/images/reading/day-6.jpg'
import day7Image from '@/assets/images/reading/day-7.jpg'
import day8Image from '@/assets/images/reading/day-8.jpg'
import day9Image from '@/assets/images/reading/day-9.jpg'

import day10Image from '@/assets/images/reading/day-10.jpg'
import day11Image from '@/assets/images/reading/day-11.jpg'
import day12Image from '@/assets/images/reading/day-12.jpg'
import day13Image from '@/assets/images/reading/day-13.jpg'
import day14Image from '@/assets/images/reading/day-14.jpg'
import day15Image from '@/assets/images/reading/day-15.jpg'
import day16Image from '@/assets/images/reading/day-16.jpg'

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

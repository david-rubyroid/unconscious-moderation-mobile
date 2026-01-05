const MOVEMENT_VIDEOS = {
  1: {
    video: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/movement/MOVEMENT-1-EN.mp4',
  },
  2: {
    video: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/movement/MOVEMENT-2-EN.mp4',
  },
  3: {
    video: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/movement/MOVEMENT-3-EN.mp4',
  },
  4: {
    video: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/movement/MOVEMENT-4-EN.mp4',
  },
  5: {
    video: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/movement/MOVEMENT-5-EN.mp4',
  },
  6: {
    video: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/movement/MOVEMENT-6-EN.mp4',
  },
  7: {
    video: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/movement/MOVEMENT-7-EN.mp4',
  },
} as const

/**
 * Calculates video index for a given day
 * Days 1-7 use videos 1-7, then the cycle repeats
 * @param day - day number (1-30)
 * @returns video index (1-7)
 */
export function getMovementVideoIndex(day: number): number {
  if (day < 1 || day > 30) {
    return 1
  }
  return ((day - 1) % 7) + 1
}

/**
 * Gets video URL for a given day
 * @param day - day number (1-30)
 * @returns video URL or undefined if day is invalid
 */
export function getMovementVideoUrl(day: number): string | undefined {
  const videoIndex = getMovementVideoIndex(day)
  return MOVEMENT_VIDEOS[videoIndex as keyof typeof MOVEMENT_VIDEOS]?.video
}

export { MOVEMENT_VIDEOS }

/* eslint-disable ts/no-require-imports -- Metro requires static require() for asset bundling */

export const VIDEOS_LINKS = {
  journalingIntroVideo: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/video/JOURNALING-INTRO-LOW.mp4',
  introVideo: 'https://md30-assets.s3.us-east-2.amazonaws.com/intro.mp4',
  medicalReportVideo: require('@/assets/videos/medical-report.mp4'),
  urgeSurfingMeditationVideo: 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/video/urge-surfing-meditation.mp4',
} as const

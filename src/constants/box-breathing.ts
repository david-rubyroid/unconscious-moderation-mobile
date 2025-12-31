import type { TFunction } from 'i18next'

function getBoxBreathingInstructions(t: TFunction) {
  return [
    {
      label: t('inhale'),
      value: 'inhale',
    },
    {
      label: t('hold'),
      value: 'hold',
    },
    {
      label: t('exhale'),
      value: 'exhale',
    },
  ]
}
const BOX_BREATHING_DURATION = 4 // 4 seconds per instruction
const BOX_BREATHING_AUDIO_URL = 'https://unconscious-moderation.s3.us-east-1.amazonaws.com/box-breathing/audio-box-breathing.mp3'

export { BOX_BREATHING_AUDIO_URL, BOX_BREATHING_DURATION, getBoxBreathingInstructions }

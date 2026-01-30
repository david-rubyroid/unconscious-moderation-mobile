import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import Check from '@/assets/icons/check'

import { ThemedText } from '@/components'

import { Colors } from '@/constants/theme'
import { isCheckInCompleted } from '@/utils/hypnosis-checkin-storage'

import { styles } from '../drink-with-awareness.styles'

const s = styles.screen

interface HypnosisCheckInBannerProps {
  sessionId: number
  hoursSinceFirstDrink: number
  hypnosisCheckIn: {
    type: '1Hour' | 'awareness' | 'grounding'
    link: string
  }
  onPress: (
    _link: string,
    _title: string,
    _type: string,
    _hours: number,
  ) => void
}

export function HypnosisCheckInBanner({
  sessionId,
  hoursSinceFirstDrink,
  hypnosisCheckIn,
  onPress,
}: HypnosisCheckInBannerProps) {
  const { t } = useTranslation('drink-with-awareness')
  const [isCompleted, setIsCompleted] = useState(false)

  // Check completion when component comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkCompletion = async () => {
        if (hoursSinceFirstDrink >= 1) {
          const completed = await isCheckInCompleted(sessionId, hoursSinceFirstDrink)
          setIsCompleted(completed)
        }
      }

      checkCompletion()
    }, [sessionId, hoursSinceFirstDrink]),
  )

  const getLabel = () => {
    switch (hypnosisCheckIn.type) {
      case '1Hour':
        return {
          bannerLabel: t('hypnosis-check-in', { hours: hoursSinceFirstDrink }),
          hypnosisCheckInLabel: t('hypnosis-check-in-hours', { hours: hoursSinceFirstDrink }),
          type: '1Hour',
        }
      case 'awareness':
        return {
          bannerLabel: t('hypnosis-check-in', { hours: hoursSinceFirstDrink }),
          hypnosisCheckInLabel: t('hypnosis-check-in-awareness'),
          type: 'awareness',
        }
      case 'grounding':
        return {
          bannerLabel: t('hypnosis-check-in', { hours: hoursSinceFirstDrink }),
          hypnosisCheckInLabel: t('hypnosis-check-in-grounding'),
          type: 'grounding',
        }
      default:
        return {
          bannerLabel: t('hypnosis-check-in', { hours: hoursSinceFirstDrink }),
          hypnosisCheckInLabel: t('hypnosis-check-in', { hours: hoursSinceFirstDrink }),
          type: '1Hour',
        }
    }
  }
  const { bannerLabel, hypnosisCheckInLabel } = getLabel()

  return (
    <Pressable
      style={s.hypnosisCheckInContainer}
      onPress={() => onPress(
        hypnosisCheckIn.link,
        hypnosisCheckInLabel,
        hypnosisCheckIn.type,
        hoursSinceFirstDrink,
      )}
    >
      <View style={s.hypnosisCheckInIconContainer}>
        {isCompleted && (
          <Check
            width={6}
            height={7}
            color={Colors.light.black}
          />
        )}
      </View>

      <ThemedText type="defaultSemiBold" style={s.hypnosisCheckInText}>
        {bannerLabel}
      </ThemedText>
    </Pressable>
  )
}

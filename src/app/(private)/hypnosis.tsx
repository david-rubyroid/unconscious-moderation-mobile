import type { AudioPlayer as ExpoAudioPlayer } from 'expo-audio'

import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import hypnosisBackgroundImage from '@/assets/images/box-breathing-bg.jpg'
import {
  AudioPlayer,
  Button,
  Header,
  Modal,
  ScreenContainer,
  ThemedText,
} from '@/components'
import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'
import { Colors } from '@/constants/theme'
import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(30),
  },
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  modalDescription: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
})

function HypnosisScreen() {
  const { t } = useTranslation('hypnosis-adventure')

  const [isModalVisible, setIsModalVisible] = useState(false)

  const { mutateAsync: completeActivity } = useCompleteActivity()

  const { day } = useLocalSearchParams()
  const hasCompletedRef = useRef(false)
  const [player, setPlayer] = useState<ExpoAudioPlayer | null>(null)

  const handlePlayStart = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true
      completeActivity({
        day: Number(day),
        activityType: 'hypnosis',
      }).catch(() => {
        // Reset on error to allow retry
        hasCompletedRef.current = false
      })
    }
  }
  const handlePlayerReady = (audioPlayer: ExpoAudioPlayer | null) => {
    setPlayer(audioPlayer)
  }
  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  // Enable lock screen controls
  useEffect(() => {
    if (player) {
      player.setActiveForLockScreen(true, {
        title: t(`day-${day}`),
        artist: 'Unconscious Moderation',
      })
    }

    return () => {
      if (player) {
        player.clearLockScreenControls()
      }
    }
  }, [player, day, t])

  useEffect(() => {
    setTimeout(() => {
      setIsModalVisible(true)
    }, 300)
  }, [])

  return (
    <ScreenContainer backgroundImage={hypnosisBackgroundImage}>
      <Modal visible={isModalVisible} onClose={handleCloseModal}>
        <View style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>{t(`day-${day}.title`)}</ThemedText>

          <ThemedText
            type="defaultSemiBold"
            style={styles.modalDescription}
          >
            {t(`day-${day}.description`)}
          </ThemedText>

          <Button
            variant="secondary"
            title={t('got-it')}
            onPress={handleCloseModal}
          />
        </View>
      </Modal>

      <Header title={t(`day-${day}.title`)} whiteTitle />

      <AudioPlayer
        textColor={Colors.light.white}
        audioUri={HYPNOSIS_LINKS.hypnosisForAdventure[
          `day${day}` as keyof typeof HYPNOSIS_LINKS.hypnosisForAdventure
        ]}
        onPlayStart={handlePlayStart}
        onPlayerReady={handlePlayerReady}
      />
    </ScreenContainer>
  )
}

export default HypnosisScreen

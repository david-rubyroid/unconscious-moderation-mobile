import * as StoreReview from 'expo-store-review'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Linking, StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'

import {
  markFeedbackModalRated,
  markFeedbackModalShown,
  shouldShowFeedbackModal,
} from '@/utils/feedback-modal'
import { verticalScale } from '@/utils/responsive'

import Button from './button'
import Modal from './modal'
import ThemedText from './themed-text'

interface FeedBackModalProps {
  unlockedDaysCount: number | null | undefined
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(24),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  buttonsContainer: {
    gap: verticalScale(24),
  },
})

function FeedBackModal({ unlockedDaysCount }: FeedBackModalProps) {
  const { t } = useTranslation('home')
  const [visible, setVisible] = useState(false)

  const handleClose = () => {
    setVisible(false)
  }
  const handleReallyEnjoyingIt = async () => {
    try {
      const isAvailable = await StoreReview.isAvailableAsync()
      if (isAvailable) {
        await StoreReview.requestReview()
      }
      await markFeedbackModalRated()
    }
    catch (error) {
      console.error('Error requesting store review:', error)
    }
    finally {
      handleClose()
    }
  }

  const handleNeedsSomeWork = async () => {
    try {
      await Linking.openURL('mailto:support@um.app?subject=App Feedback')
      await markFeedbackModalShown()
    }
    catch (error) {
      console.warn('Cannot open email client:', error)
      await markFeedbackModalShown()
    }
    finally {
      handleClose()
    }
  }

  useEffect(() => {
    const checkShouldShowModal = async () => {
      const shouldShow = await shouldShowFeedbackModal(unlockedDaysCount)
      setVisible(shouldShow)
    }

    checkShouldShowModal()
  }, [unlockedDaysCount])

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      onUserDismiss={async () => {
        await markFeedbackModalShown()
        handleClose()
      }}
    >
      <View style={styles.container}>
        <ThemedText type="subtitle" style={styles.title}>
          {t('feedback-modal.title1')}
        </ThemedText>

        <View style={styles.buttonsContainer}>
          <Button
            title={t('feedback-modal.really-enjoying-it')}
            onPress={handleReallyEnjoyingIt}
          />

          <Button
            title={t('feedback-modal.needs-some-work')}
            onPress={handleNeedsSomeWork}
          />
        </View>
      </View>
    </Modal>
  )
}

export default FeedBackModal

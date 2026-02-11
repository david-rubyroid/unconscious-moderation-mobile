import type { ImageSourcePropType } from 'react-native'

import type { ActivityFeedbackType } from '@/hooks/use-activity-feedback'

import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'

import DislikeIcon from '@/assets/icons/dislike'
import LikeIcon from '@/assets/icons/like'
import hypnosisDoneImage from '@/assets/images/end-of-activity/hypnosis-done.webp'
import journalingDoneImage from '@/assets/images/end-of-activity/journaling-done.webp'
import movementDoneImage from '@/assets/images/end-of-activity/movment-done.webp'
import readingDoneImage from '@/assets/images/end-of-activity/reading-done.webp'

import { Button, Modal, ThemedText } from '@/components'
import { Colors } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

const ACTIVITY_CONFIG: Record<
  ActivityFeedbackType,
  {
    namespace: string
    titleKey: string
    descriptionKey: string
    image: ImageSourcePropType
    imageWidth: number
    imageHeight: number
  }
> = {
  hypnosis: {
    namespace: 'hypnosis-adventure',
    titleKey: 'hypnosis-adventure-done-modal-title',
    descriptionKey: 'hypnosis-adventure-done-modal-description',
    image: hypnosisDoneImage,
    imageWidth: scale(94),
    imageHeight: scale(90),
  },
  reading: {
    namespace: 'reading',
    titleKey: 'nice',
    descriptionKey: 'every-insight-gives-your-brain-new-tools-for-transformation',
    image: readingDoneImage,
    imageWidth: scale(77),
    imageHeight: scale(110),
  },
  movement: {
    namespace: 'movement',
    titleKey: 'you-did-it',
    descriptionKey: 'you-re-literally-rewiring-your-brain-with-every-session',
    image: movementDoneImage,
    imageWidth: scale(69),
    imageHeight: scale(105),
  },
  journaling: {
    namespace: 'journaling',
    titleKey: 'great-work',
    descriptionKey: 'you-re-creating-the-awareness-needed-to-make-conscious-choices',
    image: journalingDoneImage,
    imageWidth: scale(105),
    imageHeight: scale(95),
  },
}

export interface ActivityFeedbackModalProps {
  visible: boolean
  activityType: ActivityFeedbackType
  onLike: () => void
  onDislike: () => void
  onSkip: () => void
}

const styles = StyleSheet.create({
  doneModalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(23),
  },
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  modalDescription: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  doneImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.white,
    width: scale(127),
    height: scale(127),
    borderRadius: 9999,
  },
  doneImage: {
    width: scale(90),
    height: scale(90),
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: scale(16),
  },
  feedbackButton: {
    width: 96,
  },
  skipButton: {
    paddingVertical: verticalScale(8),
  },
  skipText: {
    color: Colors.light.primary4,
    textDecorationLine: 'underline',
  },
})

export function ActivityFeedbackModal({
  visible,
  activityType,
  onLike,
  onDislike,
  onSkip,
}: ActivityFeedbackModalProps) {
  const config = ACTIVITY_CONFIG[activityType]
  const { t } = useTranslation(config.namespace)

  return (
    <Modal
      visible={visible}
      onClose={onSkip}
      variant="gradient"
    >
      <View style={styles.doneModalContent}>
        <ThemedText
          type="subtitle"
          style={styles.modalTitle}
        >
          {t(config.titleKey)}
        </ThemedText>

        <View style={styles.doneImageContainer}>
          <Image
            style={styles.doneImage}
            source={config.image}
            width={config.imageWidth}
            height={config.imageHeight}
          />
        </View>

        <ThemedText
          type="defaultSemiBold"
          style={styles.modalDescription}
        >
          {t(config.descriptionKey)}
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          style={styles.modalDescription}
        >
          {t('was-this-helpful')}
        </ThemedText>

        <View style={styles.buttonsContainer}>
          <Button
            style={styles.feedbackButton}
            onPress={onLike}
            icon={<LikeIcon />}
          />
          <Button
            style={styles.feedbackButton}
            onPress={onDislike}
            icon={<DislikeIcon />}
          />
        </View>
      </View>
    </Modal>
  )
}

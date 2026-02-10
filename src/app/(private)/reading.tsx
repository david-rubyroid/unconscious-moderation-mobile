import { useLocalSearchParams, useRouter } from 'expo-router'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import {
  useCompleteActivity,
  useGetActivityFeedback,
  useSubmitActivityFeedback,
} from '@/api/queries/daily-activities'

import ClockIcon from '@/assets/icons/clock'
import DislikeIcon from '@/assets/icons/dislike'
import LikeIcon from '@/assets/icons/like'
import readingDoneImage from '@/assets/images/end-of-activity/reading-done.webp'

import { Button, Modal, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { getReadingImage } from '@/utils/reading-images'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: 249,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(18),
  },
  imageBackgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.5),
  },
  title: {
    color: Colors.light.white,
    textAlign: 'center',
    paddingHorizontal: scale(37),
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(37),
  },
  minutesRead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  minutesReadText: {
    color: Colors.light.primary4,
  },
  flatListContentContainer: {
    gap: verticalScale(18),
  },
  contentItem: {
    gap: verticalScale(18),
    paddingHorizontal: scale(33),
  },
  contentItemTitle: {
    color: Colors.light.primary,
  },
  button: {
    alignSelf: 'center',
  },
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
    width: scale(77),
    height: scale(110),
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: scale(16),
  },
  feedbackButton: {
    width: 96,
  },
  textSizeButtons: {
    flexDirection: 'row',
    gap: scale(15),
  },
  textSizeButtonText: {
    color: Colors.light.primary4,
  },
})

type ContentEntry = [string, { title?: string, description: string }]

interface ReadingContentItemProps {
  item: ContentEntry
  textType: 'default' | 'preSubtitle'
}

const ReadingContentItem = memo(({
  item,
  textType,
}: ReadingContentItemProps) => (
  <View style={styles.contentItem}>
    {item[1].title && (
      <ThemedText style={styles.contentItemTitle} type="preSubtitle">
        {item[1].title}
      </ThemedText>
    )}

    <ThemedText type={textType}>{item[1].description}</ThemedText>
  </View>
))

function ReadingScreen() {
  const { back } = useRouter()
  const { t } = useTranslation('reading')
  const { day } = useLocalSearchParams()
  const dayNumber = Number(day)

  const [textType, setTextType] = useState<'default' | 'preSubtitle'>('default')
  const [isDoneModalVisible, setIsDoneModalVisible] = useState(false)

  const { mutateAsync: completeActivity } = useCompleteActivity()
  const { mutate: submitFeedback } = useSubmitActivityFeedback()
  const { data: activityFeedbackList } = useGetActivityFeedback(dayNumber)

  const hasFeedbackForReading = activityFeedbackList?.some(
    f => f.activity_type === 'reading',
  ) ?? false

  const contentItems = Object.entries(t(`day-${day}.content`, { returnObjects: true }))
  const readingImage = getReadingImage(day)

  const handleSetTextType = (type: 'default' | 'preSubtitle') => {
    setTextType(type)
  }

  const closeDoneModalAndBack = () => {
    setIsDoneModalVisible(false)
    back()
  }

  const handleDonePress = async () => {
    if (hasFeedbackForReading) {
      back()
      return
    }
    await completeActivity({
      day: dayNumber,
      activityType: 'reading',
    })
    setIsDoneModalVisible(true)
  }

  const handleDoneModalLike = () => {
    submitFeedback({
      day: dayNumber,
      activityType: 'reading',
      isHelpful: true,
    })
    closeDoneModalAndBack()
  }

  const handleDoneModalDislike = () => {
    submitFeedback({
      day: dayNumber,
      activityType: 'reading',
      isHelpful: false,
    })
    closeDoneModalAndBack()
  }

  return (
    <>
      <FlatList
        data={contentItems}
        keyExtractor={item => item[0]}
        initialNumToRender={10}
        contentContainerStyle={styles.flatListContentContainer}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={(
          <>
            <ImageBackground source={readingImage} style={styles.imageBackground}>
              <View style={styles.imageBackgroundOverlay} />

              <ThemedText style={styles.title} type="subtitle">{t(`day-${day}.title`)}</ThemedText>
            </ImageBackground>

            <View style={styles.header}>
              <View style={styles.minutesRead}>
                <ClockIcon color={Colors.light.primary4} />
                <ThemedText style={styles.minutesReadText} type="defaultSemiBold">{t('minutes-read', { minutes: 4 })}</ThemedText>
              </View>

              <View style={styles.textSizeButtons}>
                <Pressable onPress={() => handleSetTextType('preSubtitle')}>
                  <ThemedText
                    type="preSubtitle"
                    style={styles.textSizeButtonText}
                  >
                    A
                  </ThemedText>
                </Pressable>

                <Pressable onPress={() => handleSetTextType('default')}>
                  <ThemedText
                    type="preSubtitle"
                    style={styles.textSizeButtonText}
                  >
                    a
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </>
        )}
        ListFooterComponent={(
          <Button
            title={t('done')}
            onPress={handleDonePress}
            style={styles.button}
          />
        )}
        renderItem={({ item }) => (
          <ReadingContentItem
            item={item}
            textType={textType}
          />
        )}
      />

      <Modal
        visible={isDoneModalVisible}
        onClose={closeDoneModalAndBack}
        variant="gradient"
      >
        <View style={styles.doneModalContent}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {t('nice')}
          </ThemedText>

          <View style={styles.doneImageContainer}>
            <Image style={styles.doneImage} source={readingDoneImage} />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.modalDescription}>
            {t('every-insight-gives-your-brain-new-tools-for-transformation')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.modalDescription}>
            {t('was-this-helpful')}
          </ThemedText>

          <View style={styles.buttonsContainer}>
            <Button
              style={styles.feedbackButton}
              onPress={handleDoneModalLike}
              icon={<LikeIcon />}
            />
            <Button
              style={styles.feedbackButton}
              onPress={handleDoneModalDislike}
              icon={<DislikeIcon />}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}
export default ReadingScreen

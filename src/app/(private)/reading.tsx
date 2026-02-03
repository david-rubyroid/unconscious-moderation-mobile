import { useLocalSearchParams, useRouter } from 'expo-router'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import { useCompleteActivity } from '@/api/queries/daily-activities'

import ClockIcon from '@/assets/icons/clock'

import { Button, ThemedText } from '@/components'

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

  const [textType, setTextType] = useState<'default' | 'preSubtitle'>('default')

  const { mutateAsync: completeActivity } = useCompleteActivity()

  const contentItems = Object.entries(t(`day-${day}.content`, { returnObjects: true }))
  const readingImage = getReadingImage(day)

  const handleSetTextType = (type: 'default' | 'preSubtitle') => {
    setTextType(type)
  }
  const handleCompleteActivity = async () => {
    await completeActivity({
      day: Number(day),
      activityType: 'reading',
    })

    back()
  }

  return (
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
          onPress={handleCompleteActivity}
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
  )
}
export default ReadingScreen

import type { ImageSourcePropType } from 'react-native'
import type { Step } from '../progress-steps'

import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import ProgressSteps from '../progress-steps'
import ThemedText from '../themed-text'

const styles = StyleSheet.create({
  contentWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: scale(50),
  },
  progressStepsContainer: {
    position: 'absolute',
    left: 0,
    top: verticalScale(25),
    marginRight: scale(15),
  },
  content: {
    flex: 1,
    gap: verticalScale(20),
  },
  contentImage: {
    minHeight: verticalScale(80),
    paddingVertical: verticalScale(26),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
  },
  contentText: {
    color: Colors.light.white,
    position: 'relative',
    zIndex: 1,
  },
})

interface ActivityCard {
  id: string
  image: ImageSourcePropType
  label: string
  onPress: () => void
}

interface ActivityCardsListProps {
  steps: Step[]
  locked: boolean
  activities: ActivityCard[]
}

function ActivityCardsList({ steps, locked, activities }: ActivityCardsListProps) {
  return (
    <View style={styles.contentWrapper}>
      <View style={styles.progressStepsContainer}>
        <ProgressSteps locked={locked} steps={steps} connectorHeight={verticalScale(50)} />
      </View>

      <View style={styles.content}>
        {activities.map(activity => (
          <Pressable key={activity.id} onPress={activity.onPress}>
            <ImageBackground source={activity.image} style={styles.contentImage}>
              <View style={styles.contentOverlay} />

              <ThemedText type="defaultSemiBold" style={styles.contentText}>
                {activity.label}
              </ThemedText>
            </ImageBackground>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default ActivityCardsList

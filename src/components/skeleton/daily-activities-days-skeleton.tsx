import { StyleSheet, View } from 'react-native'

import { scale, verticalScale } from '@/utils/responsive'

import Skeleton from './skeleton'

const styles = StyleSheet.create({
  wrapper: {
    gap: verticalScale(19),
    marginVertical: verticalScale(20),
  },
  scrollContainer: {
    marginHorizontal: -scale(15),
  },
  container: {
    flexDirection: 'row',
    gap: scale(22),
    paddingHorizontal: scale(15),
  },
  title: {
    marginBottom: 0,
  },
  dayWrapper: {
    paddingTop: scale(4),
    paddingRight: scale(4),
  },
  dayCircle: {
    width: 43,
    borderRadius: scale(10),
  },
})

function DailyActivitiesDaysSkeleton() {
  return (
    <View style={styles.wrapper}>
      <Skeleton
        width="50%"
        height={20}
        style={styles.title}
      />

      <View style={styles.scrollContainer}>
        <View style={styles.container}>
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <View key={day} style={styles.dayWrapper}>
              <Skeleton
                width={43}
                height={43}
                borderRadius={scale(10)}
                style={styles.dayCircle}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default DailyActivitiesDaysSkeleton

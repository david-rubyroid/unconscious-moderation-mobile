import { StyleSheet, View } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import DailyActivitiesDaysSkeleton from './daily-activities-days-skeleton'
import Skeleton from './skeleton'

const styles = StyleSheet.create({
  welcome: {
    marginBottom: verticalScale(9),
  },
  quoteContainer: {
    paddingHorizontal: scale(19),
    marginBottom: verticalScale(31),
    gap: verticalScale(8),
  },
  lastDrinkContainer: {
    paddingHorizontal: scale(33),
    paddingVertical: verticalScale(20),
    backgroundColor: withOpacity(Colors.light.white, 0.7),
    borderRadius: scale(10),
    marginBottom: verticalScale(20),
  },
  lastDrinkText: {
    marginBottom: verticalScale(15),
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
  },
  timerIcon: {
    borderRadius: 7,
  },
  timerCircles: {
    flexDirection: 'row',
    gap: scale(20),
  },
  timerCircle: {
    width: 36,
    borderRadius: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(14),
    marginTop: verticalScale(15),
  },
  button: {
    flex: 1,
    maxWidth: '48%',
  },
  journeyStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(13),
    alignSelf: 'center',
    paddingHorizontal: scale(14),
    paddingVertical: scale(9),
    backgroundColor: withOpacity(Colors.light.white, 0.7),
    borderRadius: scale(10),
    marginBottom: verticalScale(20),
  },
  journeyStreakIcon: {
    borderRadius: scale(7),
  },
  todaysAdventureContainer: {
    marginVertical: verticalScale(20),
    gap: verticalScale(20),
  },
  todaysAdventureTitle: {
    marginBottom: verticalScale(10),
  },
  todaysAdventureCards: {
    gap: scale(20),
  },
  adventureCard: {
    borderRadius: scale(10),
  },
  extraCreditContainer: {
    marginVertical: verticalScale(20),
    gap: verticalScale(20),
  },
  extraCreditTitle: {
    marginBottom: verticalScale(10),
  },
  extraCreditItems: {
    gap: verticalScale(20),
  },
  extraCreditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    padding: scale(11),
    paddingRight: scale(20),
    borderRadius: 10,
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.8),
  },
  extraCreditIcon: {
    width: scale(49),
    borderRadius: scale(10),
  },
  extraCreditText: {
    flex: 1,
  },
  externalResourcesContainer: {
    alignItems: 'center',
    marginTop: verticalScale(30),
    gap: verticalScale(12),
  },
  externalResourcesDots: {
    width: 40,
    borderRadius: 4,
  },
  externalResourcesItems: {
    width: '100%',
    gap: verticalScale(20),
  },
  externalResourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: scale(14.5),
    paddingHorizontal: scale(12),
    borderRadius: 8,
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.8),
  },
})

function HomeScreenSkeleton() {
  return (
    <>
      {/* Welcome Section */}
      <Skeleton
        width="60%"
        height={29}
        style={styles.welcome}
      />

      {/* Quote Container */}
      <View style={styles.quoteContainer}>
        <Skeleton width="80%" height={18} />
        <Skeleton width="100%" height={18} />
        <Skeleton width="90%" height={18} />
        <Skeleton width="50%" height={22} style={{ marginTop: verticalScale(4) }} />
      </View>

      {/* Last Drink Container */}
      <View style={styles.lastDrinkContainer}>
        <Skeleton
          width="40%"
          height={20}
          style={styles.lastDrinkText}
        />

        {/* Timer with icon */}
        <View style={styles.timerContainer}>
          <Skeleton
            width={37}
            height={37}
            borderRadius={7}
            style={styles.timerIcon}
          />

          <View style={styles.timerCircles}>
            {[1, 2, 3].map(i => (
              <Skeleton
                key={i}
                width={36}
                height={36}
                borderRadius={18}
                style={styles.timerCircle}
              />
            ))}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Skeleton
            height={22}
            borderRadius={scale(36)}
            style={styles.button}
          />
          <Skeleton
            height={22}
            borderRadius={scale(36)}
            style={styles.button}
          />
        </View>
      </View>

      {/* Daily Activities Days */}
      <DailyActivitiesDaysSkeleton />

      {/* Journey Streak */}
      <View style={styles.journeyStreakContainer}>
        <Skeleton
          width={scale(37)}
          height={scale(37)}
          borderRadius={scale(7)}
          style={styles.journeyStreakIcon}
        />

        <Skeleton
          width="60%"
          height={20}
        />
      </View>

      {/* Todays Adventure */}
      <View style={styles.todaysAdventureContainer}>
        <Skeleton
          width="70%"
          height={29}
          style={styles.todaysAdventureTitle}
        />

        <View style={styles.todaysAdventureCards}>
          {[1, 2, 3, 4].map(card => (
            <Skeleton
              key={card}
              height={75}
              borderRadius={scale(8)}
              style={styles.adventureCard}
            />
          ))}
        </View>
      </View>

      {/* Extra Credit */}
      <View style={styles.extraCreditContainer}>
        <Skeleton
          width="40%"
          height={24}
          style={styles.extraCreditTitle}
        />

        <View style={styles.extraCreditItems}>
          {[1, 2].map(item => (
            <View key={item} style={styles.extraCreditItem}>
              <Skeleton
                width={scale(49)}
                height={scale(46)}
                borderRadius={scale(10)}
                style={styles.extraCreditIcon}
              />
              <Skeleton
                width="60%"
                height={20}
                style={styles.extraCreditText}
              />
            </View>
          ))}
        </View>
      </View>

      {/* External Resources */}
      <View style={styles.externalResourcesContainer}>
        <Skeleton
          width={40}
          height={8}
          borderRadius={4}
          style={styles.externalResourcesDots}
        />
        <View style={styles.externalResourcesItems}>
          {[1, 2, 3].map(item => (
            <View key={item} style={styles.externalResourceItem}>
              <Skeleton
                width={scale(49)}
                height={scale(46)}
                borderRadius={scale(10)}
              />

              <Skeleton
                width="70%"
                height={20}
              />
            </View>
          ))}
        </View>
      </View>
    </>
  )
}

export default HomeScreenSkeleton

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'

import { useGetCurrentUser } from '@/api/queries/auth'
import { useGetDaysWithActivities } from '@/api/queries/daily-activities'

import {
  ActiveDrinkSession,
  DailyActivitiesDays,
  ExternalResources,
  ExtraCredit,
  FeedBackModal,
  HomeScreenSkeleton,
  JourneyStreak,
  ScreenContainer,
  ThemedText,
  TodaysAdventure,
} from '@/components'
import { Colors } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  welcome: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(9),
  },
  reminder: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(11),
    fontStyle: 'italic',
  },
  breneBrownQuote: {
    color: Colors.light.primary4,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  breneBrownQuoteAuthor: {
    color: Colors.light.primary4,
    fontStyle: 'italic',
  },
  quoteContainer: {
    paddingHorizontal: scale(19),
    marginBottom: verticalScale(19),
  },
  yourAnchorContainer: {
    paddingHorizontal: scale(19),
    marginBottom: verticalScale(19),
  },
})

function HomeScreen() {
  const { t } = useTranslation('home')
  const { t: tQuotes } = useTranslation('quotes')

  const { data: user, isLoading: isLoadingUser } = useGetCurrentUser()
  const { data: daysWithActivities, isLoading: isLoadingDays } = useGetDaysWithActivities()

  const [dailyActivitiesDay, setDailyActivitiesDay] = useState<number>(1)

  const isLoading = isLoadingUser || isLoadingDays

  const handleSetDailyActivitiesDay = (day: number) => {
    setDailyActivitiesDay(day)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setDailyActivitiesDay(daysWithActivities?.unlockedDaysCount || 1)
  }, [daysWithActivities?.unlockedDaysCount])

  if (isLoading) {
    return (
      <ScreenContainer scrollable>
        <HomeScreenSkeleton />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer scrollable>
      <ThemedText type="subtitle" style={styles.welcome}>
        {t('welcome', { name: user?.firstName })}
      </ThemedText>

      <View style={styles.quoteContainer}>
        <ThemedText type="defaultSemiBold" style={styles.reminder}>
          {t('reminder')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.breneBrownQuote}>
          {tQuotes(`day-${dailyActivitiesDay}.quote`)}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.breneBrownQuoteAuthor}>
          {tQuotes(`day-${dailyActivitiesDay}.author`)}
        </ThemedText>
      </View>

      <View style={styles.yourAnchorContainer}>
        <ThemedText type="defaultSemiBold" style={styles.reminder}>
          {t('your-anchor')}
        </ThemedText>

        <ThemedText type="default" style={styles.breneBrownQuote}>
          "
          {user?.yourAnchor}
          "
        </ThemedText>
      </View>

      <ActiveDrinkSession />

      <DailyActivitiesDays
        onDayPress={handleSetDailyActivitiesDay}
        dailyActivitiesDay={dailyActivitiesDay}
      />

      <JourneyStreak />

      <TodaysAdventure dailyActivitiesDay={dailyActivitiesDay} />

      <ExtraCredit dailyActivitiesDay={dailyActivitiesDay} />

      <ExternalResources />

      <FeedBackModal unlockedDaysCount={daysWithActivities?.unlockedDaysCount} />
    </ScreenContainer>
  )
}

export default HomeScreen

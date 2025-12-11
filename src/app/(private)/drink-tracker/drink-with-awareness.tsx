import { useLocalSearchParams, useRouter } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetSessionDrinks } from '@/api/queries/drink-log'
import { useGetDrinkSession, useUpdateDrinkSession } from '@/api/queries/drink-session'
import { useGetSessionWater, useLogWater } from '@/api/queries/water-log'
import { queryClient } from '@/api/query-client'

import CocktailIcon from '@/assets/icons/cocktail'
import DropIcon from '@/assets/icons/drop'
import MoneyIcon from '@/assets/icons/money'
import TimeSinceIcon from '@/assets/icons/time-since'

import proTipImage from '@/assets/images/pro-tip.jpg'

import {
  Button,
  DrinkTrackerWeekDays,
  Header,
  ThemedGradient,
  ThemedText,
} from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  weekDaysContainer: {
    width: '100%',
    marginBottom: verticalScale(27),
  },
  remember: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(27),
  },
  countersContainer: {
    flexDirection: 'row',
    gap: scale(13),
    marginBottom: verticalScale(27),
  },
  counter: {
    flex: 1,
    alignItems: 'flex-start',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(12),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    gap: scale(9),
    borderRadius: scale(6),
  },
  counterText: {
    fontWeight: 400,
    color: withOpacity(Colors.light.black, 0.5),
  },
  counterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
  },
  counterValue: {
    fontSize: scale(32),
    fontWeight: '700',
    lineHeight: scale(38),
    color: Colors.light.primary4,
  },
  counterIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    paddingHorizontal: scale(14),
    paddingVertical: scale(10),
    borderRadius: '50%',
  },
  counterButton: {
    height: 27,
    borderRadius: 36,
    width: '100%',
  },
  proTipContainer: {
    alignItems: 'center',
    borderRadius: scale(12),
    overflow: 'hidden',
    paddingVertical: verticalScale(11),
    paddingHorizontal: scale(30),
    marginBottom: verticalScale(27),
  },
  proTipOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.8),
  },
  proTipTitle: {
    textAlign: 'center',
    color: Colors.light.white,
  },
  proTipDescription: {
    textAlign: 'center',
    color: Colors.light.white,
    fontWeight: '400',
  },
  proTipDescriptionBold: {
    fontWeight: '700',
    color: Colors.light.white,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: scale(10),
    marginBottom: verticalScale(27),
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(7),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    gap: scale(8),
    borderRadius: scale(6),
  },
  infoItemTitle: {
    fontSize: scale(11),
    color: withOpacity(Colors.light.black, 0.5),
  },
  infoItemDescription: {
    color: Colors.light.black,
    fontWeight: '400',
  },
  infoItemContent: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(21),
    marginBottom: verticalScale(27),
  },
  button: {
    width: '45%',
  },
  manageUrgesButton: {
    backgroundColor: Colors.light.error2,
  },
})

function DrinkWithAwarenessScreen() {
  const { push } = useRouter()

  const { top, bottom } = useSafeAreaInsets()
  const { t } = useTranslation('drink-with-awareness')
  const { sessionId } = useLocalSearchParams()

  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))
  const { data: sessionDrinks } = useGetSessionDrinks(Number(sessionId))
  const { data: sessionWater } = useGetSessionWater(Number(sessionId))
  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))

  const actualDrinksCount = sessionDrinks?.length || 0
  const maxDrinksCount = drinkSession?.maxDrinkCount || 0

  const actualSpending = Number(drinkSession?.actualSpent) || 0
  const budget = Number(drinkSession?.budget) || 0

  const totalWaterCups = sessionWater?.reduce((sum, water) => sum + water.cups, 0) || 0

  const { mutate: logWater, isPending: isLoggingWater } = useLogWater(
    Number(sessionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', Number(sessionId), 'water'] })
      },
    },
  )

  // Calculate time since first drink
  const getTimeSinceFirstDrink = () => {
    if (!sessionDrinks || sessionDrinks.length === 0) {
      return '0 hour'
    }

    const firstDrink = sessionDrinks[0]
    const firstDrinkTime = new Date(firstDrink.createdAt)
    const now = new Date()
    const diffMs = now.getTime() - firstDrinkTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours === 0) {
      return `${diffMinutes} min`
    }

    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  }
  const navigateToLogDrink = () => {
    push({
      pathname: '/drink-tracker/log-drink',
      params: { sessionId },
    })
  }
  const navigateToSelfHypnosis = () => {
    push({
      pathname: '/drink-tracker/hypnosis',
      params: { sessionId },
    })
  }
  const navigateToManageUrges = () => {
    push({
      pathname: '/drink-tracker/manage-urges',
      params: { sessionId },
    })
  }
  const handleLogWater = () => {
    logWater({ cups: 1 })
  }
  const handleFinishDrinking = () => {
    updateDrinkSession({
      status: 'completed',
    }, {
      onSuccess: () => {
        push({
          pathname: '/drink-tracker',
          params: { sessionId },
        })
      },
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} route="/drink-tracker" isReplace />

      <View style={styles.container}>
        <View style={styles.weekDaysContainer}>
          <DrinkTrackerWeekDays />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <ThemedText type="defaultSemiBold" style={styles.remember}>
            {t('remember', { mantra: drinkSession?.mantra })}
          </ThemedText>

          <View style={styles.countersContainer}>
            <View style={styles.counter}>
              <ThemedText style={styles.counterText}>
                {t('drinks')}
              </ThemedText>

              <View style={styles.counterValueContainer}>
                <View style={styles.counterIcon}>
                  <CocktailIcon />
                </View>

                <ThemedText style={styles.counterValue}>
                  {actualDrinksCount}
                  /
                  {maxDrinksCount}
                </ThemedText>
              </View>

              <Button
                variant="secondary"
                title={t('log-drink')}
                style={styles.counterButton}
                onPress={navigateToLogDrink}
              />
            </View>

            <View style={styles.counter}>
              <ThemedText style={styles.counterText}>
                {t('waters')}
              </ThemedText>

              <View style={styles.counterValueContainer}>
                <View style={styles.counterIcon}>
                  <DropIcon width={22} height={29} />
                </View>

                <ThemedText style={styles.counterValue}>
                  {totalWaterCups}
                </ThemedText>
              </View>

              <Button
                style={styles.counterButton}
                variant="secondary"
                title={t('log-water')}
                onPress={handleLogWater}
                disabled={isLoggingWater}
              />
            </View>
          </View>

          <ImageBackground source={proTipImage} style={styles.proTipContainer}>
            <View style={styles.proTipOverlay} />

            <ThemedText type="defaultSemiBold" style={styles.proTipTitle}>
              {t('pro-tip')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.proTipDescription}>
              <Trans
                i18nKey="drink-with-awareness:pro-tip-description"
                components={[
                  <ThemedText type="defaultSemiBold" key="0" style={styles.proTipDescriptionBold} />,
                  <ThemedText type="defaultSemiBold" key="1" style={styles.proTipDescriptionBold} />,
                  <ThemedText type="defaultSemiBold" key="2" style={styles.proTipDescriptionBold} />,
                ]}
              />
            </ThemedText>
          </ImageBackground>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MoneyIcon />

              <View style={styles.infoItemContent}>
                <ThemedText type="small" style={styles.infoItemTitle}>
                  {t('budget')}
                </ThemedText>

                <ThemedText type="defaultSemiBold" style={styles.infoItemDescription}>
                  $
                  {actualSpending}
                  /$
                  {budget}
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoItem}>
              <TimeSinceIcon />

              <View style={styles.infoItemContent}>
                <ThemedText type="small" style={styles.infoItemTitle}>
                  {t('time-since-first-drink')}
                </ThemedText>

                <ThemedText type="defaultSemiBold" style={styles.infoItemDescription}>
                  {getTimeSinceFirstDrink()}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              title={t('self-hypnosis')}
              style={styles.button}
              onPress={navigateToSelfHypnosis}
            />

            <Button
              onPress={navigateToManageUrges}
              title={t('manage-urges')}
              style={[styles.button, styles.manageUrgesButton]}
            />
          </View>

          <Button
            title={t('finish-drinking')}
            variant="secondary"
            onPress={handleFinishDrinking}
          />
        </ScrollView>
      </View>
    </ThemedGradient>
  )
}

export default DrinkWithAwarenessScreen

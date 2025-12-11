import type { DrinkType } from '@/api/queries/drink-session/dto'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetSessionDrinks, useLogDrink } from '@/api/queries/drink-log'
import { useGetCurrentDrinkSession } from '@/api/queries/drink-session'

import { queryClient } from '@/api/query-client'

import BeerIcon from '@/assets/icons/beer'
import CocktailsIcon from '@/assets/icons/cocktails'
import HardSeltzerIcon from '@/assets/icons/hard-seltzer-ready-to-drink'
import SpiritsIcon from '@/assets/icons/spirits'
import StartIcon from '@/assets/icons/start'
import WineIcon from '@/assets/icons/wine'

import { Button, DrinkSelector, Header, TextInput, ThemedGradient, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  myDrinksText: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(16),
  },
  myDrinksScrollView: {
    flexGrow: 0,
    marginHorizontal: -scale(15),
    marginBottom: verticalScale(21),
  },
  myDrinksContainer: {
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(15),
  },
  myDrink: {
    alignItems: 'center',
    gap: scale(11),
    paddingHorizontal: scale(23),
    paddingVertical: verticalScale(15),
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    borderRadius: scale(6),
  },
  myDrinkText: {
    textAlign: 'center',
    color: withOpacity(Colors.light.black, 0.5),
  },
  drinkTextSelected: {
    color: Colors.light.white,
  },
  drinkCostInput: {
    color: withOpacity(Colors.light.black, 0.5),
    borderColor: withOpacity(Colors.light.black, 0.10),
  },
  drinkingTipsTextContainer: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
    paddingHorizontal: scale(15),
    marginVertical: verticalScale(16),
  },
  drinkingTipsText: {
    color: Colors.light.primary4,
  },
  tipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(15),
    gap: scale(8),
    marginBottom: verticalScale(16),
  },
  tipItem: {
    flex: 1,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(6),
    padding: scale(12),
  },
  tipItemText: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  divider: {
    height: 21,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.light.primary4,
    textAlign: 'center',
  },
})

function getDrinkIcon(drinkType: DrinkType) {
  switch (drinkType) {
    case 'wine':
      return <WineIcon />
    case 'beer':
      return <BeerIcon />
    case 'spirits':
      return <SpiritsIcon />
    case 'cocktails':
      return <CocktailsIcon />
    case 'hard-seltzer-ready-to-drink':
      return <HardSeltzerIcon />
    default:
      return <WineIcon />
  }
}

function LogDrinkScreen() {
  const [selectedDrink, setSelectedDrink] = useState<DrinkType>('wine')
  const [drinkCost, setDrinkCost] = useState<string>('')

  const { t } = useTranslation('log-drink')
  const { top, bottom } = useSafeAreaInsets()

  const { data: currentSession, isLoading: isLoadingSession } = useGetCurrentDrinkSession()
  const { data: sessionDrinks, isLoading: isLoadingDrinks } = useGetSessionDrinks(
    currentSession?.id,
    {
      enabled: !!currentSession?.id,
    },
  )
  const { mutate: logDrink, isPending: isLoggingDrink } = useLogDrink(
    currentSession?.id,
    {
      onSuccess: () => {
        setDrinkCost('')
        // Invalidate drinks list for this session
        queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', currentSession?.id, 'drinks'] })
        // Invalidate session data (actualSpent is updated)
        queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions', currentSession?.id] })
        queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions'] })
        queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'current-session'] })
      },
    },
  )

  const handleLogDrink = () => {
    if (!currentSession?.id) {
      return
    }

    const cost = Number.parseFloat(drinkCost)
    if (Number.isNaN(cost) || cost < 0) {
      return
    }

    logDrink({
      drinkType: selectedDrink,
      cost,
    })
  }

  const isLoading = isLoadingSession || isLoadingDrinks

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary4} />
        </View>
      )
    }

    if (!currentSession) {
      return (
        <View style={styles.emptyStateContainer}>
          <ThemedText style={styles.emptyStateText}>
            {t('no-active-session')}
          </ThemedText>
        </View>
      )
    }

    return (
      <>
        <ThemedText style={styles.myDrinksText} type="defaultSemiBold">
          {t('my-drinks')}
        </ThemedText>

        {sessionDrinks && sessionDrinks.length > 0
          ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.myDrinksScrollView}
                contentContainerStyle={styles.myDrinksContainer}
              >
                {sessionDrinks.map(drink => (
                  <View key={drink.id} style={styles.myDrink}>
                    <ThemedText style={styles.myDrinkText}>
                      {t(drink.drinkType)}
                    </ThemedText>

                    {getDrinkIcon(drink.drinkType)}

                    <ThemedText style={styles.myDrinkText}>
                      $
                      {drink.cost}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>
            )
          : (
              <View style={styles.emptyStateContainer}>
                <ThemedText style={styles.emptyStateText}>
                  {t('no-drinks-logged-yet')}
                </ThemedText>
              </View>
            )}

        <ThemedText style={styles.myDrinksText} type="defaultSemiBold">
          {t('log-drink')}
        </ThemedText>

        <DrinkSelector selectedDrink={selectedDrink} onSelectDrink={setSelectedDrink} />

        <View style={styles.divider} />

        <TextInput
          placeholder={t('const-of-drink')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
          label={t('cost')}
          value={drinkCost}
          onChangeText={setDrinkCost}
          keyboardType="numeric"
          style={styles.drinkCostInput}
        />

        <View style={styles.drinkingTipsTextContainer}>
          <StartIcon />

          <ThemedText type="defaultSemiBold" style={styles.drinkingTipsText}>
            {t('drinking-tips')}
          </ThemedText>
        </View>

        <View style={styles.tipsContainer}>
          <View style={styles.tipItem}>
            <ThemedText
              type="defaultSemiBold"
              style={styles.tipItemText}
            >
              {t('one-drink-one-water-balance-is-everything')}
            </ThemedText>
          </View>

          <View style={styles.tipItem}>
            <ThemedText
              type="defaultSemiBold"
              style={styles.tipItemText}
            >
              {t('sip-slowly-stick-with-your-drink-stay-present')}
            </ThemedText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="secondary"
            title={t('log-drink')}
            onPress={handleLogDrink}
            disabled={!drinkCost || isLoggingDrink}
          />
        </View>
      </>
    )
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header
        title={t('title')}
        route={{
          pathname: '/drink-tracker/drink-with-awareness',
          params: { sessionId: currentSession?.id?.toString() },
        }}
        isReplace
      />

      <View style={styles.container}>
        {renderContent()}
      </View>
    </ThemedGradient>
  )
}

export default LogDrinkScreen

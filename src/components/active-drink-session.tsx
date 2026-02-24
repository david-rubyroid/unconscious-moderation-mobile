import { useRouter } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import { useGetSessionDrinks } from '@/api/queries/drink-log'
import { useGetCurrentDrinkSession } from '@/api/queries/drink-session'

import MoneyIcon from '@/assets/icons/money'
import TimeSinceIcon from '@/assets/icons/time-since'
import WineIcon from '@/assets/icons/wine'

import {
  Colors,
  getResponsiveFontSize,
  withOpacity,
} from '@/constants/theme'

import { getCurrencySymbol } from '@/utils/currency'
import { getDrinkIcon } from '@/utils/drink-icons'
import { getDrinkSessionStats } from '@/utils/drink-session-stats'
import { scale, verticalScale } from '@/utils/responsive'

import LastDrinkBlock from './last-drink-block'
import ThemedText from './themed-text'

const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    gap: scale(15),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(10),
  },
  title: {
    color: Colors.light.primary4,
    fontWeight: 500,
  },
  titleBold: {
    color: Colors.light.primary4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(11),
  },
  infoCard: {
    maxHeight: scale(59),
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    padding: scale(6.5),
    borderRadius: scale(6),
  },
  infoCardContent: {
    flex: 1,
  },
  infoLabel: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  infoValue: {
    fontWeight: 400,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 162,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    backgroundColor: Colors.light.primary4,
    borderRadius: scale(36),
  },
  buttonText: {
    color: Colors.light.white,
    fontWeight: 500,
  },
})

function ActiveDrinkSession() {
  const { push } = useRouter()
  const { t } = useTranslation('home')
  const { t: tDrinkTracker } = useTranslation('drink-tracker')

  const { data: currentDrinkSession } = useGetCurrentDrinkSession()
  const { data: sessionDrinks } = useGetSessionDrinks(currentDrinkSession?.id)

  const navigateToDrinkSession = () => {
    if (currentDrinkSession?.id) {
      push({
        pathname: '/drink-tracker/drink-with-awareness',
        params: { sessionId: currentDrinkSession.id },
      })
    }
  }

  const { timeSinceFirstDrink } = getDrinkSessionStats({
    drinkSession: currentDrinkSession || undefined,
    sessionDrinks,
    sessionWater: undefined,
  })

  const hasActiveDrinkSession = currentDrinkSession?.status === 'active'

  const currencySymbol = getCurrencySymbol(currentDrinkSession?.currency)
  const drinkTypeLabel = tDrinkTracker(
    `day-summary.drink-type-options.${currentDrinkSession?.drinkType}`,
  )

  if (!hasActiveDrinkSession) {
    return <LastDrinkBlock />
  }

  return (
    <View style={styles.container}>
      <ThemedText
        type="defaultSemiBold"
        style={styles.title}
      >
        <Trans
          i18nKey="home:active-drink-session.title"
          components={[
            <ThemedText
              key="0"
              type="defaultSemiBold"
              style={styles.titleBold}
            />,
          ]}
        />
      </ThemedText>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <WineIcon />

          <View style={styles.infoCardContent}>
            <ThemedText style={styles.infoLabel}>
              {t('active-drink-session.max-drinks')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.infoValue}>
              {currentDrinkSession.actualDrinkCount || 0}
              {' '}
              /
              {' '}
              {currentDrinkSession.maxDrinkCount}
            </ThemedText>
          </View>
        </View>

        <View style={styles.infoCard}>
          <TimeSinceIcon />
          <View style={styles.infoCardContent}>
            <ThemedText
              style={[
                styles.infoLabel,
                { fontSize: getResponsiveFontSize(10) },
              ]}
            >
              {t('active-drink-session.time-since-first-drink')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.infoValue}>
              {timeSinceFirstDrink}
            </ThemedText>
          </View>
        </View>

        <View style={styles.infoCard}>
          {getDrinkIcon(currentDrinkSession.drinkType)}

          <View style={styles.infoCardContent}>
            <ThemedText style={styles.infoLabel}>
              {t('active-drink-session.drink-type')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.infoValue}>
              {drinkTypeLabel}
            </ThemedText>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MoneyIcon />
          <View style={styles.infoCardContent}>
            <ThemedText style={styles.infoLabel}>
              {t('active-drink-session.budget')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.infoValue}>
              {currencySymbol}
              {currentDrinkSession.actualSpent || 0}
              {' '}
              /
              {' '}
              {currencySymbol}
              {currentDrinkSession.budget || 0}
            </ThemedText>
          </View>
        </View>
      </View>

      <Pressable onPress={navigateToDrinkSession} style={styles.button}>
        <ThemedText
          style={styles.buttonText}
        >
          {t('active-drink-session.go-to-session')}
        </ThemedText>
      </Pressable>
    </View>
  )
}

export default ActiveDrinkSession

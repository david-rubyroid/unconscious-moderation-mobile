import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useGetCurrentSobrietyStreak } from '@/api/queries/sobriety-tracker'

import CocktailIcon from '@/assets/icons/cocktail'
import Logo from '@/assets/icons/logo'

import { Colors } from '@/constants/theme'

import { scale } from '@/utils/responsive'

import SobrietyTimer from './sobriety-timer'
import ThemedText from './themed-text'

const styles = StyleSheet.create({
  container: {
    width: 362,
    gap: scale(16),
    paddingHorizontal: scale(37),
    paddingVertical: scale(33),
    borderRadius: scale(19),
    backgroundColor: Colors.light.tertiaryBackground,
  },
  header: {
    position: 'relative',
    borderRadius: scale(17),
    backgroundColor: '#BFE3C0',
    paddingTop: scale(19),
    paddingBottom: scale(180),
    paddingLeft: scale(18),
  },
  title: {
    fontSize: 30,
    color: Colors.light.primary4,
    lineHeight: 36,
  },
  cocktailIcon: {
    position: 'absolute',
    top: 19,
    right: 0,
  },
  timerContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.white,
    borderRadius: scale(17),
    paddingVertical: scale(26),
    paddingHorizontal: scale(18),
    gap: scale(23),
  },
  logoContainer: {
    alignItems: 'center',
    gap: scale(8),
    paddingVertical: scale(12),
  },
  shareButton: {
    alignSelf: 'center',
  },
})

function AlcoholFreeFor() {
  const { t } = useTranslation('free-drink-tracker')

  const { data: currentStreak } = useGetCurrentSobrietyStreak()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          type="title"
          style={styles.title}
        >
          {t('i-ve-been-alcohol-free-for')}
        </ThemedText>

        <CocktailIcon
          width={73}
          height={93}
          style={styles.cocktailIcon}
          color={Colors.light.primary}
        />

        <View style={styles.timerContainer}>
          <SobrietyTimer
            customSize={{
              circleSize: 48,
              strokeWidth: 3,
              valueSize: 19,
              labelSize: 10,
            }}
            streakStartDate={
              currentStreak?.streak?.started_at
                ? new Date(currentStreak.streak.started_at)
                : undefined
            }
            maxUnits={4}
          />

          <Logo width={65} height={33} color="#6ED09D" />
        </View>
      </View>
    </View>
  )
}

export default AlcoholFreeFor

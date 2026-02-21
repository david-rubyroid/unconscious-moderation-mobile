import type { TrophyType } from '@/api/queries/sobriety-tracker/dto'

import { Image } from 'expo-image'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useGetTrophies } from '@/api/queries/sobriety-tracker'

import threeDays from '@/assets/images/trophies/3-days.webp'
import sevenDays from '@/assets/images/trophies/7-days.webp'

import fourteenDays from '@/assets/images/trophies/14-days.webp'
import twentyOneDays from '@/assets/images/trophies/21-days.webp'
import twentyFourHours from '@/assets/images/trophies/24-hours.webp'
import thirtyDays from '@/assets/images/trophies/30-days.webp'
import sixtyDays from '@/assets/images/trophies/60-days.webp'
import ninetyDays from '@/assets/images/trophies/90-days.webp'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

const TROPHY_IMAGES: Record<TrophyType, any> = {
  '24h': twentyFourHours,
  '3d': threeDays,
  '7d': sevenDays,
  '14d': fourteenDays,
  '21d': twentyOneDays,
  '30d': thirtyDays,
  '60d': sixtyDays,
  '90d': ninetyDays,
}

const TROPHY_ORDER: TrophyType[] = ['24h', '3d', '7d', '14d', '21d', '30d', '60d', '90d']

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: -scale(21),
    marginBottom: verticalScale(20),
  },
  scrollContent: {
    paddingHorizontal: scale(21),
    paddingVertical: verticalScale(10),
    gap: scale(13),
  },
  trophyCard: {
    maxWidth: scale(169),
    backgroundColor: withOpacity(Colors.light.white, 0.6),
    borderRadius: scale(15),
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    shadowColor: Colors.light.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trophyIconContainer: {
    width: scale(75),
    height: scale(85),
    backgroundColor: Colors.light.white,
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  trophyIcon: {
    resizeMode: 'contain',
  },
  trophyDescription: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  trophyDescriptionBold: {
    color: Colors.light.primary4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
})

function TrophyCards() {
  const { t } = useTranslation('trophies')
  const { data: trophies } = useGetTrophies()

  // Get earned trophy types
  const earnedTrophyTypes = new Set(trophies?.map(t => t.trophy_type) ?? [])

  // Filter and sort trophies by order
  const earnedTrophies = TROPHY_ORDER
    .filter(type => earnedTrophyTypes.has(type))
    .map(type => ({
      type,
      image: TROPHY_IMAGES[type],
    }))

  if (earnedTrophies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText type="default" style={styles.emptyText}>
          {t('no-trophies')}
        </ThemedText>
      </View>
    )
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
    >
      {earnedTrophies.map(trophy => (
        <View key={trophy.type} style={styles.trophyCard}>
          <View style={styles.trophyIconContainer}>
            <Image
              source={trophy.image}
              style={styles.trophyIcon}
            />
          </View>

          <ThemedText style={styles.trophyDescription} numberOfLines={6} ellipsizeMode="tail">
            <Trans
              i18nKey={`trophies:${trophy.type}-alert`}
              components={[
                <ThemedText key="0" type="defaultSemiBold" style={styles.trophyDescriptionBold} />,
              ]}
            />
          </ThemedText>
        </View>
      ))}
    </ScrollView>
  )
}

export default TrophyCards

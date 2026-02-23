import { useRouter } from 'expo-router'
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'
import { useTranslation } from 'react-i18next'

import { Pressable, StyleSheet, View } from 'react-native'

import { useGetSubscription } from '@/api/queries/subscriptions'
import ArrowIcon from '@/assets/icons/arrow'
import BlinkistIcon from '@/assets/icons/blinkist'
import BonusBoostIcon from '@/assets/icons/bonus-boost'
import MasterClassIcon from '@/assets/icons/master-class'

import LockIcon from '@/assets/icons/outline-lock'

import { getBonusBoostVideoUrl } from '@/constants/bonus-boost'
import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'
import { isSubscriptionActive } from '@/utils/subscription'

import Accordion from './accordion'
import ThemedText from './themed-text'

interface ExtraCreditProps {
  dailyActivitiesDay: number
}

const styles = StyleSheet.create({
  items: {
    gap: verticalScale(20),
    marginTop: verticalScale(17),
  },
  item: {
    borderRadius: 10,
    padding: scale(11),
    paddingRight: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.8),
  },
  iconContainer: {
    backgroundColor: Colors.light.white,
    height: scale(46),
    width: scale(49),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
  },
  icon: {
    marginLeft: 'auto',
  },
  text: {
    color: Colors.light.primary4,
  },
  headerTitle: {
    color: Colors.light.primary4,
  },
})

function ExtraCredit({ dailyActivitiesDay }: ExtraCreditProps) {
  const { push } = useRouter()
  const { t } = useTranslation('home')

  const { data: subscription } = useGetSubscription()

  const isPremium = isSubscriptionActive(subscription)

  const handleOpenBlinkist = () => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    push({
      pathname: '/blinkist',
      params: {
        day: dailyActivitiesDay,
      },
    })
  }
  const handleOpenMasterClass = () => {
    if (!isPremium) {
      push('/(private)/purchase')
      return
    }

    push({
      pathname: '/master-class',
      params: {
        day: dailyActivitiesDay,
      },
    })
  }
  const handleOpenBonusBoost = () => {
    void openBrowserAsync(getBonusBoostVideoUrl(dailyActivitiesDay), {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      createTask: false,
    })
  }

  return (
    <Accordion
      header={(
        <ThemedText type="subtitle" style={styles.headerTitle}>
          {t('extra-credit')}
        </ThemedText>
      )}
      defaultOpen
    >
      <View style={styles.items}>
        <Pressable style={styles.item} onPress={handleOpenBonusBoost}>
          <View style={styles.iconContainer}>
            <BonusBoostIcon />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.text}>{t('bonus-boost')}</ThemedText>

          {isPremium ? <ArrowIcon color={Colors.light.primary4} style={styles.icon} /> : <LockIcon style={styles.icon} />}
        </Pressable>

        <Pressable style={styles.item} onPress={handleOpenBlinkist}>
          <View style={styles.iconContainer}>
            <BlinkistIcon />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.text}>{t('blinkist')}</ThemedText>

          {isPremium ? <ArrowIcon color={Colors.light.primary4} style={styles.icon} /> : <LockIcon style={styles.icon} />}
        </Pressable>

        <Pressable style={styles.item} onPress={handleOpenMasterClass}>
          <View style={styles.iconContainer}>
            <MasterClassIcon />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.text}>{t('master-classes')}</ThemedText>

          {isPremium ? <ArrowIcon color={Colors.light.primary4} style={styles.icon} /> : <LockIcon style={styles.icon} />}
        </Pressable>
      </View>
    </Accordion>
  )
}

export default ExtraCredit

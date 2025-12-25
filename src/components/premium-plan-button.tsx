import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import { useGetSubscription } from '@/api/queries/subscriptions'

import CrownIcon from '@/assets/icons/crown'
import LockIcon from '@/assets/icons/lock'

import { Colors, withOpacity } from '@/constants/theme'
import { isSubscriptionActive } from '@/utils/subscription'

import ThemedText from './themed-text'

const styles = StyleSheet.create({
  premiumPlanContainer: {
    alignItems: 'center',
    gap: 13,
    marginBottom: 32,
  },
  premiumPlanIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 58,
    height: 58,
    borderRadius: '50%',
    backgroundColor: withOpacity(Colors.light.white, 0.7),
  },
  premiumPlanText: {
    color: Colors.light.primary4,
  },
})

function PremiumPlanButton() {
  const { push } = useRouter()
  const { t } = useTranslation('edit-profile')
  const { data: subscription } = useGetSubscription()

  const isPremium = isSubscriptionActive(subscription)

  const navigateToPremiumPlan = () => {
    push('/(private)/purchase')
  }

  return (
    <Pressable style={styles.premiumPlanContainer} onPress={navigateToPremiumPlan}>
      <View style={styles.premiumPlanIconContainer}>
        {isPremium ? <CrownIcon /> : <LockIcon />}
      </View>

      <ThemedText type="preSubtitle" style={styles.premiumPlanText}>
        {isPremium ? t('premium-plan') : t('unlock-premium-features')}
      </ThemedText>
    </Pressable>
  )
}

export default PremiumPlanButton

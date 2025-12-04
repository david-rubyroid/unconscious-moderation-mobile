import { MaterialIcons } from '@expo/vector-icons'

import { useRouter } from 'expo-router'

import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetCurrentUser } from '@/api/queries/auth'

import { useGetSubscription } from '@/api/queries/subscriptions'

import { Button, ThemedGradient, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(21),
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  welcomeSection: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
  },
  welcomeText: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(8),
  },
  nameText: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(4),
  },
  subtitleText: {
    color: Colors.light.gray1,
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(12),
    fontWeight: '700',
  },
  subscriptionCard: {
    backgroundColor: withOpacity(Colors.light.primary2, 0.2),
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: withOpacity(Colors.light.primary, 0.3),
  },
  subscriptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  statusBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    marginLeft: scale(8),
  },
  statusText: {
    color: Colors.light.white,
    fontSize: scale(12),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subscriptionInfo: {
    marginTop: verticalScale(8),
  },
  subscriptionInfoText: {
    color: Colors.light.gray1,
    marginTop: verticalScale(4),
  },
  quickActions: {
    gap: verticalScale(12),
  },
  actionCard: {
    backgroundColor: withOpacity(Colors.light.white, 0.6),
    borderRadius: scale(12),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: withOpacity(Colors.light.primary, 0.1),
  },
  actionIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: withOpacity(Colors.light.primary, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  actionIconStyle: {
    fontSize: scale(24),
    color: Colors.light.primary,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: Colors.light.primary4,
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  actionDescription: {
    color: Colors.light.gray1,
    fontSize: scale(12),
  },
  buttonContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
})

function HomeScreen() {
  const { push } = useRouter()
  const { t } = useTranslation('home')

  const { data: user } = useGetCurrentUser()
  const { data: subscription } = useGetSubscription()

  const { top, bottom } = useSafeAreaInsets()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
      case 'trial':
        return Colors.light.primary
      case 'expired':
      case 'cancelled':
        return Colors.light.error
      default:
        return Colors.light.gray1
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return t('not-available')
    }
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <ThemedText type="default" style={styles.welcomeText}>
            {t('welcome')}
          </ThemedText>
          <ThemedText type="title" style={styles.nameText}>
            {user?.firstName}
            {' '}
            {user?.lastName}
          </ThemedText>
          <ThemedText type="default" style={styles.subtitleText}>
            {t('subtitle')}
          </ThemedText>
        </View>

        {subscription && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              {t('subscription')}
            </ThemedText>

            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionStatus}>
                <ThemedText type="defaultSemiBold" style={{ color: Colors.light.primary4 }}>
                  {t('status')}
                </ThemedText>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subscription.status) }]}>
                  <ThemedText style={styles.statusText}>
                    {t(`subscription-status.${subscription.status}`) || subscription.status}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.subscriptionInfo}>
                {subscription.expiresAt && (
                  <ThemedText type="small" style={styles.subscriptionInfoText}>
                    {t('expires')}
                    :
                    {' '}
                    {formatDate(subscription.expiresAt)}
                  </ThemedText>
                )}

                {subscription.trialEndsAt && (
                  <ThemedText type="small" style={styles.subscriptionInfoText}>
                    {t('trial-ends')}
                    :
                    {' '}
                    {formatDate(subscription.trialEndsAt)}
                  </ThemedText>
                )}

                {subscription.willRenew && (
                  <ThemedText type="small" style={{ color: Colors.light.primary, marginTop: verticalScale(4) }}>
                    {t('auto-renewal-enabled')}
                  </ThemedText>
                )}
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {t('quick-actions')}
          </ThemedText>

          <View style={styles.quickActions}>
            <Pressable
              style={styles.actionCard}
              onPress={() => {
                push('/medical-report')
              }}
            >
              <View style={styles.actionIcon}>
                <MaterialIcons name="description" style={styles.actionIconStyle} />
              </View>
              <View style={styles.actionContent}>
                <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                  {t('medical-report')}
                </ThemedText>
                <ThemedText type="small" style={styles.actionDescription}>
                  {t('medical-report-description')}
                </ThemedText>
              </View>
              <MaterialIcons name="chevron-right" size={scale(24)} color={Colors.light.gray1} />
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => {
                push('/drink-tracker/mantra')
              }}
            >
              <View style={styles.actionIcon}>
                <MaterialIcons name="checklist" style={styles.actionIconStyle} />
              </View>
              <View style={styles.actionContent}>
                <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                  {t('pre-drink-checklist')}
                </ThemedText>
                <ThemedText type="small" style={styles.actionDescription}>
                  {t('pre-drink-checklist-description')}
                </ThemedText>
              </View>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => {
                push('/purchase')
              }}
            >
              <View style={styles.actionIcon}>
                <MaterialIcons name="card-membership" style={styles.actionIconStyle} />
              </View>
              <View style={styles.actionContent}>
                <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                  {t('subscription-management')}
                </ThemedText>
                <ThemedText type="small" style={styles.actionDescription}>
                  {t('subscription-management-description')}
                </ThemedText>
              </View>
              <MaterialIcons name="chevron-right" size={scale(24)} color={Colors.light.gray1} />
            </Pressable>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            fullWidth
            title={t('upgrade-subscription')}
            onPress={() => {
              push('/purchase')
            }}
          />
        </View>
      </ScrollView>
    </ThemedGradient>
  )
}

export default HomeScreen

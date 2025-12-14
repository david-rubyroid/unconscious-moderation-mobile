import { MaterialIcons } from '@expo/vector-icons'

import { useRouter } from 'expo-router'

import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'

import { useDeleteAccount, useGetCurrentUser, useLogout } from '@/api/queries/auth'

import { useGetSubscription } from '@/api/queries/subscriptions'

import { Button, ScreenContainer, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
  },
  avatarContainer: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: withOpacity(Colors.light.white, 0.8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  avatarIcon: {
    fontSize: scale(50),
    color: Colors.light.primary,
  },
  nameText: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(4),
  },
  emailText: {
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
  infoCard: {
    backgroundColor: withOpacity(Colors.light.white, 0.6),
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: scale(12),
    fontSize: scale(24),
    color: Colors.light.primary,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: Colors.light.gray1,
    fontSize: scale(12),
    marginBottom: verticalScale(4),
  },
  infoValue: {
    color: Colors.light.primary4,
    fontWeight: '600',
  },
  subscriptionCard: {
    backgroundColor: withOpacity(Colors.light.white, 0.9),
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: withOpacity(Colors.light.primary, 0.2),
  },
  subscriptionStatus: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subscriptionIcon: {
    fontSize: scale(24),
    color: Colors.light.primary,
    marginRight: scale(12),
    marginTop: scale(2),
  },
  subscriptionContent: {
    flex: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
    flexWrap: 'wrap',
    gap: scale(8),
  },
  subscriptionTitle: {
    color: Colors.light.primary4,
    marginRight: scale(8),
  },
  statusBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  statusText: {
    color: Colors.light.white,
    fontSize: scale(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subscriptionInfo: {
    color: Colors.light.gray1,
    marginTop: verticalScale(4),
  },
  renewalText: {
    color: Colors.light.primary,
    marginTop: verticalScale(4),
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    gap: verticalScale(12),
  },
  deleteButton: {
    backgroundColor: Colors.light.error,
  },
})

function ProfileScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('profile')

  const { data: user } = useGetCurrentUser()
  const { data: subscription } = useGetSubscription()
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout()
  const { mutateAsync: deleteAccount, isPending: isDeletingAccount } = useDeleteAccount()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
      case 'trial':
      case 'grace_period':
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
      return 'N/A'
    }
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      t('delete-account-title'),
      t('delete-account-message'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount()
              replace('/(auth)/sign-in')
            }
            catch {
              Alert.alert(t('error'), t('delete-account-error'))
            }
          },
        },
      ],
    )
  }

  const isActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trial' || subscription?.status === 'grace_period'

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" style={styles.avatarIcon} />
        </View>
        <ThemedText type="title" style={styles.nameText}>
          {user?.firstName}
          {' '}
          {user?.lastName}
        </ThemedText>
        <ThemedText type="default" style={styles.emailText}>
          {user?.email}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          {t('personal-information')}
        </ThemedText>

        <View style={styles.infoCard}>
          <MaterialIcons name="email" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <ThemedText type="small" style={styles.infoLabel}>
              {t('email')}
            </ThemedText>
            <ThemedText type="default" style={styles.infoValue}>
              {user?.email || t('not-available')}
            </ThemedText>
          </View>
        </View>

        {user?.age && (
          <View style={styles.infoCard}>
            <MaterialIcons name="cake" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <ThemedText type="small" style={styles.infoLabel}>
                {t('age')}
              </ThemedText>
              <ThemedText type="default" style={styles.infoValue}>
                {user.age}
              </ThemedText>
            </View>
          </View>
        )}

        {user?.gender && (
          <View style={styles.infoCard}>
            <MaterialIcons name="person-outline" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <ThemedText type="small" style={styles.infoLabel}>
                {t('gender')}
              </ThemedText>
              <ThemedText type="default" style={styles.infoValue}>
                {user.gender}
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      {subscription && (
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {t('subscription')}
          </ThemedText>

          <View style={[
            styles.subscriptionCard,
            isActiveSubscription && {
              borderColor: Colors.light.primary,
              backgroundColor: withOpacity(Colors.light.primary2, 0.15),
            },
          ]}
          >
            <View style={styles.subscriptionStatus}>
              <MaterialIcons name="card-membership" style={styles.subscriptionIcon} />
              <View style={styles.subscriptionContent}>
                <View style={styles.subscriptionHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.subscriptionTitle}>
                    {t('subscription')}
                  </ThemedText>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subscription.status) }]}>
                    <ThemedText style={styles.statusText}>
                      {t(`subscription-status.${subscription.status}`) || subscription.status}
                    </ThemedText>
                  </View>
                </View>

                {subscription.expiresAt && (
                  <ThemedText type="small" style={styles.subscriptionInfo}>
                    {t('expires')}
                    :
                    {formatDate(subscription.expiresAt)}
                  </ThemedText>
                )}

                {subscription.trialEndsAt && (
                  <ThemedText type="small" style={styles.subscriptionInfo}>
                    {t('trial-ends')}
                    :
                    {formatDate(subscription.trialEndsAt)}
                  </ThemedText>
                )}

                {subscription.willRenew && (
                  <ThemedText type="small" style={styles.renewalText}>
                    {t('auto-renewal-enabled')}
                  </ThemedText>
                )}
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          loading={isLoggingOut}
          fullWidth
          title={t('logout')}
          onPress={() => {
            logout().then(() => {
              replace('/(auth)/sign-in')
            })
          }}
        />
        <Button
          fullWidth
          loading={isDeletingAccount}
          disabled={isDeletingAccount}
          title={t('delete-account')}
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        />
      </View>
    </ScreenContainer>
  )
}

export default ProfileScreen

import { MaterialIcons } from '@expo/vector-icons'

import { useRouter } from 'expo-router'

import { useTranslation } from 'react-i18next'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useDeleteAccount, useGetCurrentUser, useLogout } from '@/api/queries/auth'

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

  return (
    <ThemedGradient style={[{ paddingTop: top, paddingBottom: bottom }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

              {subscription.expiresAt && (
                <View style={{ marginTop: verticalScale(8) }}>
                  <ThemedText type="small" style={{ color: Colors.light.gray1 }}>
                    {t('expires')}
                    :
                    {' '}
                    {formatDate(subscription.expiresAt)}
                  </ThemedText>
                </View>
              )}

              {subscription.trialEndsAt && (
                <View style={{ marginTop: verticalScale(4) }}>
                  <ThemedText type="small" style={{ color: Colors.light.gray1 }}>
                    {t('trial-ends')}
                    :
                    {' '}
                    {formatDate(subscription.trialEndsAt)}
                  </ThemedText>
                </View>
              )}

              {subscription.willRenew && (
                <View style={{ marginTop: verticalScale(4) }}>
                  <ThemedText type="small" style={{ color: Colors.light.primary }}>
                    {t('auto-renewal-enabled')}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            loading={isLoggingOut}
            title={t('logout')}
            onPress={() => {
              logout().then(() => {
                replace('/(auth)/sign-in')
              })
            }}
          />
          <Button
            loading={isDeletingAccount}
            disabled={isDeletingAccount}
            title={t('delete-account')}
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          />
        </View>
      </ScrollView>
    </ThemedGradient>
  )
}

export default ProfileScreen

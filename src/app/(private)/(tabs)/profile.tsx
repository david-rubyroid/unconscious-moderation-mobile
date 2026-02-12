import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'
import { useTranslation } from 'react-i18next'

import { Alert, Pressable, StyleSheet, View } from 'react-native'

import { useDeleteAccount, useGetCurrentUser, useLogout } from '@/api/queries/auth'

import AlertIcon from '@/assets/icons/alert'
import ShieldIcon from '@/assets/icons/shield'
import {
  AwarenessSection,
  Header,
  PremiumPlanButton,
  ProfileCard,
  ScreenContainer,
  SobrietyTimer,
  ThemedText,
  TrophyCards,
} from '@/components'
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
  currentStreakContainer: {
    gap: verticalScale(14),
    borderRadius: scale(8),
    paddingVertical: scale(21),
    paddingHorizontal: scale(28),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    marginBottom: verticalScale(20),
  },
  currentStreakText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  myTLineTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(20),
  },
  awarenessSection: {
    padding: scale(16),
    borderRadius: scale(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(25),
    marginBottom: verticalScale(20),
  },
  settingsTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(20),
  },
  settingsContainer: {
    gap: scale(10),
  },
  settingsItem: {
    gap: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    borderRadius: scale(8),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  settingsItemIcon: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(10),
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsItemText: {
    fontWeight: 400,
  },
  settingsItemTextDanger: {
    color: Colors.light.error,
  },
  trophiesTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(20),
  },
})

function ProfileScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('profile')

  const { data: user } = useGetCurrentUser()
  const { mutateAsync: logout } = useLogout()
  const { mutateAsync: deleteAccount } = useDeleteAccount()

  const handleLogout = () => {
    Alert.alert(
      t('logout-title'),
      t('logout-message'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout()
              replace('/(auth)/sign-in')
            }
            catch {
              Alert.alert(t('error'), t('logout-error'))
            }
          },
        },
      ],
    )
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
  const handlePrivacyPolicy = () => {
    openBrowserAsync('https://um.app/privacy-policy/', {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    })
  }
  const handleTermsOfService = () => {
    openBrowserAsync('https://um.app/terms-and-conditions/', {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    })
  }
  const gifts = user?.gifts
  const fears = user?.fears

  return (
    <ScreenContainer gradientColors={Colors.light.profileScreenGradient}>
      <Header title={t('title')} />

      <PremiumPlanButton />

      <ProfileCard />

      <View style={styles.currentStreakContainer}>
        <ThemedText type="defaultSemiBold" style={styles.currentStreakText}>
          {t('current-streak')}
        </ThemedText>

        <SobrietyTimer size="large" />
      </View>

      <ThemedText type="preSubtitle" style={styles.trophiesTitle}>
        {t('your-achievements')}
      </ThemedText>

      <TrophyCards />

      <ThemedText type="preSubtitle" style={styles.myTLineTitle}>
        {t('my-t-line')}
      </ThemedText>

      {((gifts && gifts.length > 0) || (fears && fears.length > 0))
        ? (
            <View style={styles.awarenessSection}>
              <AwarenessSection
                title={t('gifts')}
                items={gifts}
                translationNamespace="questions"
              />
              <AwarenessSection
                title={t('fears')}
                items={fears}
                translationNamespace="questions"
              />
            </View>
          )
        : null}

      <ThemedText type="preSubtitle" style={styles.trophiesTitle}>
        {t('Settings')}
      </ThemedText>

      <View style={styles.settingsContainer}>
        <Pressable style={styles.settingsItem} onPress={handlePrivacyPolicy}>
          <View style={styles.settingsItemIcon}>
            <ShieldIcon />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.settingsItemText}>
            {t('privacy-policy')}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.settingsItem} onPress={handleTermsOfService}>
          <View style={styles.settingsItemIcon}>
            <AlertIcon width={25} height={25} color={Colors.light.primary} />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.settingsItemText}>
            {t('terms-of-service')}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.settingsItem} onPress={handleLogout}>
          <View style={styles.settingsItemIcon}>
            <MaterialIcons name="logout" size={25} color={Colors.light.primary} />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.settingsItemText}>
            {t('logout')}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.settingsItem} onPress={handleDeleteAccount}>
          <View style={styles.settingsItemIcon}>
            <MaterialIcons name="delete" size={25} color={Colors.light.error} />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.settingsItemTextDanger}>
            {t('delete-account')}
          </ThemedText>
        </Pressable>
      </View>
    </ScreenContainer>
  )
}

export default ProfileScreen

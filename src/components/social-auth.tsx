import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import GoogleColored from '@/assets/icons/google-colored'

import { Colors, withOpacity } from '@/constants/theme'

import useAppleAuthentication from '@/hooks/use-apple-authentication'
import useFacebookAuthentication from '@/hooks/use-facebook-authentication'
import useGoogleAuthentication from '@/hooks/use-google-authentication'

import { moderateScale, scale } from '@/utils/responsive'

const styles = StyleSheet.create({
  socialAuth: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(20),
  },
  socialAuthButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(8),
    borderWidth: 1,
  },
  default: {
    width: scale(48),
    height: scale(48),
    backgroundColor: Colors.light.white,
    borderColor: withOpacity(Colors.light.black, 0.15),
  },
  intro: {
    width: scale(34),
    height: scale(34),
    backgroundColor: withOpacity(Colors.light.white, 0.8),
    borderColor: Colors.light.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: withOpacity(Colors.light.black, 0.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: Colors.light.tertiaryBackground,
    borderRadius: moderateScale(16),
    padding: scale(32),
    alignItems: 'center',
    minWidth: scale(240),
    shadowColor: Colors.light.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    marginTop: scale(16),
    fontSize: moderateScale(16),
    color: Colors.light.text,
    fontWeight: '600',
  },
})

interface SocialAuthProps {
  variant?: 'default' | 'intro'
}

function SocialAuth({ variant = 'default' }: SocialAuthProps) {
  const { signInWithApple, appleLoginPending } = useAppleAuthentication()
  const { signInWithGoogle, googleLoginPending } = useGoogleAuthentication()
  const { signInWithFacebook, facebookLoginPending } = useFacebookAuthentication()

  const iconSize = scale(18)
  const isLoading = appleLoginPending || googleLoginPending || facebookLoginPending
  const loadingProvider = appleLoginPending ? 'Apple' : googleLoginPending ? 'Google' : facebookLoginPending ? 'Facebook' : null

  return (
    <>
      <View style={styles.socialAuth}>
        {Platform.OS === 'ios' && (
          <Pressable style={[styles.socialAuthButton, styles[variant]]} onPress={signInWithApple} disabled={appleLoginPending}>
            <FontAwesome name="apple" size={iconSize} color={variant === 'default' ? '' : 'rgba(46, 125, 96, 1)'} />
          </Pressable>
        )}

        <Pressable
          style={[styles.socialAuthButton, styles[variant]]}
          onPress={signInWithGoogle}
          disabled={googleLoginPending}
        >
          {variant === 'default' ? <GoogleColored /> : <AntDesign name="google" size={iconSize} color="rgba(46, 125, 96, 1)" />}
        </Pressable>

        <Pressable
          style={[styles.socialAuthButton, styles[variant]]}
          onPress={signInWithFacebook}
          disabled={facebookLoginPending}
        >
          <FontAwesome name="facebook" size={iconSize} color={variant === 'default' ? '#1877F2' : 'rgba(46, 125, 96, 1)'} />
        </Pressable>
      </View>

      <Modal
        visible={isLoading}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            {loadingProvider && (
              <Text style={styles.loadingText}>
                Sign in with
                {' '}
                {loadingProvider}
                ...
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}

export default SocialAuth

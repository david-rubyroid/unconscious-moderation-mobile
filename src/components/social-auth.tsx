import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import GoogleColored from '@/assets/icons/google-colored'

import { Colors, withOpacity } from '@/constants/theme'

import useAppleAuthentication from '@/hooks/use-apple-authentication'
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
})

interface SocialAuthProps {
  variant?: 'default' | 'intro'
}

function SocialAuth({ variant = 'default' }: SocialAuthProps) {
  const { signInWithApple, appleLoginPending } = useAppleAuthentication()
  const { signInWithGoogle, googleLoginPending } = useGoogleAuthentication()

  const iconSize = scale(18)

  return (
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

      {/*
      // TODO: Add Facebook login feature not necessary for now
      <Pressable style={[styles.socialAuthButton, styles[variant]]} onPress={() => {}}>
        <FontAwesome name="facebook" size={18} color={variant === 'default' ? '#1877F2' : 'rgba(46, 125, 96, 1)'} />
      </Pressable> */}
    </View>
  )
}

export default SocialAuth

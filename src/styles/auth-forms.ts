import { StyleSheet } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

/**
 * Common styles for authentication forms
 */
export const authFormStyles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(18),
    backgroundColor: Colors.light.mainBackground,
  },
  titleContainer: {
    gap: scale(8),
    marginBottom: verticalScale(30),
  },
  subtitle: {
    color: Colors.light.primary4,
    fontWeight: '700',
  },
  description: {
    color: withOpacity(Colors.light.black, 0.45),
    fontWeight: '700',
  },
  alreadyHaveAccountContainer: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
  },
  alreadyHaveAccount: {
    color: withOpacity(Colors.light.black, 0.45),
    fontWeight: '700',
  },
  logIn: {
    textDecorationLine: 'underline',
  },
  divider: {
    marginVertical: verticalScale(25),
  },
  dividerLine: {
    backgroundColor: withOpacity(Colors.light.black, 0.45),
  },
  dividerText: {
    color: withOpacity(Colors.light.black, 0.30),
  },
  form: {
    gap: verticalScale(25),
  },
  input: {
    color: withOpacity(Colors.light.black, 0.85),
    borderColor: withOpacity(Colors.light.black, 0.15),
    backgroundColor: Colors.light.white,
  },
  termsContainer: {
    textAlign: 'center',
    marginTop: 'auto',
  },
  forgotPassword: {
    color: Colors.light.primary4,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
})

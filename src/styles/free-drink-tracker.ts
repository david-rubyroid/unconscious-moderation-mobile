import { StyleSheet } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

/**
 * Common styles for free-drink-tracker screens
 */
export const freeDrinkTrackerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  titleContainer: {
    position: 'relative',
    marginBottom: verticalScale(32),
  },
  alertIcon: {
    position: 'absolute',
    top: -5,
    right: -20,
  },
  description: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(32),
  },
  descriptionContainer: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(30),
    borderRadius: scale(10),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    marginBottom: verticalScale(20),
  },
  whenWasYourLastDrinkContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: verticalScale(16),
  },
  whenWasYourLastDrink: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(8),
  },
  formContainer: {
    width: '100%',
    gap: verticalScale(16),
    marginBottom: verticalScale(32),
  },
  timeInput: {
    width: '100%',
    height: 40,
    borderWidth: 0,
    borderColor: Colors.light.primary4,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  button: {
    marginBottom: verticalScale(32),
  },
  footerText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  activeStreakContainer: {
    backgroundColor: withOpacity(Colors.light.primary, 0.1),
    padding: verticalScale(16),
    borderRadius: 8,
    marginBottom: verticalScale(16),
    width: '100%',
  },
  activeStreakText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupAlertIcon: {
    alignSelf: 'center',
    marginBottom: verticalScale(28),
  },
  popupDescription: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: 400,
    marginBottom: verticalScale(28),
  },
  popupDescriptionBold: {
    color: Colors.light.primary4,
  },
  popupButton: {
    alignSelf: 'center',
  },
})

import { StyleSheet } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

export const styles = StyleSheet.create({
  loggedDrinksContainer: {
    gap: scale(10),
    marginBottom: verticalScale(27),
  },
  loggedDrinksTitle: {
    color: Colors.light.primary4,
    fontWeight: 600,
  },
  loggedDrinksList: {
    flexGrow: 0,
  },
  loggedDrinksListContent: {
    flexDirection: 'row',
    gap: scale(12),
  },
  loggedDrinkItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 100,
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    borderRadius: scale(6),
  },
  drinkPhotoFull: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(6),
    overflow: 'hidden',
  },
  drinkPhotoImageStyle: {
    borderRadius: scale(6),
  },
  drinkPhotoContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  loggedDrinkItemText: {
    fontSize: scale(12),
    color: Colors.light.primary4,
  },
  loggedDrinkItemTextWhite: {
    fontSize: scale(12),
    color: Colors.light.white,
  },
  emptyStateItem: {
    width: 80,
    height: 100,
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    borderRadius: scale(6),
  },
  weekDaysContainer: {
    width: '100%',
    marginBottom: verticalScale(27),
  },
  remember: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(27),
  },
  countersContainer: {
    flexDirection: 'row',
    gap: scale(13),
    marginBottom: verticalScale(27),
  },
  counter: {
    flex: 1,
    alignItems: 'flex-start',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(12),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    gap: scale(9),
    borderRadius: scale(6),
  },
  counterText: {
    fontWeight: 400,
    color: withOpacity(Colors.light.black, 0.5),
  },
  counterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
  },
  counterValue: {
    fontSize: scale(32),
    fontWeight: '700',
    lineHeight: scale(38),
    color: Colors.light.primary4,
  },
  extraCounterValue: {
    color: Colors.light.error2,
  },
  counterIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    paddingHorizontal: scale(14),
    paddingVertical: scale(10),
    borderRadius: '50%',
  },
  counterButton: {
    height: 27,
    borderRadius: 36,
    width: '100%',
  },
  proTipContainer: {
    alignSelf: 'center',
    width: 327,
    alignItems: 'center',
    borderRadius: scale(12),
    overflow: 'hidden',
    paddingVertical: verticalScale(11),
    paddingHorizontal: scale(30),
    marginBottom: verticalScale(27),
  },
  proTipOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.8),
  },
  proTipTitle: {
    textAlign: 'center',
    color: Colors.light.white,
  },
  proTipDescription: {
    textAlign: 'center',
    color: Colors.light.white,
    fontWeight: '400',
  },
  proTipDescriptionBold: {
    fontWeight: '700',
    color: Colors.light.white,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: scale(10),
    marginBottom: verticalScale(27),
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(7),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    gap: scale(8),
    borderRadius: scale(6),
  },
  infoItemTitle: {
    fontSize: scale(11),
    color: withOpacity(Colors.light.black, 0.5),
  },
  infoItemDescription: {
    color: Colors.light.black,
    fontWeight: '400',
  },
  infoItemContent: {
    flex: 1,
  },
  buttonsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(21),
    marginBottom: verticalScale(27),
  },
  button: {
    width: '45%',
  },
  manageUrgesButton: {
    backgroundColor: Colors.light.error2,
  },
  finishDrinkingButton: {
    alignSelf: 'center',
  },
  modalContent: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  modalText: {
    fontWeight: 400,
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  modalTextBold: {
    color: Colors.light.primary4,
  },
  modalButton: {
    marginTop: verticalScale(20),
    alignSelf: 'center',
  },
})

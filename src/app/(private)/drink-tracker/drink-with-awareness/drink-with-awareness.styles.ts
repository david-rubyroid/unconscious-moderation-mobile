import { StyleSheet } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const loggedDrinks = StyleSheet.create({
  container: {
    gap: scale(10),
  },
  title: {
    color: Colors.light.primary4,
    fontWeight: 600,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    flexDirection: 'row',
    gap: scale(12),
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 100,
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    borderRadius: scale(6),
  },
  photoFull: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(6),
    overflow: 'hidden',
  },
  photoImageStyle: {
    borderRadius: scale(6),
  },
  photoContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  itemText: {
    fontSize: scale(12),
    color: Colors.light.primary4,
  },
  itemTextWhite: {
    fontSize: scale(12),
    color: Colors.light.white,
  },
  emptyItem: {
    width: 80,
    height: 100,
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    borderRadius: scale(6),
  },
})

const counter = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'flex-start',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(12),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    gap: scale(9),
    borderRadius: scale(6),
  },
  text: {
    fontWeight: 400,
    color: withOpacity(Colors.light.black, 0.5),
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
  },
  value: {
    fontSize: scale(32),
    fontWeight: '700',
    lineHeight: scale(38),
    color: Colors.light.primary4,
  },
  extraValue: {
    color: Colors.light.error2,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    paddingHorizontal: scale(14),
    paddingVertical: scale(10),
    borderRadius: '50%',
  },
  button: {
    height: 27,
    borderRadius: 36,
    width: '100%',
  },
  waterButtonsContainer: {
    flexDirection: 'row',
    gap: scale(10),
  },
  waterButton: {
    flex: 1,
    height: 27,
    borderRadius: 36,
  },
  counterButtonsContainer: {
    flexDirection: 'row',
    gap: scale(15),
  },
})

const proTip = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: 303,
    alignItems: 'center',
    borderRadius: scale(12),
    overflow: 'hidden',
    paddingVertical: verticalScale(11),
    paddingHorizontal: scale(15),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.8),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.white,
  },
  description: {
    textAlign: 'center',
    color: Colors.light.white,
    fontWeight: '400',
  },
  descriptionBold: {
    fontWeight: '700',
    color: Colors.light.white,
  },
})

const sessionInfo = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: scale(10),
  },
  item: {
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
  itemTitle: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  itemDescription: {
    color: Colors.light.black,
    fontWeight: '400',
  },
  itemContent: {
    flex: 1,
  },
})

const screen = StyleSheet.create({
  screenContentContainer: {
    gap: verticalScale(20),
  },
  hypnosisCheckInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    paddingVertical: verticalScale(10),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(8),
  },
  hypnosisCheckInIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: withOpacity(Colors.light.primary4, 0.1),
  },
  hypnosisCheckInText: {
    fontWeight: 400,
    color: Colors.light.primary4,
  },
  remember: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  countersContainer: {
    flexDirection: 'row',
    gap: scale(13),
  },
  buttonsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(21),
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
  modalWarningIconContainer: {
    alignItems: 'center',
    gap: scale(5),
  },
  modalWarningTitle: {
    textAlign: 'center',
    color: Colors.light.error2,
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
    alignSelf: 'center',
  },
  waterLogSuccessContent: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  waterLogSuccessIconCircle: {
    width: scale(90),
    height: scale(90),
    borderRadius: '50%',
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterLogSuccessTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  waterLogSuccessDescription: {
    fontWeight: 400,
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  medalContainer: {
    position: 'relative',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ scale: 8 }],
  },
})

export const styles = {
  loggedDrinks,
  counter,
  proTip,
  sessionInfo,
  screen,
}

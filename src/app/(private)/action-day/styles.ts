import { StyleSheet } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

export const actionDayStyles = StyleSheet.create({
  contentContainer: {
    gap: verticalScale(20),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  imageBackground: {
    width: '100%',
    height: 189,
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.5),
  },
  description: {
    fontWeight: 400,
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  descriptionBold: {
    color: Colors.light.primary4,
  },
  howToDoItContainer: {
    padding: 18,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(20),
    gap: verticalScale(10),
  },
  howToDoItDescriptionTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  bulletListText: {
    flex: 1,
  },
  howToDoItDescription: {
    fontWeight: 400,
    color: Colors.light.primary4,
  },
  bloodPressureTableTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  day2BloodPressureValue: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  tableContainer: {
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(10),
    borderWidth: 0.5,
    borderColor: withOpacity(Colors.light.black, 0.5),
    overflow: 'hidden',
  },
  tableHeader: {
    paddingVertical: verticalScale(14),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    borderColor: withOpacity(Colors.light.black, 0.5),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  tableHeaderText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    borderBottomWidth: 0.5,
    borderColor: withOpacity(Colors.light.black, 0.5),
    alignItems: 'flex-start',
    gap: scale(8),
  },
  tableRowFirst: {
    borderTopWidth: 0.5,
  },
  tableRowLast: {
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    borderBottomWidth: 0,
  },
  tableCellReading: {
    width: scale(115),
    paddingTop: 12,
    color: Colors.light.primary4,
  },
  tableCellRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(7),
    borderLeftWidth: 0.5,
    borderColor: withOpacity(Colors.light.black, 0.5),
    padding: 12,
  },
  tableCellIcon: {
    marginTop: 2,
  },
  tableCellTextBlock: {
    flex: 1,
  },
  tableCellTitle: {
    color: Colors.light.primary4,
  },
  tableCellDescription: {
    color: Colors.light.primary4,
  },
  button: {
    alignSelf: 'center',
  },
  formContainer: {
    alignItems: 'flex-start',
    gap: verticalScale(10),
  },
  pressureInput: {
    borderColor: withOpacity(Colors.light.black, 0.1),
  },
  pressureInputsContainer: {
    gap: 10,
    alignItems: 'center',
  },
  pressureInputSeparator: {
    fontWeight: 400,
    color: withOpacity(Colors.light.black, 0.5),
  },
  day2BloodPressureContainer: {
    alignItems: 'flex-start',
  },
})

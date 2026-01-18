import { StyleSheet } from 'react-native'

import { Colors, getResponsiveFontSize, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

export const styles = StyleSheet.create({
  container: {
    gap: verticalScale(20),
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthName: {
    fontWeight: 400,
    textTransform: 'uppercase',
    color: Colors.light.primary4,
  },
  moreButton: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  moreButtonText: {
    fontWeight: 400,
    color: Colors.light.primary4,
  },
  moreButtonTextDisabled: {
    opacity: 0.3,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayName: {
    color: Colors.light.primary,
    width: '14.28%',
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    borderRadius: scale(5),
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  emptyDay: {
    width: '14.28%',
    height: 39,
    borderColor: Colors.light.primary,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  dayCell: {
    position: 'relative',
    width: '14.28%',
    height: 39,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  cornerTopLeft: {
    borderTopLeftRadius: scale(5),
  },
  cornerTopRight: {
    borderTopRightRadius: scale(5),
  },
  cornerBottomLeft: {
    borderBottomLeftRadius: scale(5),
  },
  cornerBottomRight: {
    borderBottomRightRadius: scale(5),
  },
  dayNumber: {
    position: 'absolute',
    top: 0,
    right: 4,
    color: Colors.light.primary,
    fontSize: getResponsiveFontSize(8),
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

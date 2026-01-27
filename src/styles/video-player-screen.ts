import { StyleSheet } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

/**
 * Common styles for video player screens
 */
export const videoPlayerScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.black,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: verticalScale(120),
    backgroundColor: Colors.light.black,
    zIndex: 20,
    elevation: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: scale(16),
    paddingBottom: scale(12),
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: withOpacity(Colors.light.black, 0.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.black, 0.5),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
})

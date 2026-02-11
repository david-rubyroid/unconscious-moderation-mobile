import { StyleSheet } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

export const connectionDayStyles = StyleSheet.create({
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
  button: {
    alignSelf: 'center',
  },
})

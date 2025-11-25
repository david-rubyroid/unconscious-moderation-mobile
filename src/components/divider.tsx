import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'

import { Colors } from '@/constants/theme'

const styles = StyleSheet.create({
  text: {
    color: Colors.light.white,
    fontSize: 12,
    lineHeight: 20,
    fontWeight: 600,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.white,
  },
})

interface DividerProps {
  text: string
  viewStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  lineStyle?: StyleProp<ViewStyle>
}

function Divider({ text, viewStyle, textStyle, lineStyle }: DividerProps) {
  return (
    <View style={[styles.divider, viewStyle]}>
      <View style={[styles.dividerLine, lineStyle]} />

      <Text style={[styles.text, textStyle]}>{text}</Text>

      <View style={[styles.dividerLine, lineStyle]} />
    </View>
  )
}

export default Divider

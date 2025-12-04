import type { PressableProps, ViewStyle } from 'react-native'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { Colors } from '@/constants/theme'

import { scale } from '@/utils/responsive'

import ThemedText from './themed-text'

interface CheckboxProps extends Omit<PressableProps, 'style'> {
  label: string
  checked: boolean
  onToggle: (_checked: boolean) => void
  style?: ViewStyle
  containerStyle?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  checkbox: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  label: {
    color: Colors.light.gray3,
  },
})

function Checkbox({
  label,
  checked,
  onToggle,
  style,
  containerStyle,
  ...props
}: CheckboxProps) {
  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={() => onToggle(!checked)}
      {...props}
    >
      <View style={[styles.checkbox, style]}>
        {checked && (
          <Svg
            width={scale(15)}
            height={scale(15)}
            viewBox="0 0 15 15"
            fill="none"
          >
            <Path
              d="M12.5 3.5L5.5 12.5L2.5 9.5"
              stroke={Colors.light.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>

      <ThemedText type="default" style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  )
}

export default Checkbox

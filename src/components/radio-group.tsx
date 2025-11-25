import type { ViewProps } from 'react-native'
import { Pressable, StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'
import { moderateScale, scale } from '@/utils/responsive'

import ThemedText from './themed-text'

export interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps extends ViewProps {
  options: RadioOption[]
  value: string | null
  onValueChange: (_value: string) => void
}

const styles = StyleSheet.create({
  container: {
    gap: scale(12),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    borderRadius: moderateScale(10),
    backgroundColor: Colors.light.tertiaryBackground,
    gap: scale(8),
  },
  pressed: {
    opacity: 0.7,
  },
  radioButton: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    borderWidth: 1.5,
    borderColor: Colors.light.gray2,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.light.primary2,
  },
  radioButtonInner: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: Colors.light.primary2,
  },
  label: {
    color: Colors.light.primary4,
    fontSize: 14, // Используется ThemedText с адаптивным размером
    flex: 1,
  },
})

function RadioGroup({ options, value, onValueChange, style, ...props }: RadioGroupProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.option,
              pressed && styles.pressed,
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
              {isSelected && <View style={styles.radioButtonInner} />}
            </View>

            <ThemedText style={styles.label} type="default">
              {option.label}
            </ThemedText>
          </Pressable>
        )
      })}
    </View>
  )
}

export default RadioGroup

import type { StyleProp } from 'react-native'

import { memo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'

import Check from '@/assets/icons/check'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import BottomSheetPopup from './bottom-sheet-popup'
import TextInput from './text-input'
import ThemedText from './themed-text'

interface SelectOption {
  label: string
  value: string
}

interface SelectInputProps {
  options: SelectOption[]
  value: string
  onChange: (_value: string) => void
  label?: string
  style?: StyleProp<any>
  placeholder?: string
  placeholderTextColor?: string
  gradientColors?: readonly [string, string, ...string[]]
  error?: string
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  label: {
    color: Colors.light.primary4,
    fontSize: 14,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorInput: {
    color: Colors.light.error,
    borderColor: Colors.light.error,
  },
  errorMessage: {
    color: Colors.light.error,
    fontSize: 11,
  },
  optionsList: {
    paddingVertical: verticalScale(8),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: withOpacity(Colors.light.black, 0.08),
    minHeight: verticalScale(56),
  },
  optionItemPressed: {
    backgroundColor: withOpacity(Colors.light.primary, 0.05),
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: scale(16),
    color: Colors.light.text,
  },
  optionTextSelected: {
    color: Colors.light.primary4,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: scale(12),
  },
  lastOption: {
    borderBottomWidth: 0,
  },
})

const ITEM_HEIGHT = verticalScale(56) + 1

const DEFAULT_GRADIENT_COLORS: readonly [string, string] = [
  Colors.light.tertiaryBackground,
  Colors.light.tertiaryBackground,
]

interface SelectOptionItemProps {
  item: SelectOption
  isSelected: boolean
  isLast: boolean
  onSelect: (_option: SelectOption) => void
}

const SelectOptionItem = memo(
  ({ item, isSelected, isLast, onSelect }: SelectOptionItemProps) => (
    <Pressable
      style={[styles.optionItem, isLast && styles.lastOption]}
      onPress={() => onSelect(item)}
    >
      <View style={styles.optionContent}>
        <ThemedText
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {item.label}
        </ThemedText>
      </View>
      {isSelected && (
        <View style={styles.checkIcon}>
          <Check />
        </View>
      )}
    </Pressable>
  ),
  (prevProps, nextProps) =>
    prevProps.item.value === nextProps.item.value
    && prevProps.isSelected === nextProps.isSelected
    && prevProps.isLast === nextProps.isLast,
)

function SelectInput({
  options,
  value,
  onChange,
  label,
  style,
  placeholder,
  placeholderTextColor,
  gradientColors = DEFAULT_GRADIENT_COLORS,
  error,
}: SelectInputProps) {
  const [showPicker, setShowPicker] = useState(false)

  const selectedOption = options.find(option => option.value === value)
  const displayValue = selectedOption ? selectedOption.label : ''

  const handleSelect = (option: SelectOption) => {
    onChange(option.value)
    setShowPicker(false)
  }

  return (
    <View style={styles.container}>
      {label && <ThemedText type="defaultSemiBold" style={styles.label}>{label}</ThemedText>}

      <Pressable
        onPress={() => setShowPicker(true)}
        style={styles.inputContainer}
      >
        <TextInput
          style={[
            style,
            error && styles.errorInput,
          ]}
          value={displayValue}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          editable={false}
          pointerEvents="none"
        />
      </Pressable>

      <BottomSheetPopup
        gradientColors={gradientColors}
        visible={showPicker}
        onClose={() => setShowPicker(false)}
      >
        <FlatList
          data={options}
          keyExtractor={item => item.value}
          extraData={value}
          getItemLayout={(_data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          initialNumToRender={10}
          contentContainerStyle={styles.optionsList}
          renderItem={({ item, index }) => (
            <SelectOptionItem
              item={item}
              isSelected={item.value === value}
              isLast={index === options.length - 1}
              onSelect={handleSelect}
            />
          )}
        />
      </BottomSheetPopup>

      {error && (
        <ThemedText style={styles.errorMessage}>
          {error}
        </ThemedText>
      )}
    </View>
  )
}

export default SelectInput

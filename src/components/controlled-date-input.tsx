import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import DateTimePicker from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'

import { Controller } from 'react-hook-form'
import { Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { Colors } from '@/constants/theme'

import TextInput from './text-input'
import ThemedText from './themed-text'

interface ControlledDateInputProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  mode?: 'date' | 'time' | 'datetime'
  style?: any
  placeholder?: string
  placeholderTextColor?: string
  minimumDate?: Date
  maximumDate?: Date
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  iosPickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    width: '100%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerHeaderButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  pickerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  datePickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  singlePickerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pickerDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    height: '80%',
    marginVertical: 10,
  },
})

function formatDateTime(date: Date, mode: 'date' | 'time' | 'datetime' = 'datetime'): string {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return ''
  }

  if (mode === 'date') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (mode === 'time') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // datetime
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ControlledDateInput<T extends FieldValues>({
  name,
  style,
  control,
  label,
  mode = 'datetime',
  placeholder,
  placeholderTextColor,
  minimumDate,
  maximumDate,
}: ControlledDateInputProps<T>) {
  const [showPicker, setShowPicker] = useState(false)
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date')
  // iOS: Store temporary date selection to avoid calling onChange on every picker change
  const [iosTempDate, setIosTempDate] = useState<Date | null>(null)

  const translateY = useSharedValue(1000)
  const overlayOpacity = useSharedValue(0)

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (showPicker) {
        translateY.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        })
        overlayOpacity.value = withTiming(1, {
          duration: 300,
        })
      }
      else {
        translateY.value = withTiming(1000, {
          duration: 250,
          easing: Easing.in(Easing.ease),
        })
        overlayOpacity.value = withTiming(0, {
          duration: 250,
          easing: Easing.in(Easing.ease),
        })
      }
    }
  }, [showPicker, translateY, overlayOpacity])

  const animatedPickerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }))

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Use temporary date for iOS picker, or fall back to value
        const pickerDate = Platform.OS === 'ios' && iosTempDate !== null
          ? iosTempDate
          : (value && typeof value === 'object' && 'getTime' in value
              ? new Date(value)
              : new Date())
        const currentDate = pickerDate

        const displayValue = value && typeof value === 'object' && 'getTime' in value
          ? formatDateTime(value, mode)
          : ''

        const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
          if (Platform.OS === 'android') {
            setShowPicker(false)
            if (event.type === 'set' && selectedDate) {
              if (mode === 'datetime') {
                const newDate = new Date(selectedDate)
                const existingDate = value && typeof value === 'object' && 'getTime' in value
                  ? new Date(value)
                  : new Date()

                if (pickerMode === 'date') {
                  newDate.setHours(existingDate.getHours())
                  newDate.setMinutes(existingDate.getMinutes())
                  onChange(newDate)
                  setPickerMode('time')
                  setShowPicker(true)
                }
                else {
                  existingDate.setHours(newDate.getHours())
                  existingDate.setMinutes(newDate.getMinutes())
                  onChange(existingDate)
                }
              }
              else {
                onChange(selectedDate)
              }
            }
          }
          else {
            // iOS
            if (event.type === 'set' && selectedDate) {
              onChange(selectedDate)
            }
            else if (event.type === 'dismissed') {
              setShowPicker(false)
            }
          }
        }

        const handlePress = () => {
          if (mode === 'datetime' && Platform.OS === 'android') {
            setPickerMode('date')
          }
          // Initialize iOS temp date with current value when opening picker
          if (Platform.OS === 'ios') {
            const initialDate = value && typeof value === 'object' && 'getTime' in value
              ? new Date(value)
              : new Date()
            setIosTempDate(initialDate)
          }
          setShowPicker(true)
        }

        const renderPicker = () => {
          if (!showPicker && Platform.OS === 'ios') {
            return null
          }

          if (Platform.OS === 'ios') {
            return (
              <Modal
                visible={showPicker}
                transparent
                animationType="none"
                onRequestClose={() => setShowPicker(false)}
              >
                <Animated.View
                  style={[
                    styles.modalOverlay,
                    animatedOverlayStyle,
                  ]}
                >
                  <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={() => setShowPicker(false)}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={e => e.stopPropagation()}
                  >
                    <Animated.View style={[styles.iosPickerContainer, animatedPickerStyle]}>
                      <View style={styles.pickerHeader}>
                        <TouchableOpacity
                          style={styles.pickerHeaderButton}
                          onPress={() => {
                            // Reset temp date on cancel
                            setIosTempDate(null)
                            setShowPicker(false)
                          }}
                        >
                          <ThemedText style={{ color: Colors.light.primary, fontSize: 16 }}>
                            Cancel
                          </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.pickerHeaderButton}
                          onPress={() => {
                            const finalDate = iosTempDate !== null ? iosTempDate : currentDate
                            onChange(finalDate)
                            setIosTempDate(null) // Reset temp date
                            setShowPicker(false)
                          }}
                        >
                          <ThemedText style={{ color: Colors.light.primary, fontSize: 16, fontWeight: '600' }}>
                            Done
                          </ThemedText>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.singlePickerContainer}>
                        <DateTimePicker
                          value={currentDate}
                          mode={mode}
                          display={mode === 'datetime' ? 'inline' : 'spinner'}
                          onChange={(event, date) => {
                            if (date) {
                              // Fix: Store in local state instead of calling onChange immediately
                              // This prevents multiple onChange calls during scrolling
                              // onChange will only be called when Done is pressed
                              setIosTempDate(date)
                            }
                          }}
                          minimumDate={minimumDate}
                          maximumDate={maximumDate}
                        />
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
              </Modal>
            )
          }

          // Android
          return (
            <DateTimePicker
              value={currentDate}
              mode={mode === 'datetime' ? pickerMode : mode}
              display="default"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )
        }

        return (
          <View style={styles.container}>
            {label && <ThemedText type="defaultSemiBold" style={styles.label}>{label}</ThemedText>}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePress}
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
            </TouchableOpacity>

            {renderPicker()}

            {error && (
              <ThemedText style={styles.errorMessage}>
                {error.message}
              </ThemedText>
            )}
          </View>
        )
      }}
    />
  )
}

export default ControlledDateInput

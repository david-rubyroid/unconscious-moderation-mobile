import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import type { TextInputProps } from 'react-native'

import { useState } from 'react'
import { Controller } from 'react-hook-form'

import { Pressable, StyleSheet, View } from 'react-native'

import EyeInvisible from '@/assets/icons/eye-invisible'

import { Colors } from '@/constants/theme'

import TextInput from './text-input'
import ThemedText from './themed-text'

interface ControlledTextInputProps<T extends FieldValues> extends TextInputProps {
  name: FieldPath<T>
  control: Control<T>
  isPassword?: boolean
  label?: string
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
  icon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 12,
    borderColor: Colors.light.black,
  },
  errorInput: {
    color: Colors.light.error,
    borderColor: Colors.light.error,
  },
  errorIcon: {
    color: Colors.light.error,
  },
  errorMessage: {
    color: Colors.light.error,
    fontSize: 11,
  },
  passwordInput: {
    paddingRight: 40,
  },
})

function ControlledTextInput<T extends FieldValues>({
  name,
  style,
  control,
  label,
  isPassword = false,
  ...props
}: ControlledTextInputProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

  const toggleSecureTextEntry = () => {
    setIsPasswordVisible(prev => !prev)
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const onChangeText = (text: string) => {
          if (props.keyboardType === 'numeric') {
            const numericValue = text.replace(/\D/g, '')
            onChange(numericValue)
          }
          else {
            onChange(text)
          }
        }

        // Преобразуем value в строку для отображения в TextInput
        const displayValue = value != null ? String(value) : ''

        return (
          <View style={styles.container}>
            {label && <ThemedText type="defaultSemiBold" style={styles.label}>{label}</ThemedText>}

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  style,
                  error && styles.errorInput,
                  isPassword && styles.passwordInput,
                ]}
                onChangeText={onChangeText}
                onBlur={onBlur}
                value={displayValue}
                secureTextEntry={isPassword && !isPasswordVisible}
                {...props}
              />
              {isPassword && (
                <Pressable style={styles.icon} onPress={toggleSecureTextEntry}>
                  <EyeInvisible />
                </Pressable>
              )}
            </View>

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

export default ControlledTextInput

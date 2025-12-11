import type { TextInputProps as RNTextInputProps } from 'react-native'

import { useState } from 'react'
import { Pressable, TextInput as RNTextInput, StyleSheet, View } from 'react-native'

import EyeInvisible from '@/assets/icons/eye-invisible'

import { Colors } from '@/constants/theme'

import ThemedText from './themed-text'

interface TextInputProps extends RNTextInputProps {
  label?: string
  isPassword?: boolean
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 40,
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

function TextInput({
  label,
  isPassword = false,
  error,
  style,
  keyboardType,
  onChangeText,
  value,
  ...props
}: TextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

  const toggleSecureTextEntry = () => {
    setIsPasswordVisible(prev => !prev)
  }

  const handleChangeText = (text: string) => {
    if (keyboardType === 'numeric') {
      const numericValue = text.replace(/\D/g, '')
      onChangeText?.(numericValue)
    }
    else {
      onChangeText?.(text)
    }
  }

  const displayValue = value != null ? String(value) : ''

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText type="defaultSemiBold" style={styles.label}>
          {label}
        </ThemedText>
      )}

      <View style={styles.inputContainer}>
        <RNTextInput
          style={[
            styles.input,
            style,
            error && styles.errorInput,
            isPassword && styles.passwordInput,
          ]}
          onChangeText={handleChangeText}
          value={displayValue}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
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
          {error}
        </ThemedText>
      )}
    </View>
  )
}

export default TextInput

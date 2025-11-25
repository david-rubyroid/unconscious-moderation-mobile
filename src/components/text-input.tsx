import type { TextInputProps as RNTextInputProps } from 'react-native'
import { TextInput as RNTextInput, StyleSheet } from 'react-native'

interface TextInputProps extends RNTextInputProps {
  placeholder?: string
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 40,
  },
})

function TextInput({ placeholder, style, ...props }: TextInputProps) {
  return (
    <RNTextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      {...props}
    />
  )
}

export default TextInput

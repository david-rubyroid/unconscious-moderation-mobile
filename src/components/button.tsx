import type { PressableProps } from 'react-native'
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'

import { Colors, getResponsiveFontSize, withOpacity } from '@/constants/theme'

interface ButtonProps extends PressableProps {
  icon?: React.ReactNode
  title: string
  variant?: 'primary' | 'secondary' | 'primary2'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 233,
  },
  primary: {
    backgroundColor: Colors.light.primary,
  },
  primary2: {
    backgroundColor: Colors.light.primary2,
  },
  secondary: {
    backgroundColor: 'rgba(1, 48, 84, 1)',
  },
  tertiary: {
    backgroundColor: Colors.light.tertiaryBackground,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    borderWidth: 1,
    borderColor: withOpacity(Colors.light.black, 0.15),
    backgroundColor: withOpacity(Colors.light.black, 0.04),
  },
  text: {
    color: Colors.light.white,
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
  },
  disabledText: {
    color: withOpacity(Colors.light.black, 0.25),
  },
  fullWidth: {
    width: '100%',
  },
})

function Button({
  icon,
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        (pressed || loading || disabled) && styles.pressed,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        typeof style === 'function' ? style({ pressed, hovered: false }) : style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {icon && icon}
      {loading
        ? (
            <ActivityIndicator color="white" />
          )
        : (
            <Text style={[styles.text, disabled && styles.disabledText]}>
              {title}
            </Text>
          )}
    </Pressable>
  )
}

export default Button

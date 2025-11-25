import type { ViewProps } from 'react-native'
import { View } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

interface ThemedViewProps extends ViewProps {
  lightColor?: string
  darkColor?: string
}

function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'mainBackground')

  return <View style={[{ backgroundColor }, style]} {...otherProps} />
}

export default ThemedView

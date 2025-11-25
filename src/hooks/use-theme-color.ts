import { useColorScheme } from 'react-native'

import { Colors } from '@/constants/theme'

interface ThemeColorProps {
  dark?: string
  light?: string
}

export function useThemeColor(
  props: ThemeColorProps,
  colorName: keyof typeof Colors.light,
) {
  const theme = useColorScheme() ?? 'light'
  const colorFromProps = props[theme]

  if (colorFromProps) {
    return colorFromProps
  }
  else {
    return Colors[theme][colorName]
  }
}

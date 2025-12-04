import type { TextProps } from 'react-native'
import { StyleSheet, Text } from 'react-native'

import { FontSizes, getResponsiveFontSize, getResponsiveLineHeight } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'small' | 'preSubtitle'
}

const baseStyles = StyleSheet.create({
  small: {
  },
  default: {
  },
  defaultSemiBold: {
    fontWeight: '700',
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    fontWeight: '700',
  },
  preSubtitle: {
    fontWeight: '700',
  },
  link: {
    color: '#0a7ea4',
  },
})

function getTextTypeStyle(type: ThemedTextProps['type']) {
  switch (type) {
    case 'small':
      return {
        fontSize: getResponsiveFontSize(FontSizes.small),
        lineHeight: getResponsiveLineHeight(FontSizes.small, 1.33),
      }
    case 'default':
      return {
        fontSize: getResponsiveFontSize(FontSizes.default),
        lineHeight: getResponsiveLineHeight(FontSizes.default, 1.29),
      }
    case 'defaultSemiBold':
      return {
        fontSize: getResponsiveFontSize(FontSizes.defaultSemiBold),
        lineHeight: getResponsiveLineHeight(FontSizes.defaultSemiBold, 1.5),
      }
    case 'title':
      return {
        fontSize: getResponsiveFontSize(FontSizes.title),
        lineHeight: getResponsiveLineHeight(FontSizes.title, 1.19),
      }
    case 'subtitle':
      return {
        fontSize: getResponsiveFontSize(FontSizes.subtitle),
        lineHeight: getResponsiveLineHeight(FontSizes.subtitle, 1.25),
      }
    case 'preSubtitle':
      return {
        fontSize: getResponsiveFontSize(FontSizes.preSubtitle),
        lineHeight: getResponsiveLineHeight(FontSizes.preSubtitle, 1.25),
      }
    case 'link':
      return {
        fontSize: getResponsiveFontSize(FontSizes.link),
        lineHeight: getResponsiveLineHeight(FontSizes.link, 1.875),
      }
    default:
      return {
        fontSize: getResponsiveFontSize(FontSizes.default),
        lineHeight: getResponsiveLineHeight(FontSizes.default, 1.29),
      }
  }
}

function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  const typeStyle = getTextTypeStyle(type)
  const baseStyle = baseStyles[type] || baseStyles.default

  return (
    <Text
      style={[
        { color },
        baseStyle,
        typeStyle,
        style,
      ]}
      {...rest}
    />
  )
}

export default ThemedText

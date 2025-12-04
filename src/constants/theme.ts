import { Platform } from 'react-native'

import { scaleFont } from '@/utils/responsive'

export const Colors = {
  light: {
    // Primary colors
    primary: '#2E7D60',
    primary2: '#62BC8C',
    primary3: '#76E5A9',
    primary4: '#013766',
    white: '#FFF',
    black: '#000',
    // Text colors
    text: '#000D16',
    // Background colors
    gray1: '#888888',
    gray2: '#E5E5E5',
    gray3: '#545454',
    mainBackground: '#FFFFFF',
    secondaryBackground: '#F6FAFF',
    tertiaryBackground: '#E2EEE8',
    fourthBackground: '#DAF2E5',
    fifthBackground: '#C9E1FF',
    // Secondary colors
    secondary1: '#FDFB08',
    secondary2: '#7A0A2D',
    // Gradient colors
    gradientStart: '#E5E5E5',
    gradientEnd: '#62BC8C',
    // Error colors
    error: '#EA4335',
    error2: '#911E3D',
  },
  // Note: Dark mode is not required yet; the colors are the same as in light mode.
  dark: {
    // Primary colors
    primary: '#2E7D60',
    primary2: '#62BC8C',
    primary3: '#76E5A9',
    primary4: '#013766',
    white: '#FFF',
    // Text colors
    text: '#000D16',
    black: '#000',
    // Background colors
    gray1: '#888888',
    gray2: '#E5E5E5',
    gray3: '#545454',
    mainBackground: '#FFFFFF',
    secondaryBackground: '#F6FAFF',
    tertiaryBackground: '#E2EEE8',
    fourthBackground: '#DAF2E5',
    fifthBackground: '#C9E1FF',
    // Secondary colors
    secondary1: '#FDFB08',
    secondary2: '#7A0A2D',
    // Gradient colors
    gradientStart: '#E5E5E5',
    gradientEnd: '#62BC8C',
    // Error colors
    error: '#EA4335',
    error2: '#911E3D',
  },
}

/**
 * Adds opacity to a hex color
 * @param color - Hex color string (e.g., '#2E7D60' or '#FFF')
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string
 */
export function withOpacity(color: string, opacity: number): string {
  // Remove # if present
  const hex = color.replace('#', '')

  // Handle short hex colors (e.g., #FFF -> #FFFFFF)
  const fullHex = hex.length === 3
    ? hex.split('').map(char => char + char).join('')
    : hex

  // Convert hex to RGB
  const r = Number.parseInt(fullHex.substring(0, 2), 16)
  const g = Number.parseInt(fullHex.substring(2, 4), 16)
  const b = Number.parseInt(fullHex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const Fonts = Platform.select({
  ios: {
    /** SF Pro Text - main font for text */
    sans: 'SF Pro Text',
    /** SF Pro Display - for headings */
    display: 'SF Pro Display',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    display: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
})

/**
 * Base font sizes for the app.
 * These values will be scaled based on screen size.
 */
export const FontSizes = {
  small: 12,
  default: 14,
  defaultSemiBold: 16,
  subtitle: 24,
  preSubtitle: 20,
  title: 32,
  link: 16,
} as const

/**
 * Returns a scaled font size.
 * @param size - base font size from FontSizes
 * @returns scaled font size
 */
export function getResponsiveFontSize(size: number): number {
  return scaleFont(size)
}

/**
 * Returns a scaled lineHeight for a font size.
 * @param fontSize - font size
 * @param multiplier - lineHeight multiplier (default is 1.2)
 * @returns scaled lineHeight
 */
export function getResponsiveLineHeight(fontSize: number, multiplier: number = 1.2): number {
  return Math.round(getResponsiveFontSize(fontSize) * multiplier)
}

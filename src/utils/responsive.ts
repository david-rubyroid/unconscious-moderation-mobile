import { Dimensions } from 'react-native'

const BASE_WIDTH = 390
const BASE_HEIGHT = 844

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

/**
 * Scales a size based on screen width
 * Used for horizontal dimensions (width, horizontal padding)
 * @param size - size in pixels for the base screen
 * @returns scaled size
 */
export function scale(size: number): number {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH
  return Math.round(size * scaleFactor)
}

/**
 * Scales a size based on screen height
 * Used for vertical dimensions (height, vertical padding)
 * @param size - size in pixels for the base screen
 * @returns scaled size
 */
export function verticalScale(size: number): number {
  const scaleFactor = SCREEN_HEIGHT / BASE_HEIGHT
  return Math.round(size * scaleFactor)
}

/**
 * Moderate scaling with factor control
 * Useful for sizes that should not scale linearly
 * @param size - size in pixels for the base screen
 * @param factor - scaling factor (default is 0.5)
 * @returns scaled size
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH
  return Math.round(size + (scaleFactor - 1) * size * factor)
}

/**
 * Scales font size
 * Uses moderate scaling for smoother changes
 * @param size - font size in pixels for the base screen
 * @returns scaled font size
 */
export function scaleFont(size: number): number {
  return moderateScale(size, 0.3)
}

/**
 * Determines if the device is a tablet
 * @returns true if screen width >= 768px
 */
export function isTablet(): boolean {
  return SCREEN_WIDTH >= 768
}

/**
 * Determines if the device is a small screen
 * @returns true if screen width < 375px (e.g., iPhone SE)
 */
export function isSmallScreen(): boolean {
  return SCREEN_WIDTH < 375
}

/**
 * Determines if the device is a large screen
 * @returns true if screen width > 414px (e.g., iPhone Pro Max, tablets)
 */
export function isLargeScreen(): boolean {
  return SCREEN_WIDTH > 414
}

/**
 * Gets current screen dimensions
 * @returns object with width and height
 */
export function getScreenDimensions(): { width: number, height: number } {
  return { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }
}

/**
 * Gets the scaling factor for the current screen
 * @returns scaling factor (1.0 for base screen)
 */
export function getScaleFactor(): number {
  return SCREEN_WIDTH / BASE_WIDTH
}

/**
 * Limits scaling to a maximum value
 * Useful for tablets to prevent elements from becoming too large
 * @param size - size in pixels
 * @param maxScale - maximum scaling factor (default is 1.5)
 * @returns scaled size with limit
 */
export function scaleWithMax(size: number, maxScale: number = 1.5): number {
  const scaleFactor = Math.min(SCREEN_WIDTH / BASE_WIDTH, maxScale)
  return Math.round(size * scaleFactor)
}

/**
 * Hook for getting responsive values
 * Returns screen dimensions and scaling utilities
 */
export function getResponsiveUtils() {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    scale,
    verticalScale,
    moderateScale,
    scaleFont,
    isTablet: isTablet(),
    isSmallScreen: isSmallScreen(),
    isLargeScreen: isLargeScreen(),
    scaleFactor: getScaleFactor(),
  }
}

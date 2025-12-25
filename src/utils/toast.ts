import Toast from 'react-native-toast-message'

/**
 * Shows success toast
 */
export function showSuccessToast(title: string, message?: string): void {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
  })
}

/**
 * Shows info toast
 */
export function showInfoToast(title: string, message?: string): void {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
  })
}

/**
 * Shows error toast
 */
export function showErrorToast(title: string, message?: string): void {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
  })
}

import * as ImagePicker from 'expo-image-picker'
import Toast from 'react-native-toast-message'

/**
 * Request camera and media library permissions for image picker
 * Shows error toast if permissions are denied
 *
 * @param errorMessages - Optional custom error messages for toast notifications
 * @param errorMessages.cameraDenied - Custom error message for camera permission denial
 * @param errorMessages.galleryDenied - Custom error message for gallery permission denial
 * @returns Promise that resolves to true if all permissions are granted, false otherwise
 */
export async function requestImagePickerPermissions(errorMessages?: {
  cameraDenied?: string
  galleryDenied?: string
}): Promise<boolean> {
  const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
  if (cameraStatus !== 'granted') {
    Toast.show({
      type: 'error',
      text1: errorMessages?.cameraDenied || 'Camera permission is required to take photos',
    })
    return false
  }

  const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (mediaLibraryStatus !== 'granted') {
    Toast.show({
      type: 'error',
      text1: errorMessages?.galleryDenied || 'Gallery permission is required to select photos',
    })
    return false
  }

  return true
}

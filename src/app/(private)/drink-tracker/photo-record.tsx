import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import TakePhotoIcon from '@/assets/icons/take-photo'

import { Button, Header, ScreenContainer } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { requestImagePickerPermissions } from '@/utils/image-picker-permissions'
import { scale, verticalScale } from '@/utils/responsive'
import { secureStore, SecureStoreKey } from '@/utils/secureStore'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: scale(360),
    height: scale(380),
    borderRadius: scale(22),
    overflow: 'hidden',
    marginBottom: verticalScale(28),
    backgroundColor: withOpacity(Colors.light.black, 0.05),
  },
  photoPlaceholder: {
    width: scale(360),
    height: scale(380),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: withOpacity(Colors.light.black, 0.1),
    borderRadius: scale(22),
    marginBottom: verticalScale(28),
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
    paddingBottom: verticalScale(20),
  },
  button: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(20),
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
  },
})

function PhotoRecordScreen() {
  const { back } = useRouter()

  const { t } = useTranslation('photo-record')
  const { photoUri: initialPhotoUri } = useLocalSearchParams<{
    photoUri?: string
  }>()

  const [photoUri, setPhotoUri] = useState<string | null>(initialPhotoUri || null)

  const handleTakePhoto = useCallback(async () => {
    const hasPermission = await requestImagePickerPermissions({
      cameraDenied: t('photo-permission-denied'),
      galleryDenied: t('gallery-permission-denied'),
    })

    if (!hasPermission) {
      return
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [360, 380],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri)
      }
    }
    catch {
      Toast.show({
        type: 'error',
        text1: t('photo-error'),
      })
    }
  }, [t])
  const handleChooseFromGallery = async () => {
    const hasPermission = await requestImagePickerPermissions({
      cameraDenied: t('photo-permission-denied'),
      galleryDenied: t('gallery-permission-denied'),
    })

    if (!hasPermission) {
      return
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [360, 380],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri)
      }
    }
    catch {
      Toast.show({
        type: 'error',
        text1: t('photo-error'),
      })
    }
  }
  const handleRetake = () => {
    setPhotoUri(null)
    handleTakePhoto()
  }
  const handleAttach = async () => {
    if (!photoUri) {
      return
    }

    // Only save if photo was changed (not the same as initial S3 URL)
    if (photoUri !== initialPhotoUri) {
      await secureStore.set(SecureStoreKey.SELECTED_DRINK_LOG_PHOTO_URI, photoUri)
    }

    back()
  }

  const renderContent = () => {
    if (!photoUri) {
      return (
        <View style={styles.emptyStateContainer}>
          <View style={styles.photoPlaceholder}>
            <TakePhotoIcon />
          </View>

          <View style={styles.actionButtonsContainer}>
            <Button
              title={t('take-photo')}

              style={styles.button}
              onPress={handleTakePhoto}
            />

            <Button
              title={t('choose-from-gallery')}

              style={styles.button}
              onPress={handleChooseFromGallery}
            />
          </View>
        </View>
      )
    }

    return (
      <View style={styles.content}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title={t('retake')}
            style={styles.button}
            onPress={handleRetake}
          />

          <Button
            title={t('attach')}
            style={styles.button}
            onPress={handleAttach}
          />
        </View>
      </View>
    )
  }

  useEffect(() => {
    if (!photoUri) {
      void handleTakePhoto()
    }
  }, [photoUri, handleTakePhoto])

  return (
    <ScreenContainer>
      <Header title={t('photo-record')} />

      <View style={styles.container}>
        {renderContent()}
      </View>
    </ScreenContainer>
  )
}

export default PhotoRecordScreen

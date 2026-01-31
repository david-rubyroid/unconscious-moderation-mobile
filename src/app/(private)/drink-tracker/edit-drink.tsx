import type { DrinkLogResponse } from '@/api/queries/drink-log/dto'
import type { DrinkType } from '@/api/queries/drink-session/dto'

import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

import { useDeleteDrinkLog, useGetDrinkLog, useUpdateDrinkLog } from '@/api/queries/drink-log'
import { useGetUploadUrl } from '@/api/queries/drink-log/photo'

import StartIcon from '@/assets/icons/start'
import TakePhotoIcon from '@/assets/icons/take-photo'

import {
  Button,
  DrinkSelector,
  Header,
  ScreenContainer,
  TextInput,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { getErrorMessage } from '@/utils/error-handler'
import { scale, verticalScale } from '@/utils/responsive'
import { uploadToS3 } from '@/utils/s3-upload'
import { secureStore, SecureStoreKey } from '@/utils/secureStore'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

const styles = StyleSheet.create({
  myDrinksText: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(11),
  },
  takePhotoText: {
    color: Colors.light.primary4,
    marginVertical: verticalScale(11),
  },
  takePhotoIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    borderRadius: scale(6),
    marginBottom: verticalScale(11),
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: scale(6),
    marginBottom: verticalScale(11),
  },
  drinkCostInput: {
    color: withOpacity(Colors.light.black, 0.5),
    borderColor: withOpacity(Colors.light.black, 0.10),
  },
  drinkingTipsTextContainer: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
    paddingHorizontal: scale(15),
    marginVertical: verticalScale(16),
  },
  drinkingTipsText: {
    color: Colors.light.primary4,
  },
  tipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(15),
    gap: scale(8),
    marginBottom: verticalScale(26),
  },
  tipItem: {
    flex: 1,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(6),
    padding: scale(12),
  },
  tipItemText: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: verticalScale(16),
  },
  deleteButton: {
    backgroundColor: Colors.light.error2,
  },
  deleteButtonText: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.light.primary4,
    textAlign: 'center',
  },
})

interface EditDrinkFormProps {
  drink: DrinkLogResponse | undefined
  sessionId: number | undefined
  drinkId: number | undefined
  params: { sessionId?: string, drinkId?: string }
}

function EditDrinkForm({
  drink,
  sessionId,
  drinkId,
  params,
}: EditDrinkFormProps) {
  const { push, back } = useRouter()
  const { t } = useTranslation('log-drink')

  const [drinkCost, setDrinkCost] = useState<string>(() => drink?.cost ?? '')
  const [selectedDrink, setSelectedDrink] = useState<DrinkType>(() => drink?.drinkType ?? 'wine')
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null)

  const { mutateAsync: getUploadUrl, isPending: isGettingUploadUrl } = useGetUploadUrl(sessionId)

  const { mutateAsync: updateDrinkLog, isPending: isUpdating } = useUpdateDrinkLog(
    sessionId ?? 0,
    drinkId ?? 0,
  )

  const { mutateAsync: deleteDrinkLog, isPending: isDeleting } = useDeleteDrinkLog(
    sessionId,
    drinkId,
  )

  const handleDelete = () => {
    if (sessionId == null || drinkId == null) {
      return
    }
    Alert.alert(
      t('delete-drink-title'),
      t('delete-drink-message'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete-drink'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDrinkLog()
              showSuccessToast(
                t('delete-drink-success'),
                t('delete-drink-success-message'),
              )
              back()
            }
            catch (error) {
              showErrorToast(t('delete-drink-error'), getErrorMessage(error))
            }
          },
        },
      ],
    )
  }

  const handleSave = async () => {
    if (sessionId == null || drinkId == null) {
      return
    }

    const cost = Number.parseFloat(drinkCost)
    if (Number.isNaN(cost) || cost < 0) {
      return
    }

    try {
      let photoS3Key: string | undefined

      if (pendingPhotoUri) {
        const uploadUrlResponse = await getUploadUrl({
          drinkLogId: drinkId,
          filename: `drink-${drinkId}-${Date.now()}.jpg`,
        })

        const uploadResult = await uploadToS3(uploadUrlResponse.uploadUrl, pendingPhotoUri)
        if (!uploadResult.success) {
          throw new Error('Failed to upload photo to S3')
        }
        photoS3Key = uploadUrlResponse.s3Key
      }

      await updateDrinkLog({
        drinkType: selectedDrink,
        cost,
        photoS3Key,
      })

      back()
    }
    catch {
      Toast.show({
        type: 'error',
        text1: t('photo-upload-error') || 'Failed to save',
      })
    }
  }

  const photos = drink?.photos
  const photo = photos?.length ? photos[photos.length - 1] : undefined
  const serverPhotoUri = photo?.photoUrl
  const displayPhotoUri = pendingPhotoUri || serverPhotoUri

  useFocusEffect(
    useCallback(() => {
      const loadPhotoFromStorage = async () => {
        const storedPhotoUri = await secureStore.get(
          SecureStoreKey.SELECTED_DRINK_LOG_PHOTO_URI,
        )
        if (storedPhotoUri) {
          setPendingPhotoUri(storedPhotoUri)
          await secureStore.remove(SecureStoreKey.SELECTED_DRINK_LOG_PHOTO_URI)
        }
      }
      void loadPhotoFromStorage()
    }, []),
  )

  return (
    <>
      <ThemedText style={styles.myDrinksText} type="defaultSemiBold">
        {t('edit-drink-title')}
      </ThemedText>

      <DrinkSelector selectedDrink={selectedDrink} onSelectDrink={setSelectedDrink} />

      <ThemedText type="defaultSemiBold" style={styles.takePhotoText}>
        {t('take-photo')}
      </ThemedText>

      <Pressable
        style={styles.takePhotoIconContainer}
        onPress={() => {
          push({
            pathname: '/drink-tracker/photo-record',
            params: {
              photoUri: serverPhotoUri ?? undefined,
              returnPath: '/drink-tracker/edit-drink',
              sessionId: params.sessionId,
              drinkId: params.drinkId,
            },
          })
        }}
        disabled={isGettingUploadUrl}
      >
        {isGettingUploadUrl
          ? (
              <ActivityIndicator size="small" color={Colors.light.primary4} />
            )
          : displayPhotoUri
            ? (
                <Image source={{ uri: displayPhotoUri }} style={styles.photoPreview} />
              )
            : (
                <TakePhotoIcon />
              )}
      </Pressable>

      <TextInput
        placeholder={t('cost-of-drink')}
        placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
        label={t('cost')}
        value={drinkCost}
        onChangeText={setDrinkCost}
        keyboardType="numeric"
        style={styles.drinkCostInput}
      />

      <View style={styles.drinkingTipsTextContainer}>
        <StartIcon />
        <ThemedText type="defaultSemiBold" style={styles.drinkingTipsText}>
          {t('drinking-tips')}
        </ThemedText>
      </View>

      <View style={styles.tipsContainer}>
        <View style={styles.tipItem}>
          <ThemedText type="defaultSemiBold" style={styles.tipItemText}>
            {t('one-drink-one-water-balance-is-everything')}
          </ThemedText>
        </View>
        <View style={styles.tipItem}>
          <ThemedText type="defaultSemiBold" style={styles.tipItemText}>
            {t('sip-slowly-stick-with-your-drink-stay-present')}
          </ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="secondary"
          title={t('save')}
          onPress={handleSave}
          loading={isUpdating || isGettingUploadUrl}
          disabled={!drinkCost || isUpdating || isGettingUploadUrl}
        />

        <Button
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isDeleting}
          loading={isDeleting}
          title={t('delete-drink')}
          variant="secondary"
        />
      </View>
    </>
  )
}

function EditDrinkScreen() {
  const { t } = useTranslation('log-drink')
  const params = useLocalSearchParams<{ sessionId: string, drinkId: string }>()

  const sessionId = params.sessionId != null && !Number.isNaN(Number(params.sessionId))
    ? Number(params.sessionId)
    : undefined
  const drinkId = params.drinkId != null && !Number.isNaN(Number(params.drinkId))
    ? Number(params.drinkId)
    : undefined

  const { data: drink } = useGetDrinkLog(sessionId, drinkId)

  return (
    <ScreenContainer horizontalPadding={12}>
      <Header title={t('edit-drink-title')} />

      <EditDrinkForm
        key={drink?.id ?? 'loading'}
        drink={drink}
        sessionId={sessionId}
        drinkId={drinkId}
        params={params}
      />
    </ScreenContainer>
  )
}

export default EditDrinkScreen

import type { DrinkType } from '@/api/queries/drink-session/dto'

import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useLogDrink } from '@/api/queries/drink-log'
import { useAddDrinkPhoto, useGetUploadUrl } from '@/api/queries/drink-log/photo'

import { useGetCurrentDrinkSession } from '@/api/queries/drink-session'

import { queryClient } from '@/api/query-client'

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
import { scale, verticalScale } from '@/utils/responsive'
import { uploadToS3 } from '@/utils/s3-upload'
import { secureStore, SecureStoreKey } from '@/utils/secureStore'

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
  myDrinksScrollView: {
    flexGrow: 0,
    marginHorizontal: -scale(15),
    marginBottom: verticalScale(21),
  },
  myDrinksContainer: {
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(15),
  },
  myDrink: {
    alignItems: 'center',
    gap: scale(11),
    paddingHorizontal: scale(23),
    paddingVertical: verticalScale(15),
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    borderRadius: scale(6),
  },
  myDrinkText: {
    textAlign: 'center',
    color: withOpacity(Colors.light.black, 0.5),
  },
  drinkTextSelected: {
    color: Colors.light.white,
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
  },
  divider: {
    height: 21,
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

function LogDrinkScreen() {
  const { push, back } = useRouter()

  const [selectedDrink, setSelectedDrink] = useState<DrinkType>('wine')
  const [drinkCost, setDrinkCost] = useState<string>('')
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null)

  const { t } = useTranslation('log-drink')
  const { data: currentSession, isLoading: isLoadingSession } = useGetCurrentDrinkSession()
  const { mutateAsync: getUploadUrl, isPending: isGettingUploadUrl } = useGetUploadUrl(currentSession?.id)
  const { mutateAsync: addDrinkPhoto, isPending: isAddingDrinkPhoto } = useAddDrinkPhoto(currentSession?.id)

  // Helper function to invalidate all related queries
  const invalidateQueries = (drinkLogId: number) => {
    queryClient.invalidateQueries({
      queryKey: [
        'drink-tracker',
        'sessions',
        currentSession?.id,
        'drinks',
        drinkLogId,
        'photos',
      ],
    })
    queryClient.invalidateQueries({
      queryKey: ['drink-tracker', 'sessions', currentSession?.id, 'drinks'],
    })
    queryClient.invalidateQueries({
      queryKey: ['drink-tracker', 'sessions', currentSession?.id],
    })
    queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'sessions'] })
    queryClient.invalidateQueries({ queryKey: ['drink-tracker', 'current-session'] })
  }
  // Async function to handle photo upload
  const handlePhotoUpload = async (drinkLogId: number, photoUri: string) => {
    // Get presigned URL
    const uploadUrlResponse = await getUploadUrl({
      drinkLogId,
      filename: `drink-${drinkLogId}-${Date.now()}.jpg`,
    })

    // Upload to S3
    await uploadToS3(uploadUrlResponse.uploadUrl, photoUri)

    // Save photo metadata
    await addDrinkPhoto({
      drinkLogId,
      s3Key: uploadUrlResponse.s3Key,
    })

    // Clear photo from state after successful upload
    setSelectedPhotoUri(null)
  }
  const { mutate: logDrink, isPending: isLoggingDrink } = useLogDrink(
    currentSession?.id,
    {
      onSuccess: async (drinkLog) => {
        setDrinkCost('')

        try {
          // Upload photo if selected
          if (selectedPhotoUri && drinkLog.id) {
            await handlePhotoUpload(drinkLog.id, selectedPhotoUri)
          }
          else {
            // Clear photo if no photo was selected
            setSelectedPhotoUri(null)
          }

          // Invalidate queries (common for both cases)
          invalidateQueries(drinkLog.id)

          // Navigate back after successful completion
          back()
        }
        catch {
          // Show error message
          Toast.show({
            type: 'error',
            text1: t('photo-upload-error') || 'Failed to upload photo',
          })
          // Don't navigate back if photo upload failed
        }
      },
    },
  )

  const isLoading = isGettingUploadUrl || isAddingDrinkPhoto || isLoggingDrink

  const handleLogDrink = () => {
    if (!currentSession?.id) {
      return
    }

    const cost = Number.parseFloat(drinkCost)
    if (Number.isNaN(cost) || cost < 0) {
      return
    }

    logDrink({
      drinkType: selectedDrink,
      cost,
    })
  }
  const renderContent = () => {
    if (isLoadingSession) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary4} />
        </View>
      )
    }

    if (!currentSession) {
      return (
        <View style={styles.emptyStateContainer}>
          <ThemedText style={styles.emptyStateText}>
            {t('no-active-session')}
          </ThemedText>
        </View>
      )
    }

    return (
      <>
        <ThemedText style={styles.myDrinksText} type="defaultSemiBold">
          {t('log-drink')}
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
                photoUri: selectedPhotoUri || undefined,
                returnPath: '/drink-tracker/log-drink',
              },
            })
          }}
        >
          {selectedPhotoUri
            ? (
                <Image source={{ uri: selectedPhotoUri }} style={styles.photoPreview} />
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
            <ThemedText
              type="defaultSemiBold"
              style={styles.tipItemText}
            >
              {t('one-drink-one-water-balance-is-everything')}
            </ThemedText>
          </View>

          <View style={styles.tipItem}>
            <ThemedText
              type="defaultSemiBold"
              style={styles.tipItemText}
            >
              {t('sip-slowly-stick-with-your-drink-stay-present')}
            </ThemedText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="secondary"
            title={t('log-drink')}
            onPress={handleLogDrink}
            loading={isLoading}
            disabled={!drinkCost || isLoading}
          />
        </View>
      </>
    )
  }

  // Load photo from SecureStore when screen comes into focus (after returning from photo-record)
  useFocusEffect(
    useCallback(() => {
      const loadPhotoFromStorage = async () => {
        const storedPhotoUri = await secureStore.get(SecureStoreKey.SELECTED_DRINK_LOG_PHOTO_URI)
        if (storedPhotoUri && storedPhotoUri !== selectedPhotoUri) {
          setSelectedPhotoUri(storedPhotoUri)

          // Remove photo from secure store after using it
          await secureStore.remove(SecureStoreKey.SELECTED_DRINK_LOG_PHOTO_URI)
        }
      }

      void loadPhotoFromStorage()
    }, [selectedPhotoUri]),
  )

  return (
    <ScreenContainer horizontalPadding={12}>
      <Header title={t('title')} />

      {renderContent()}
    </ScreenContainer>
  )
}

export default LogDrinkScreen

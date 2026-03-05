import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useGetCurrentUser } from '@/api/queries/auth'
import { useUpdateUser } from '@/api/queries/user'

import {
  Button,
  Header,
  PremiumPlanButton,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(36),
  },
  descriptionContainer: {
    padding: scale(16),
    backgroundColor: Colors.light.white,
    borderRadius: scale(10),
    gap: verticalScale(20),
  },
  description: {
    color: Colors.light.primary,
    fontWeight: 400,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: Colors.light.tertiaryBackground,
    borderRadius: scale(8),
    padding: scale(12),
    minHeight: verticalScale(60),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  thisWillBeYourDailyReminder: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: 400,
  },
  button: {
    alignSelf: 'center',
  },
})

function EditYourAnchorScreen() {
  const { back } = useRouter()
  const { t } = useTranslation('your-anchor')
  const { t: tProfile } = useTranslation('profile')

  const { data: user } = useGetCurrentUser()
  const [anchor, setAnchor] = useState('')

  const {
    mutateAsync: updateUser,
    isPending: isUpdatingUser,
  } = useUpdateUser()

  useEffect(() => {
    if (user?.yourAnchor) {
      setAnchor(user.yourAnchor)
    }
  }, [user?.yourAnchor])

  const handleSave = () => {
    updateUser({
      yourAnchor: anchor,
    }, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: tProfile('success'),
          text2: tProfile('anchor-updated-successfully'),
        })
        back()
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: tProfile('error'),
          text2: tProfile('failed-to-update-anchor'),
        })
      },
    })
  }

  const gradientColors = Colors.light.profileScreenGradient

  return (
    <ScreenContainer gradientColors={gradientColors} contentContainerStyle={styles.container}>
      <Header title={tProfile('edit-your-anchor-title')} />

      <PremiumPlanButton />

      <View style={styles.descriptionContainer}>
        <ThemedText type="defaultSemiBold" style={styles.description}>
          {t('description')}
        </ThemedText>

        <TextInput
          placeholder={t('type-here')}
          placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
          style={styles.textInput}
          value={anchor}
          onChangeText={setAnchor}
          multiline
        />
      </View>

      <ThemedText
        type="defaultSemiBold"
        style={styles.thisWillBeYourDailyReminder}
      >
        {t('this-will-be-your-daily-reminder')}
      </ThemedText>

      <Button
        title={t('save')}
        onPress={handleSave}
        disabled={!anchor.trim() || isUpdatingUser}
        style={styles.button}
        loading={isUpdatingUser}
      />
    </ScreenContainer>
  )
}

export default EditYourAnchorScreen

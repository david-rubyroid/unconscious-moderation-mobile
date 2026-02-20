import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useUpdateUser } from '@/api/queries/user'

import { Button, Header, ScreenContainer, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

const styles = StyleSheet.create({
  container: {
    gap: 36,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: Colors.light.white,
    borderRadius: 10,
    gap: 20,
  },
  description: {
    color: Colors.light.primary,
    fontWeight: 400,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: Colors.light.tertiaryBackground,
    borderRadius: 8,
    padding: 12,
    height: 60,
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

function YourAnchorScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('your-anchor')

  const [anchor, setAnchor] = useState('')

  const {
    mutateAsync: updateUser,
    isPending: isUpdatingUser,
  } = useUpdateUser()

  const handleSave = () => {
    updateUser({
      yourAnchor: anchor,
    }, {
      onSuccess: () => {
        replace('/(private)/shared-awareness')
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: t('error-title'),
          text2: t('error-description'),
        })
      },
    })
  }

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <Header backButton={false} title={t('title')} />

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
        disabled={!anchor}
        style={styles.button}
        loading={isUpdatingUser}
      />
    </ScreenContainer>
  )
}

export default YourAnchorScreen

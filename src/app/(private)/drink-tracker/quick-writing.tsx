import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, StyleSheet, TextInput, View } from 'react-native'

import { useGetDrinkSession, useUpdateDrinkSession } from '@/api/queries/drink-session'

import quickWritingBackgroundImage from '@/assets/images/quick-writing.webp'

import { Button, Header, ScreenContainer, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    padding: scale(35),
    borderRadius: scale(20),
    overflow: 'hidden',
    marginBottom: verticalScale(29),
  },
  backgroundImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
  },
  backgroundImageDescription: {
    fontWeight: '500',
    color: Colors.light.white,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
  },
  textInput: {
    width: '100%',
    minHeight: verticalScale(200),
    borderRadius: scale(20),
    padding: scale(20),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    color: withOpacity(Colors.light.black, 0.5),
    borderWidth: 0,
    textAlignVertical: 'top',
    marginBottom: verticalScale(30),
  },
})

function QuickWritingScreen() {
  const { back } = useRouter()
  const [text, setText] = useState('')
  const { t } = useTranslation('quick-writing')

  const { sessionId } = useLocalSearchParams()

  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))
  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))

  const handleDone = () => {
    updateDrinkSession({
      quickWriting: text,
    }, {
      onSuccess: () => {
        back()
      },
    })
  }

  useEffect(() => {
    if (drinkSession?.quickWriting && text === '') {
      setText(drinkSession.quickWriting)
    }
  }, [drinkSession, text])

  return (
    <ScreenContainer>
      <Header title={t('title')} />

      <ImageBackground
        source={quickWritingBackgroundImage}
        style={styles.imageBackground}
      >
        <View style={styles.backgroundImageOverlay} />

        <ThemedText type="defaultSemiBold" style={styles.backgroundImageDescription}>
          {t('description')}
        </ThemedText>
      </ImageBackground>

      <TextInput
        multiline
        placeholder={t('type-here')}
        placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
        style={styles.textInput}
        value={text}
        onChangeText={setText}
      />

      <Button title={t('done')} variant="secondary" style={styles.button} onPress={handleDone} />
    </ScreenContainer>
  )
}
export default QuickWritingScreen

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, StyleSheet, TextInput, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetDrinkSession, useUpdateDrinkSession } from '@/api/queries/drink-session'

import quickWritingBackgroundImage from '@/assets/images/quick-writing.jpg'

import { Button, Header, ThemedGradient, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(15),
  },
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
    color: Colors.light.white,
    textAlign: 'center',
  },
  button: {
    marginTop: 'auto',
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
  },
})

function QuickWritingScreen() {
  const { back } = useRouter()
  const [text, setText] = useState('')
  const { t } = useTranslation('quick-writing')

  const { sessionId } = useLocalSearchParams()
  const { top, bottom } = useSafeAreaInsets()

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
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} />

      <View style={styles.container}>
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
      </View>

    </ThemedGradient>
  )
}
export default QuickWritingScreen

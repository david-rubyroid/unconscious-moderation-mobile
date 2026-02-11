import { useLocalSearchParams } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, View } from 'react-native'

import { Button, Header, ScreenContainer, ThemedText } from '@/components'

import { CONNECTION_DAY_IMAGES } from '@/constants/daily-activities'

import { ConnectionDayFirstTimePopup, HowToDoItSection } from './components'
import { connectionDayStyles } from './styles'
import { useConnectionDayCompletion } from './use-connection-day-completion'

type ConnectionDayKey = keyof typeof CONNECTION_DAY_IMAGES

export default function ConnectionDayScreen() {
  const { t } = useTranslation('connection-days')
  const { day } = useLocalSearchParams<{ day: string }>()
  const dayNumber = Number(day) as ConnectionDayKey

  const { handleComplete, isPending } = useConnectionDayCompletion(dayNumber)

  const imageSource = CONNECTION_DAY_IMAGES[dayNumber]
  const titleKey = `day-${day}.title`
  const howToDoIt = t(`day-${day}.how-to-do-it`, { returnObjects: true }) as {
    title: string
    description: string[]
  }

  return (
    <ScreenContainer
      contentContainerStyle={connectionDayStyles.contentContainer}
      gradientColors={['#BDE5E2', '#DCF1EE', '#E4F4ED', '#B9E2E6']}
    >
      <Header title={t('title')} />

      <ThemedText type="preSubtitle" style={connectionDayStyles.title}>
        {t(titleKey)}
      </ThemedText>

      <ImageBackground
        source={imageSource}
        style={connectionDayStyles.imageBackground}
      >
        <View style={connectionDayStyles.overlay} />
      </ImageBackground>

      <ThemedText style={connectionDayStyles.description} type="defaultSemiBold">
        <Trans
          i18nKey={`connection-days:day-${day}.description`}
          components={[
            <ThemedText
              key="0"
              type="defaultSemiBold"
              style={connectionDayStyles.descriptionBold}
            />,
          ]}
        />
      </ThemedText>

      <HowToDoItSection howToDoIt={howToDoIt} />

      <Button
        title={t('done-button')}
        onPress={handleComplete}
        style={connectionDayStyles.button}
        loading={isPending}
      />

      <ConnectionDayFirstTimePopup />
    </ScreenContainer>
  )
}

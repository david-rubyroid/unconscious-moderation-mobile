import { useTranslation } from 'react-i18next'

import { StyleSheet } from 'react-native'

import preDrinkHypnosisBackgroundImage from '@/assets/images/box-breathing-bg.webp'

import {
  AudioPlayer,
  Button,
  Header,
  ScreenContainer,
} from '@/components'

import { Colors } from '@/constants/theme'

import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  button: {
    marginTop: verticalScale(35),
    alignSelf: 'center',
  },
})

interface HypnosisPlayerProps {
  title: string
  audioUri: string
  onDone: () => void
}

function HypnosisPlayer({
  title,
  audioUri,
  onDone,
}: HypnosisPlayerProps) {
  const { t } = useTranslation('hypnosis')

  return (
    <ScreenContainer backgroundImage={preDrinkHypnosisBackgroundImage}>
      <Header title={title || t('title')} whiteTitle />

      <AudioPlayer
        audioUri={audioUri}
        lockScreenTitle={title || t('title')}
        textColor={Colors.light.white}
      />

      <Button
        style={styles.button}
        title={t('done')}
        onPress={onDone}
      />
    </ScreenContainer>
  )
}

export default HypnosisPlayer

import { Trans } from 'react-i18next'
import { ImageBackground, View } from 'react-native'

import proTipImage from '@/assets/images/pro-tip.webp'

import { ThemedText } from '@/components'

import { styles } from '../drink-with-awareness.styles'

export function ProTipCard() {
  const s = styles.proTip

  return (
    <ImageBackground source={proTipImage} style={s.container}>
      <View style={s.overlay} />

      <ThemedText type="defaultSemiBold" style={s.description}>
        <Trans
          i18nKey="drink-with-awareness:pro-tip-description"
          components={[
            <ThemedText type="defaultSemiBold" key="0" style={s.descriptionBold} />,
            <ThemedText type="defaultSemiBold" key="1" style={s.descriptionBold} />,
            <ThemedText type="defaultSemiBold" key="2" style={s.descriptionBold} />,
          ]}
        />
      </ThemedText>
    </ImageBackground>
  )
}

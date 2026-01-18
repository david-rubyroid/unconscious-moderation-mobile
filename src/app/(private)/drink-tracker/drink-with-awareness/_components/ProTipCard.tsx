import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, View } from 'react-native'

import proTipImage from '@/assets/images/pro-tip.jpg'

import { ThemedText } from '@/components'

import { styles } from '../_drink-with-awareness.styles'

export function ProTipCard() {
  const { t } = useTranslation('drink-with-awareness')

  return (
    <ImageBackground source={proTipImage} style={styles.proTipContainer}>
      <View style={styles.proTipOverlay} />

      <ThemedText type="defaultSemiBold" style={styles.proTipTitle}>
        {t('pro-tip')}
      </ThemedText>

      <ThemedText type="defaultSemiBold" style={styles.proTipDescription}>
        <Trans
          i18nKey="drink-with-awareness:pro-tip-description"
          components={[
            <ThemedText type="defaultSemiBold" key="0" style={styles.proTipDescriptionBold} />,
            <ThemedText type="defaultSemiBold" key="1" style={styles.proTipDescriptionBold} />,
            <ThemedText type="defaultSemiBold" key="2" style={styles.proTipDescriptionBold} />,
          ]}
        />
      </ThemedText>
    </ImageBackground>
  )
}

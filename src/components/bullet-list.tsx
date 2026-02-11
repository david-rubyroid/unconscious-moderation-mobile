import type { StyleProp, TextStyle } from 'react-native'

import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'

import { scale } from '@/utils/responsive'
import ThemedText from './themed-text'

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingLeft: scale(8),
  },
  bullet: {
    marginRight: scale(8),
    color: Colors.light.primary4,
  },
  text: {
    fontWeight: '400',
    color: Colors.light.primary4,
  },
  textBold: {
    fontWeight: '700',
    color: Colors.light.primary4,
  },
})

interface BulletListProps {
  items: string[]
  spacing?: number
  i18nNamespace?: string
  textType?: 'default' | 'defaultSemiBold'
  textStyle?: StyleProp<TextStyle>
}

function BulletList({
  items,
  i18nNamespace,
  textType = 'defaultSemiBold',
  spacing = 10,
  textStyle,
}: BulletListProps) {
  const { t } = useTranslation(i18nNamespace)

  return (
    <View style={{ gap: spacing }}>
      {items.map((item) => {
        const i18nKey = i18nNamespace ? `${i18nNamespace}:${item}` : item
        const translation = t(item)

        // Check if translation contains formatting tags (like <0>)
        const hasFormatting = /<\d+>/.test(translation)

        return (
          <View key={i18nKey} style={styles.item}>
            <ThemedText type={textType} style={styles.bullet}>
              •
            </ThemedText>

            <ThemedText type={textType} style={[styles.text, textStyle]}>
              {hasFormatting
                ? (
                    <Trans
                      i18nKey={i18nKey}
                      components={[
                        <ThemedText key="0" type={textType} style={styles.textBold} />,
                      ]}
                    />
                  )
                : (
                    translation
                  )}
            </ThemedText>
          </View>
        )
      })}
    </View>
  )
}

export default BulletList

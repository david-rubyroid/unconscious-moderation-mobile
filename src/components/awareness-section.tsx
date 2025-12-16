import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

interface AwarenessItem {
  id: number
  gift?: string
  fear?: string
}

interface AwarenessSectionProps {
  title: string
  items?: AwarenessItem[]
  translationNamespace?: string
}

const styles = StyleSheet.create({
  sectionContent: {
    gap: verticalScale(12),
    flex: 1,
    width: '48%',
  },
  sectionTitle: {
    color: Colors.light.primary,
    fontWeight: '700',
    fontSize: scale(20),
    textAlign: 'center',
  },
  sectionItem: {
    minHeight: scale(45),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(15),
    borderRadius: scale(15),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  sectionItemText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
})

function AwarenessSection({ title, items, translationNamespace = 'questions' }: AwarenessSectionProps) {
  const { t } = useTranslation(translationNamespace)

  if (!items || items.length === 0) {
    return null
  }

  return (
    <View style={styles.sectionContent}>
      <ThemedText
        type="defaultSemiBold"
        style={styles.sectionTitle}
      >
        {title}
      </ThemedText>

      {items.map((item) => {
        const textKey = item.gift || item.fear
        if (!textKey)
          return null

        return (
          <View style={styles.sectionItem} key={item.id}>
            <ThemedText style={styles.sectionItemText} type="default">
              {t(textKey)}
            </ThemedText>
          </View>
        )
      })}
    </View>
  )
}

export default AwarenessSection

import { View } from 'react-native'

import { BulletList, ThemedText } from '@/components'

import { actionDayStyles } from '../styles'

interface HowToDoItSectionProps {
  howToDoIt: {
    title: string
    description: string[]
  }
}

export function HowToDoItSection({ howToDoIt }: HowToDoItSectionProps) {
  return (
    <View style={actionDayStyles.howToDoItContainer}>
      <ThemedText type="preSubtitle" style={actionDayStyles.howToDoItDescriptionTitle}>
        {howToDoIt.title}
      </ThemedText>

      {howToDoIt.description.length > 1
        ? (
            <BulletList
              spacing={10}
              textStyle={actionDayStyles.bulletListText}
              items={howToDoIt.description}
            />
          )
        : (
            <ThemedText type="defaultSemiBold" style={actionDayStyles.howToDoItDescription}>
              {howToDoIt.description[0]}
            </ThemedText>
          )}
    </View>
  )
}

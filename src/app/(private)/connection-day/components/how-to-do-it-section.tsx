import { View } from 'react-native'

import { BulletList, ThemedText } from '@/components'

import { connectionDayStyles } from '../styles'

interface HowToDoItSectionProps {
  howToDoIt: {
    title: string
    description: string[]
  }
}

export function HowToDoItSection({ howToDoIt }: HowToDoItSectionProps) {
  return (
    <View style={connectionDayStyles.howToDoItContainer}>
      <ThemedText type="preSubtitle" style={connectionDayStyles.howToDoItDescriptionTitle}>
        {howToDoIt.title}
      </ThemedText>

      {howToDoIt.description.length > 1
        ? (
            <BulletList
              spacing={10}
              textStyle={connectionDayStyles.bulletListText}
              items={howToDoIt.description}
            />
          )
        : (
            <ThemedText type="defaultSemiBold" style={connectionDayStyles.howToDoItDescription}>
              {howToDoIt.description[0]}
            </ThemedText>
          )}
    </View>
  )
}

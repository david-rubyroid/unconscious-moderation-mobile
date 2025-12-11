import type { Href } from 'expo-router'

import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

interface HeaderProps {
  title: string
  route?: Href
  isReplace?: boolean
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(23),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(26),
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.light.primary4,
  },
})

function Header({ title, route, isReplace }: HeaderProps) {
  const { push, replace, back } = useRouter()

  const handleBack = () => {
    if (route) {
      isReplace ? replace(route) : push(route)
    }
    else {
      back()
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBack}
      >
        <MaterialIcons name="arrow-back-ios" size={scale(24)} color={Colors.light.primary4} />
      </Pressable>

      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
    </View>
  )
}

export default Header

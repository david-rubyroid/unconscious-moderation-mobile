import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

import ThemedText from './themed-text'

interface HeaderProps {
  title: string
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

function Header({ title }: HeaderProps) {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          router.back()
        }}
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

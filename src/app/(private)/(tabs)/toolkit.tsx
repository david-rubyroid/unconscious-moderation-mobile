import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import DrinkIcon from '@/assets/icons/drink'
import toolkitImage from '@/assets/images/toolkit.jpg'

import { ThemedGradient, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(21),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(12.5),
  },
  backgroundImage: {
    flex: 1,
  },
  toolkit: {
    paddingVertical: verticalScale(17.5),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolkitOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolkitImageStyle: {
    resizeMode: 'cover',
  },
  toolkitText: {
    color: Colors.light.white,
  },
})

function ToolkitScreen() {
  const { t } = useTranslation('toolkit')
  const router = useRouter()

  const { top, bottom } = useSafeAreaInsets()

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <View style={styles.container}>
        <ThemedText style={styles.title} type="subtitle">Toolkit</ThemedText>

        <Pressable
          onPress={() => {
            router.push('/drink-tracker')
          }}
        >
          <ImageBackground
            source={toolkitImage}
            style={styles.toolkit}
            imageStyle={styles.toolkitImageStyle}
          >
            <View style={styles.toolkitOverlay} />

            <ThemedText style={styles.toolkitText} type="defaultSemiBold">
              {t('drink-tracker')}
            </ThemedText>

            <DrinkIcon />
          </ImageBackground>
        </Pressable>
      </View>
    </ThemedGradient>
  )
}

export default ToolkitScreen

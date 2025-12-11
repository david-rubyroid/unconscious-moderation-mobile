import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import manageUrgesBackgroundImage from '@/assets/images/manage-urges.jpg'

import { Button, Header, ThemedGradient, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(15),
  },
  imageBackground: {
    width: '100%',
    paddingVertical: scale(34),
    borderRadius: scale(20),
    overflow: 'hidden',
    marginBottom: verticalScale(23),
  },
  backgroundImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.8),
  },
  rememberText: {
    color: Colors.light.white,
    textAlign: 'center',
  },
  exercisesContainer: {
    gap: verticalScale(18),
  },
  exerciseItem: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    borderRadius: scale(20),
    backgroundColor: withOpacity(Colors.light.white, 0.8),
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  exerciseItemTitle: {
    color: Colors.light.primary4,
  },
  exerciseItemDescription: {
    fontWeight: '400',
    color: Colors.light.primary4,
  },
  button: {
    marginTop: 'auto',
  },
})

function ManageUrgesScreen() {
  const { push } = useRouter()

  const { t } = useTranslation('manage-urges')
  const { top, bottom } = useSafeAreaInsets()

  const { sessionId } = useLocalSearchParams()

  // const navigateToBoxBreathing = () => {
  //   push({
  //     pathname: '/drink-tracker/box-breathing',
  //     params: { sessionId },
  //   })
  // }
  const navigateToQuickWriting = () => {
    push({
      pathname: '/drink-tracker/quick-writing',
      params: { sessionId },
    })
  }
  const navigateToSelfHypnosis = () => {
    push({
      pathname: '/drink-tracker/hypnosis',
      params: { sessionId },
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} />

      <View style={styles.container}>
        <ImageBackground source={manageUrgesBackgroundImage} style={styles.imageBackground}>
          <View style={styles.backgroundImageOverlay} />

          <ThemedText type="preSubtitle" style={styles.rememberText}>
            {t('remember', { mantra: 'I\'m doing just fine!' })}
          </ThemedText>
        </ImageBackground>

        <View style={styles.exercisesContainer}>
          {/* <View style={styles.exerciseItem}>
            <ThemedText type="defaultSemiBold" style={styles.exerciseItemTitle}>
              {t('box-breathing')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.exerciseItemDescription}>
              {t('box-breathing-description')}
            </ThemedText>
          </View> */}

          <Pressable style={styles.exerciseItem} onPress={navigateToSelfHypnosis}>
            <ThemedText type="defaultSemiBold" style={styles.exerciseItemTitle}>
              {t('self-hypnosis')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.exerciseItemDescription}>
              {t('self-hypnosis-description')}
            </ThemedText>
          </Pressable>

          <Pressable style={styles.exerciseItem} onPress={navigateToQuickWriting}>
            <ThemedText type="defaultSemiBold" style={styles.exerciseItemTitle}>
              {t('quick-writing')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.exerciseItemDescription}>
              {t('quick-writing-description')}
            </ThemedText>
          </Pressable>
        </View>

        <Button variant="secondary" title={t('done')} style={styles.button} />
      </View>
    </ThemedGradient>
  )
}

export default ManageUrgesScreen

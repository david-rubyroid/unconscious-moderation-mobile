import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import manageUrgesBackgroundImage from '@/assets/images/manage-urges.jpg'

import { Button, Header, ScreenContainer, ThemedText } from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    marginBottom: verticalScale(20),
  },
  exerciseItem: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    borderRadius: scale(20),
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.8),
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
  manageUrgesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(20),
    paddingVertical: verticalScale(19),
    alignSelf: 'center',
    width: 240,
    backgroundColor: withOpacity(Colors.light.tertiaryBackground, 0.8),
    marginBottom: verticalScale(30),
  },
  manageUrgesTitle: {
    color: Colors.light.error2,
  },
  button: {
    alignSelf: 'center',
  },
})

function ManageUrgesScreen() {
  const { push } = useRouter()

  const { t } = useTranslation('manage-urges')

  const { sessionId } = useLocalSearchParams()

  const navigateToBoxBreathing = () => {
    push('/box-breathing')
  }
  const navigateToManageUrges = () => {
    push('/urge-surfing-meditation')
  }
  const navigateToQuickWriting = () => {
    push({
      pathname: '/drink-tracker/quick-writing',
      params: { sessionId },
    })
  }
  const navigateToSelfHypnosis = () => {
    push({
      pathname: '/drink-tracker/hypnosis-self',
      params: {
        sessionId,
        hypnosisLink: HYPNOSIS_LINKS.selfHypnosis,
      },
    })
  }

  return (
    <ScreenContainer>
      <Header title={t('title')} />

      <ImageBackground source={manageUrgesBackgroundImage} style={styles.imageBackground}>
        <View style={styles.backgroundImageOverlay} />

        <ThemedText type="preSubtitle" style={styles.rememberText}>
          {t('remember', { mantra: 'I\'m doing just fine!' })}
        </ThemedText>
      </ImageBackground>

      <View style={styles.exercisesContainer}>
        <Pressable style={styles.exerciseItem} onPress={navigateToBoxBreathing}>
          <ThemedText type="defaultSemiBold" style={styles.exerciseItemTitle}>
            {t('box-breathing')}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.exerciseItemDescription}>
            {t('box-breathing-description')}
          </ThemedText>
        </Pressable>

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

      <Pressable style={styles.manageUrgesContainer} onPress={navigateToManageUrges}>
        <ThemedText type="defaultSemiBold" style={styles.manageUrgesTitle}>
          {t('manage-urge-video')}
        </ThemedText>
      </Pressable>

      <Button variant="secondary" title={t('done')} style={styles.button} />
    </ScreenContainer>
  )
}

export default ManageUrgesScreen

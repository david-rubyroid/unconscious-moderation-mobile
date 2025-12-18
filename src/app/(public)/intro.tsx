import { useRouter } from 'expo-router'
import { useVideoPlayer, VideoView } from 'expo-video'

import { useEffect, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Logo from '@/assets/icons/logo'

import {
  Button,
  Divider,
  ExternalLink,
  SocialAuth,
  TermsText,
  TextInput,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { VIDEOS_LINKS } from '@/constants/video-links'
import { verticalScale } from '@/utils/responsive'
import { logStreamingInfo } from '@/utils/video-streaming'

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: withOpacity(Colors.light.primary, 0.7),
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: Colors.light.white,
    lineHeight: 40,
  },
  highlight: {
    width: '100%',
    backgroundColor: withOpacity(Colors.light.primary, 0.5),
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.light.white,
    marginTop: 22,
  },
  description: {
    textAlign: 'center',
    color: Colors.light.white,
    marginVertical: 22,
  },
  divider: {
    marginVertical: 22,
  },
  emailInput: {
    borderColor: Colors.light.white,
    color: Colors.light.white,
  },
  button: {
    width: 141,
    marginTop: 22,
  },
  termsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  support: {
    marginTop: 25,
    color: Colors.light.white,
    textAlign: 'center',
  },
  supportLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  terms: {
    color: Colors.light.white,
    marginTop: 7,
  },
  emailContainer: {
    width: '100%',
    paddingHorizontal: 49,
  },
})

function IntroScreen() {
  const router = useRouter()
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  const { t } = useTranslation('intro')
  const { top, bottom } = useSafeAreaInsets()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const player = useVideoPlayer(
    shouldLoadVideo ? VIDEOS_LINKS.introVideo : null,
    (player) => {
      player.loop = true
      player.play()
      logStreamingInfo(VIDEOS_LINKS.introVideo, player.status)
    },
  )

  const handleEmailChange = (text: string) => {
    setEmail(text)
  }
  const navigateToLogin = () => {
    router.replace({
      pathname: '/(auth)/sign-in',
      params: {
        email,
      },
    })
  }

  return (
    <View style={styles.wrapper}>
      {shouldLoadVideo && player && (
        <VideoView
          nativeControls={false}
          player={player}
          style={styles.video}
          pointerEvents="none"
          contentFit="cover"
        />
      )}

      <View style={[styles.container, { paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>
            {t('title.1')}
          </ThemedText>

          <View style={styles.highlight}>
            <ThemedText type="title" style={styles.title}>
              {t('title.2')}
            </ThemedText>
          </View>

          <ThemedText type="title" style={styles.title}>
            {t('title.3')}
          </ThemedText>
        </View>

        <ThemedText type="subtitle" style={styles.subtitle}>
          {t('subtitle')}
        </ThemedText>

        <ThemedText style={styles.description}>
          {t('description')}
        </ThemedText>

        <SocialAuth variant="intro" />

        <View style={styles.emailContainer}>
          <Divider text={t('or')} viewStyle={styles.divider} />

          <TextInput
            value={email}
            onChangeText={handleEmailChange}
            style={styles.emailInput}
            placeholder={t('emailPlaceholder')}
            placeholderTextColor={Colors.light.white}
          />
        </View>

        <Button variant="primary2" style={styles.button} title={t('next')} onPress={navigateToLogin} />

        <View style={styles.termsContainer}>
          <Logo />

          <ThemedText type="small" style={styles.support}>
            <Trans
              i18nKey="intro:support"
              components={[
                <ExternalLink
                  key="support"
                  href="mailto:support@um.app"
                  style={styles.supportLink}
                />,
              ]}
            />
          </ThemedText>

          <TermsText style={styles.terms} />
        </View>
      </View>
    </View>
  )
}

export default IntroScreen

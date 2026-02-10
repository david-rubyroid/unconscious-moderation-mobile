import { useRouter } from 'expo-router'

import { Trans, useTranslation } from 'react-i18next'
import { Image, ImageBackground, ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetCurrentUser } from '@/api/queries/auth'

import teamImage from '@/assets/images/the-team-at-um.webp'
import welcomeImage from '@/assets/images/welcome-to-your-journey.webp'

import { Button, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { moderateScale, scale, scaleWithMax, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(39),
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.7),
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  title: {
    textAlign: 'center',
    color: Colors.light.white,
    marginBottom: verticalScale(26),
  },
  description: {
    textAlign: 'center',
    color: Colors.light.white,
  },
  descriptionBold: {
    color: Colors.light.white,
    fontWeight: '700',
  },
  descriptionContainer: {
    position: 'relative',
    gap: verticalScale(20),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(19),
    paddingBottom: verticalScale(33),
    borderRadius: moderateScale(15),
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
    marginBottom: verticalScale(81),
  },
  teamImage: {
    position: 'absolute',
    bottom: verticalScale(-130),
    right: scale(10),
    width: scaleWithMax(199, 1.4),
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  medicalStatementContainer: {
    borderTopEndRadius: moderateScale(40),
    borderTopStartRadius: moderateScale(40),
    paddingHorizontal: scale(64),
    paddingVertical: verticalScale(80),
    backgroundColor: Colors.light.tertiaryBackground,
    alignItems: 'center',
  },
  medicalStatementTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(26),
  },
  medicalStatementText: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(22),
  },
})

function WelcomeToYourJourneyScreen() {
  const { replace, push } = useRouter()
  const { t } = useTranslation('welcome-to-your-journey')
  const { top } = useSafeAreaInsets()

  const { data: user } = useGetCurrentUser()

  const handleContinue = async () => {
    replace('/(private)/(tabs)')
    setTimeout(() => {
      push('/(private)/first-time-popups')
    }, 100)
  }

  return (
    <ImageBackground
      source={welcomeImage}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay}>
      </View>

      <ScrollView
        contentContainerStyle={[{ paddingTop: top + verticalScale(10) }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>{t('title')}</ThemedText>

        <View style={styles.container}>
          <View style={styles.descriptionContainer}>
            <ThemedText type="default" style={styles.description}>
              <Trans
                i18nKey="welcome-to-your-journey:description1"
                values={{ name: user?.firstName }}
                components={[
                  <ThemedText key="0" type="default" style={styles.descriptionBold} />,
                ]}
              />
            </ThemedText>

            <ThemedText type="default" style={styles.description}>
              <Trans
                i18nKey="welcome-to-your-journey:description2"
                components={[
                  <ThemedText key="0" type="default" style={styles.descriptionBold} />,
                ]}
              />
            </ThemedText>

            <ThemedText type="default" style={styles.description}>
              <Trans
                i18nKey="welcome-to-your-journey:description3"
                components={[
                  <ThemedText key="0" type="default" style={styles.descriptionBold} />,
                ]}
              />
            </ThemedText>

            <ThemedText type="default" style={styles.description}>
              <Trans
                i18nKey="welcome-to-your-journey:description4"
                components={[
                  <ThemedText key="0" type="default" style={styles.descriptionBold} />,
                ]}
              />
            </ThemedText>

            <ThemedText type="default" style={styles.description}>
              <Trans
                i18nKey="welcome-to-your-journey:description5"
                components={[
                  <ThemedText key="0" type="default" style={styles.descriptionBold} />,
                ]}
              />
            </ThemedText>

            <Image source={teamImage} style={styles.teamImage} />
          </View>
        </View>

        <View style={styles.medicalStatementContainer}>
          <ThemedText
            type="subtitle"
            style={styles.medicalStatementTitle}
          >
            {t('medicalStatement.title')}
          </ThemedText>

          <ThemedText
            type="default"
            style={styles.medicalStatementText}
          >
            {t('medicalStatement.text')}
          </ThemedText>

          <Button
            title={t('medicalStatement.button')}
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

export default WelcomeToYourJourneyScreen

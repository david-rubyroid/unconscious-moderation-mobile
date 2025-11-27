import { useRouter } from 'expo-router'

import { useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { Image, ImageBackground, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetCurrentUser } from '@/api/queries/auth'

import teamImage from '@/assets/images/the-team-at-um.png'
import welcomeImage from '@/assets/images/welcome-to-your-journey.jpg'

import { BottomSheetPopup, Button, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { moderateScale, scale, scaleWithMax, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  teamImage: {
    position: 'absolute',
    bottom: verticalScale(100),
    right: scale(50),
    width: scaleWithMax(199, 1.4),
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  medicalStatementContainer: {
    alignItems: 'center',
    gap: verticalScale(26),
  },
  medicalStatementTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  medicalStatementText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  medicalStatementButton: {
    marginTop: 'auto',
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
  },
})

function WelcomeToYourJourneyScreen() {
  const [showMedicalStatement, setShowMedicalStatement] = useState(false)

  const { replace } = useRouter()
  const { t } = useTranslation('welcome-to-your-journey')
  const { top, bottom } = useSafeAreaInsets()

  const { data: user } = useGetCurrentUser()

  const handleShowMedicalStatement = () => {
    setShowMedicalStatement(true)
  }

  const handleCloseMedicalStatement = () => {
    setShowMedicalStatement(false)
  }

  const handleContinue = () => {
    replace('/')
  }

  return (
    <ImageBackground
      source={welcomeImage}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay}>
      </View>

      <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
        <ThemedText type="title" style={styles.title}>{t('title')}</ThemedText>

        <View style={styles.descriptionContainer}>
          <ThemedText type="default" style={styles.description}>{t('description1', { name: user?.firstName })}</ThemedText>

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
        </View>

        <Image source={teamImage} style={styles.teamImage} />

        <Button
          style={styles.medicalStatementButton}
          fullWidth
          variant="secondary"
          title={t('continue')}
          onPress={handleShowMedicalStatement}
        />
      </View>

      <BottomSheetPopup
        onClose={handleCloseMedicalStatement}
        visible={showMedicalStatement}
      >
        <View style={styles.medicalStatementContainer}>
          <ThemedText
            style={styles.medicalStatementTitle}
            type="subtitle"
          >
            {t('medicalStatement.title')}
          </ThemedText>

          <ThemedText
            style={styles.medicalStatementText}
            type="default"
          >
            {t('medicalStatement.text')}
          </ThemedText>

          <Button
            fullWidth
            variant="primary"
            title={t('medicalStatement.button')}
            onPress={handleContinue}
          />
        </View>
      </BottomSheetPopup>
    </ImageBackground>
  )
}

export default WelcomeToYourJourneyScreen

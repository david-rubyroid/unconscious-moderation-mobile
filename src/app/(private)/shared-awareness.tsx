import { useRouter } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import {
  useGetUserFears,
  useGetUserGifts,
  useUpdateUser,
} from '@/api/queries/user'

import {
  AwarenessSection,
  Button,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { useAuth } from '@/context/auth/use'

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  title: {
    fontWeight: 700,
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  description: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  yourAnchorContainer: {
    gap: 10,
    padding: 17,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: 15,
  },
  yourAnchorTextBold: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  yourAnchorText: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: 400,
  },
  section: {
    gap: 25,
    padding: 16,
    borderRadius: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  button: {
    alignSelf: 'center',
    width: 233,
  },
})

function SharedAwarenessScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('questions')

  const { user } = useAuth()

  const { data: fears } = useGetUserFears()
  const { data: gifts } = useGetUserGifts()
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser()

  const anchor = user?.yourAnchor ?? ''

  const handleContinue = () => {
    updateUser({
      medicalQuestionsCompletedAt: new Date(),
    }, {
      onSuccess: () => {
        replace('/(private)/medical-report')
      },
    })
  }
  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <ThemedText
        style={styles.title}
        type="defaultSemiBold"
      >
        {t('shared-awareness-title')}
      </ThemedText>

      <ThemedText
        style={styles.description}
        type="default"
      >
        {t('shared-awareness-description')}
      </ThemedText>

      <View style={styles.yourAnchorContainer}>
        <ThemedText
          type="preSubtitle"
          style={styles.yourAnchorText}
        >
          <Trans
            i18nKey="questions:your-anchor"
            values={{ anchor }}
            components={[
              <ThemedText
                key="0"
                type="preSubtitle"
                style={styles.yourAnchorTextBold}
              />,
            ]}
          />
        </ThemedText>
      </View>

      <View style={styles.section}>
        <AwarenessSection
          title={t('shared-awareness-gifts')}
          items={gifts}
        />
        <AwarenessSection
          title={t('shared-awareness-fears')}
          items={fears}
        />
      </View>

      <Button
        loading={isUpdatingUser}
        disabled={isUpdatingUser}
        style={styles.button}
        title={t('shared-awareness-button')}
        onPress={handleContinue}
      />
    </ScreenContainer>
  )
}

export default SharedAwarenessScreen

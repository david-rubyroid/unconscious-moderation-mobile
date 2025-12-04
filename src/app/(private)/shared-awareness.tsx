import { useRouter } from 'expo-router'

import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetUserFears, useGetUserGifts, useUpdateUser } from '@/api/queries/user'

import { Button, ThemedGradient, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 21,
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: 700,
    marginBottom: 22,
  },
  description: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: 20,
  },
  section: {
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 25,
  },
  sectionContent: {
    gap: 12,
    flex: 1,
    width: '48%',
  },
  sectionTitle: {
    color: Colors.light.primary,
    fontWeight: 700,
    fontSize: 20,
    textAlign: 'center',
  },
  sectionItem: {
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  sectionItemText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    width: 233,
  },
})

function SharedAwarenessScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('questions')
  const { top, bottom } = useSafeAreaInsets()

  const { data: fears } = useGetUserFears()
  const { data: gifts } = useGetUserGifts()
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser()

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
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }, styles.container]}>
      <ThemedText style={styles.title} type="defaultSemiBold">{t('shared-awareness-title')}</ThemedText>

      <ThemedText style={styles.description} type="default">{t('shared-awareness-description')}</ThemedText>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <ThemedText
              type="defaultSemiBold"
              style={styles.sectionTitle}
            >
              {t('shared-awareness-gifts')}
            </ThemedText>

            {gifts?.map(({ gift, id }) => (
              <View style={styles.sectionItem} key={id}>
                <ThemedText style={styles.sectionItemText} type="default">{t(gift)}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.sectionContent}>
            <ThemedText
              type="defaultSemiBold"
              style={styles.sectionTitle}
            >
              {t('shared-awareness-fears')}
            </ThemedText>

            {fears?.map(({ fear, id }) => (
              <View style={styles.sectionItem} key={id}>
                <ThemedText style={styles.sectionItemText} type="default">{t(fear)}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          loading={isUpdatingUser}
          disabled={isUpdatingUser}
          style={styles.button}
          title={t('shared-awareness-button')}
          onPress={handleContinue}
        />
      </View>
    </ThemedGradient>

  )
}

export default SharedAwarenessScreen

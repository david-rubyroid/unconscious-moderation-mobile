import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useGetCurrentUser } from '@/api/queries/auth'
import { useUserFearsAdd } from '@/api/queries/user'

import {
  Button,
  Header,
  Modal,
  PremiumPlanButton,
  ScreenContainer,
  TextInput,
  ThemedText,
} from '@/components'

import { FEARS } from '@/constants/gifts-and-fears'
import { Colors, withOpacity } from '@/constants/theme'

import {
  moderateScale,
  scale,
  scaleWithMax,
  verticalScale,
} from '@/utils/responsive'

const styles = StyleSheet.create({
  scrollContent: {
    gap: verticalScale(22),
  },
  section: {
    padding: scale(16),
    borderRadius: moderateScale(10),
    gap: verticalScale(20),
    backgroundColor: Colors.light.white,
  },
  sectionTitle: {
    textAlign: 'center',
    color: Colors.light.primary,
    fontWeight: 700,
  },
  sectionContent: {
    gap: scale(12),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sectionItem: {
    minHeight: verticalScale(56),
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(12),
    borderRadius: moderateScale(10),
    backgroundColor: Colors.light.tertiaryBackground,
  },
  sectionItemSelected: {
    backgroundColor: Colors.light.primary4,
  },
  lastItem: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sectionItemText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  sectionItemSelectedText: {
    color: Colors.light.white,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(22),
  },
  button: {
    width: scaleWithMax(233, 1.3),
  },
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(30),
  },
  input: {
    borderWidth: 0,
    backgroundColor: Colors.light.white,
    color: withOpacity(Colors.light.black, 0.50),
    marginBottom: verticalScale(30),
  },
  modalButtonContainer: {
    alignItems: 'center',
  },
})

function EditFearsScreen() {
  const { back } = useRouter()
  const { t } = useTranslation('questions')
  const { t: tProfile } = useTranslation('profile')

  const { data: user } = useGetCurrentUser()
  const { mutate: updateFears, isPending: isUpdatingFears } = useUserFearsAdd()

  const [selectedFears, setSelectedFears] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [newOther, setNewOther] = useState('')
  const [others, setOthers] = useState<string[]>([])

  const allPredefinedFears = useMemo(() => {
    return FEARS.map(item => item.value)
  }, [])

  useEffect(() => {
    if (user?.fears) {
      const fearValues = user.fears.map(f => f.fear)
      setSelectedFears(fearValues)

      const customFears = fearValues.filter(
        fear => !allPredefinedFears.includes(fear),
      )
      setOthers(customFears)
    }
  }, [user?.fears, allPredefinedFears])

  const handleSelectFear = (fear: string) => {
    setSelectedFears((prev) => {
      if (prev.includes(fear)) {
        return prev.filter(item => item !== fear)
      }

      return [...prev, fear]
    })
  }

  const handleSaveOther = (newOther: string) => {
    setOthers((prev) => {
      return [...prev, newOther]
    })
    setSelectedFears((prev) => {
      return [...prev, newOther]
    })
    setNewOther('')
    setModalVisible(false)
  }

  const handleSave = () => {
    updateFears({ fears: selectedFears }, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: tProfile('success'),
          text2: tProfile('fears-updated-successfully'),
        })
        back()
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: tProfile('error'),
          text2: tProfile('failed-to-update-fears'),
        })
      },
    })
  }

  const fears = useMemo(() => {
    return FEARS.map(item => (
      {
        label: t(item.label),
        value: item.value,
      }
    ))
  }, [t])

  const gradientColors = Colors.light.profileScreenGradient

  return (
    <ScreenContainer gradientColors={gradientColors}>
      <Header title={tProfile('edit-fears-title')} />

      <PremiumPlanButton />

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          <View style={styles.section}>
            <ThemedText
              style={styles.sectionTitle}
              type="defaultSemiBold"
            >
              {t('here-are-some-common-fears')}
            </ThemedText>

            <View style={styles.sectionContent}>
              {fears.map((item, index) => (
                <Pressable
                  style={[
                    styles.sectionItem,
                    index === fears.length - 1 && styles.lastItem,
                    selectedFears.includes(item.value) && styles.sectionItemSelected,
                  ]}
                  key={item.value}
                  onPress={() => handleSelectFear(item.value)}
                >
                  <ThemedText style={[
                    styles.sectionItemText,
                    selectedFears.includes(item.value) && styles.sectionItemSelectedText,
                  ]}
                  >
                    {item.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText
              style={styles.sectionTitle}
              type="defaultSemiBold"
            >
              {t('Others')}
            </ThemedText>

            <View style={styles.sectionContent}>
              {others.map((item, index) => (
                <Pressable
                  style={[
                    styles.sectionItem,
                    index === others.length - 1 && styles.lastItem,
                    selectedFears.includes(item) && styles.sectionItemSelected,
                  ]}
                  key={item}
                  onPress={() => handleSelectFear(item)}
                >
                  <ThemedText style={[
                    styles.sectionItemText,
                    selectedFears.includes(item) && styles.sectionItemSelectedText,
                  ]}
                  >
                    {item}
                  </ThemedText>
                </Pressable>
              ))}

              <Pressable
                style={styles.sectionItem}
                onPress={() => setModalVisible(true)}
              >
                <ThemedText style={styles.sectionItemText}>{t('type-here')}</ThemedText>
              </Pressable>

              {others.length === 0 && (
                <Pressable
                  style={styles.sectionItem}
                  onPress={() => setModalVisible(true)}
                >
                  <ThemedText style={styles.sectionItemText}>{t('type-here')}</ThemedText>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          disabled={isUpdatingFears}
          loading={isUpdatingFears}
          style={styles.button}
          title={t('save')}
          onPress={handleSave}
        />
      </View>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ThemedText type="subtitle" style={styles.modalTitle}>{t('add-other')}</ThemedText>
        <TextInput
          placeholder={t('type-here')}
          style={styles.input}
          value={newOther}
          onChangeText={setNewOther}
        />

        <View style={styles.modalButtonContainer}>
          <Button
            title={t('save')}
            disabled={!newOther.trim()}
            onPress={() => handleSaveOther(newOther)}
          />
        </View>
      </Modal>
    </ScreenContainer>
  )
}

export default EditFearsScreen

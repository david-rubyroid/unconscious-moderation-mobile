import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useGetCurrentUser } from '@/api/queries/auth'
import { useUserGiftsAdd } from '@/api/queries/user'

import {
  Button,
  Header,
  Modal,
  PremiumPlanButton,
  ScreenContainer,
  TextInput,
  ThemedText,
} from '@/components'

import {
  LIFESTYLE_UPGRADES,
  MENTAL_EMOTIONAL_CLARITY,
  PHYSICAL_EMOTIONAL_BENEFITS,
} from '@/constants/gifts-and-fears'
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

function EditGiftsScreen() {
  const { back } = useRouter()
  const { t } = useTranslation('questions')
  const { t: tProfile } = useTranslation('profile')

  const { data: user } = useGetCurrentUser()
  const { mutate: updateGifts, isPending: isUpdatingGifts } = useUserGiftsAdd()

  const [selectedGifts, setSelectedGifts] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [newOther, setNewOther] = useState('')
  const [others, setOthers] = useState<string[]>([])

  const allPredefinedGifts = useMemo(() => {
    return [
      ...MENTAL_EMOTIONAL_CLARITY.map(item => item.value),
      ...PHYSICAL_EMOTIONAL_BENEFITS.map(item => item.value),
      ...LIFESTYLE_UPGRADES.map(item => item.value),
    ]
  }, [])

  useEffect(() => {
    if (user?.gifts) {
      const giftValues = user.gifts.map(g => g.gift)
      setSelectedGifts(giftValues)

      const customGifts = giftValues.filter(
        gift => !allPredefinedGifts.includes(gift),
      )
      setOthers(customGifts)
    }
  }, [user?.gifts, allPredefinedGifts])

  const handleSelectGift = (gift: string) => {
    setSelectedGifts((prev) => {
      if (prev.includes(gift)) {
        return prev.filter(item => item !== gift)
      }

      return [...prev, gift]
    })
  }

  const handleSaveOther = (newOther: string) => {
    setOthers((prev) => {
      return [...prev, newOther]
    })
    setSelectedGifts((prev) => {
      return [...prev, newOther]
    })
    setNewOther('')
    setModalVisible(false)
  }

  const handleSave = () => {
    updateGifts({ gifts: selectedGifts }, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: tProfile('success'),
          text2: tProfile('gifts-updated-successfully'),
        })
        back()
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: tProfile('error'),
          text2: tProfile('failed-to-update-gifts'),
        })
      },
    })
  }

  const mentalEmotionalClarity = useMemo(() => {
    return MENTAL_EMOTIONAL_CLARITY.map(item => (
      {
        label: t(item.label),
        value: item.value,
      }
    ))
  }, [t])

  const physicalEmotionalBenefits = useMemo(() => {
    return PHYSICAL_EMOTIONAL_BENEFITS.map(item => (
      {
        label: t(item.label),
        value: item.value,
      }
    ))
  }, [t])

  const lifestyleUpgrades = useMemo(() => {
    return LIFESTYLE_UPGRADES.map(item => (
      {
        label: t(item.label),
        value: item.value,
      }
    ))
  }, [t])

  const gradientColors = Colors.light.profileScreenGradient

  return (
    <ScreenContainer gradientColors={gradientColors}>
      <Header title={tProfile('edit-gifts-title')} />

      <PremiumPlanButton />

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          <View style={styles.section}>
            <ThemedText
              style={styles.sectionTitle}
              type="defaultSemiBold"
            >
              {t('mental-emotional-clarity')}
            </ThemedText>

            <View style={styles.sectionContent}>
              {mentalEmotionalClarity.map((item, index) => (
                <Pressable
                  style={[
                    styles.sectionItem,
                    index === mentalEmotionalClarity.length - 1 && styles.lastItem,
                    selectedGifts.includes(item.value) && styles.sectionItemSelected,
                  ]}
                  key={item.value}
                  onPress={() => handleSelectGift(item.value)}
                >
                  <ThemedText style={[
                    styles.sectionItemText,
                    selectedGifts.includes(item.value) && styles.sectionItemSelectedText,
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
              {t('physical-emotional-benefits')}
            </ThemedText>

            <View style={styles.sectionContent}>
              {physicalEmotionalBenefits.map((item, index) => (
                <Pressable
                  style={[
                    styles.sectionItem,
                    index === physicalEmotionalBenefits.length - 1 && styles.lastItem,
                    selectedGifts.includes(item.value) && styles.sectionItemSelected,
                  ]}
                  key={item.value}
                  onPress={() => handleSelectGift(item.value)}
                >
                  <ThemedText style={[
                    styles.sectionItemText,
                    selectedGifts.includes(item.value) && styles.sectionItemSelectedText,
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
              {t('lifestyle-upgrades')}
            </ThemedText>

            <View style={styles.sectionContent}>
              {lifestyleUpgrades.map((item, index) => (
                <Pressable
                  style={[
                    styles.sectionItem,
                    index === lifestyleUpgrades.length - 1 && styles.lastItem,
                    selectedGifts.includes(item.value) && styles.sectionItemSelected,
                  ]}
                  key={item.value}
                  onPress={() => handleSelectGift(item.value)}
                >
                  <ThemedText style={[
                    styles.sectionItemText,
                    selectedGifts.includes(item.value) && styles.sectionItemSelectedText,
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
                    selectedGifts.includes(item) && styles.sectionItemSelected,
                  ]}
                  key={item}
                  onPress={() => handleSelectGift(item)}
                >
                  <ThemedText style={[
                    styles.sectionItemText,
                    selectedGifts.includes(item) && styles.sectionItemSelectedText,
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
          disabled={isUpdatingGifts}
          loading={isUpdatingGifts}
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

export default EditGiftsScreen

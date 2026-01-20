import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Toast from 'react-native-toast-message'

import { useUserGiftsAdd } from '@/api/queries/user'

import { Button, Modal, TextInput, ThemedGradient, ThemedText } from '@/components'

import { LIFESTYLE_UPGRADES, MENTAL_EMOTIONAL_CLARITY, PHYSICAL_EMOTIONAL_BENEFITS } from '@/constants/gifts-and-fears'

import { Colors, withOpacity } from '@/constants/theme'
import { moderateScale, scale, scaleWithMax, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(22),
    fontWeight: 400,
  },
  titleBold: {
    color: Colors.light.primary4,
    fontWeight: 700,
  },
  gifts: {
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

function GiftsScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('questions')
  const { top, bottom } = useSafeAreaInsets()

  const { mutate: addGifts, isPending: isAddingGifts } = useUserGiftsAdd()

  const [selectedGifts, setSelectedGifts] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState(false)

  // Others
  const [newOther, setNewOther] = useState('')
  const [others, setOthers] = useState<string[]>([])

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
  const handleContinue = () => {
    addGifts({ gifts: selectedGifts }, {
      onSuccess: () => {
        replace('/(private)/fears')
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: t('error-title'),
          text2: t('error-description'),
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

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }, styles.container]}>
      <ThemedText style={styles.title} type="defaultSemiBold">
        <Trans
          i18nKey="questions:why-do-you-want-to-change-your-drinking-habits"
          components={[
            <ThemedText key="0" style={styles.titleBold} type="defaultSemiBold" />,
            <ThemedText key="1" style={styles.titleBold} type="defaultSemiBold" />,
          ]}
        />
      </ThemedText>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.gifts}>
          <View style={styles.section}>
            <ThemedText
              style={styles.sectionTitle}
              type="defaultSemiBold"
            >
              {t('mental-emotional-clarity')}
            </ThemedText>

            <View style={styles.sectionContent}>
              {mentalEmotionalClarity.map((item, index) => (
                <TouchableOpacity
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
                </TouchableOpacity>
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
                <TouchableOpacity
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
                </TouchableOpacity>
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
                <TouchableOpacity
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
                </TouchableOpacity>
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
                <TouchableOpacity
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
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.sectionItem}
                onPress={() => setModalVisible(true)}
              >
                <ThemedText style={styles.sectionItemText}>{t('type-here')}</ThemedText>
              </TouchableOpacity>

              {others.length === 0 && (
                <TouchableOpacity
                  style={styles.sectionItem}
                  onPress={() => setModalVisible(true)}
                >
                  <ThemedText style={styles.sectionItemText}>{t('type-here')}</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          disabled={isAddingGifts}
          loading={isAddingGifts}
          style={styles.button}
          title={t('save')}
          onPress={handleContinue}
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
    </ThemedGradient>
  )
}

export default GiftsScreen

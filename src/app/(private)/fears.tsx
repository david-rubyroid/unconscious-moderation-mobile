import { useRouter } from 'expo-router'

import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { useUserFearsAdd } from '@/api/queries/user'

import { Button, Modal, TextInput, ThemedGradient, ThemedText } from '@/components'

import { FEARS } from '@/constants/gifts-and-fears'
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

function FearsScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('questions')
  const { top, bottom } = useSafeAreaInsets()

  const [selectedFears, setSelectedFears] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState(false)

  // Others
  const [newOther, setNewOther] = useState('')
  const [others, setOthers] = useState<string[]>([])

  const { mutate: addFears, isPending: isAddingFears } = useUserFearsAdd()

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
  const fears = useMemo(() => {
    return FEARS.map(item => (
      {
        label: t(item.label),
        value: item.value,
      }
    ))
  }, [t])

  const handleSaveFears = () => {
    addFears({ fears: selectedFears }, {
      onSuccess: () => {
        replace('/(private)/shared-awareness')
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: t('error-title-fears'),
          text2: t('error-description-fears'),
        })
      },
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }, styles.container]}>
      <ThemedText style={styles.title} type="defaultSemiBold">
        <Trans
          i18nKey="questions:opening-up-is-a-way-to-heal-let-us-know-what-fears-do-you-have-before-starting-this-new-path"
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
              {t('here-are-some-common-fears')}
            </ThemedText>

            <View style={styles.sectionContent}>
              {fears.map((item, index) => (
                <TouchableOpacity
                  style={[
                    styles.sectionItem,
                    index === fears.length - 1 && styles.lastItem,
                    selectedFears.includes(item.value) && styles.sectionItemSelected,
                  ]}
                  key={item.value}
                  onPress={() => handleSelectFear(item.value)}
                >
                  <ThemedText style={[styles.sectionItemText, selectedFears.includes(item.value) && styles.sectionItemSelectedText]}>{item.label}</ThemedText>
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
          disabled={isAddingFears}
          loading={isAddingFears}
          style={styles.button}
          title={t('save')}
          onPress={handleSaveFears}
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

export default FearsScreen

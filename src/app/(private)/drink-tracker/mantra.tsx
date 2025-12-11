import { MaterialIcons } from '@expo/vector-icons'

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { useUpdateDrinkSession } from '@/api/queries/drink-session'

import { useCreateMantra, useDeleteMantra, useGetMantras } from '@/api/queries/mantras'

import mantraBackgroundImage from '@/assets/images/mantra.jpg'

import {
  Button,
  Checkbox,
  Header,
  Modal,
  TextInput,
  ThemedGradient,
  ThemedText,
} from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(15),
  },
  title: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(21),
  },
  backgroundImage: {
    padding: scale(25),
    borderRadius: scale(20),
    overflow: 'hidden',
    marginBottom: verticalScale(21),
  },
  backgroundImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
  },
  backgroundImageDescription: {
    color: Colors.light.white,
    textAlign: 'center',
    fontWeight: '400',
  },
  mantrasTitle: {
    color: Colors.light.primary4,
  },
  textInput: {
    color: Colors.light.primary4,
    borderColor: withOpacity(Colors.light.black, 0.1),
    backgroundColor: 'transparent',
  },
  mantrasContainer: {
    width: '100%',
    alignItems: 'flex-start',
    gap: verticalScale(15),
    marginBottom: verticalScale(21),
  },
  createMantraContainer: {
    gap: verticalScale(11),
    marginBottom: verticalScale(21),
  },
  myMantraContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalContainer: {
    alignItems: 'center',
    gap: verticalScale(30),
  },
  modalTitle: {
    color: Colors.light.primary4,
    textAlign: 'center',
  },
  modalTextInput: {
    color: Colors.light.primary4,
    borderColor: Colors.light.white,
    backgroundColor: Colors.light.white,
  },
  didYouKnowContainer: {
    borderRadius: scale(20),
    backgroundColor: withOpacity(Colors.light.primary, 0.9),
    paddingHorizontal: scale(28),
    paddingVertical: verticalScale(15),
  },
  didYouKnowTitle: {
    color: Colors.light.white,
  },
  didYouKnowDescription: {
    color: Colors.light.white,
    fontWeight: '400',
  },
  button: {
    marginTop: verticalScale(20),
  },
})

function MantraScreen() {
  const { sessionId } = useLocalSearchParams()
  const { back } = useRouter()
  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))
  const [modalVisible, setModalVisible] = useState(false)
  const [newMantra, setNewMantra] = useState('')
  const [selectedMantra, setSelectedMantra] = useState('')

  const { t } = useTranslation('mantra')
  const { top, bottom } = useSafeAreaInsets()

  const { data: mantras } = useGetMantras()
  const { mutateAsync: createMantra } = useCreateMantra()
  const { mutateAsync: deleteMantra } = useDeleteMantra()

  const isMantraSelected = Boolean(selectedMantra)

  const handleSelectMantra = (mantra: string) => {
    setSelectedMantra(mantra)
  }
  const handleCreateMantra = () => {
    setModalVisible(true)
  }
  const handleSaveMantra = () => {
    createMantra(newMantra, {
      onSuccess: () => {
        setModalVisible(false)
        setNewMantra('')
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: t('error-creating-mantra'),
          text2: t('error-creating-mantra'),
        })
      },
    })
  }
  const handleDeleteMantra = (id: number) => {
    deleteMantra(id)
  }
  const handleCloseModal = () => {
    setModalVisible(false)
    setNewMantra('')
  }
  const handleUpdateDrinkSession = () => {
    updateDrinkSession({
      mantra: selectedMantra,
    }, {
      onSuccess: () => {
        back()
      },
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <ThemedText
            type="preSubtitle"
            style={styles.title}
          >
            {t('choose-your-mantra')}
          </ThemedText>

          <ImageBackground source={mantraBackgroundImage} style={styles.backgroundImage}>
            <View style={styles.backgroundImageOverlay} />

            <ThemedText type="defaultSemiBold" style={styles.backgroundImageDescription}>
              {t('choose-your-mantra-description')}
            </ThemedText>
          </ImageBackground>

          <View style={styles.mantrasContainer}>
            <ThemedText type="defaultSemiBold" style={styles.mantrasTitle}>
              {t('curated-mantras')}
            </ThemedText>

            <Checkbox
              label={`${t('im-doing-just-fine')} ${t('recommended')}`}
              checked={selectedMantra === t('im-doing-just-fine')}
              onToggle={() => handleSelectMantra(t('im-doing-just-fine'))}
            />
            <Checkbox
              label={t('i-drink-with-clarity-and-intention')}
              checked={selectedMantra === t('i-drink-with-clarity-and-intention')}
              onToggle={() => handleSelectMantra(t('i-drink-with-clarity-and-intention'))}
            />
            <Checkbox
              label={t('i-trust-myself')}
              checked={selectedMantra === t('i-trust-myself')}
              onToggle={() => handleSelectMantra(t('i-trust-myself'))}
            />
          </View>

          <View style={styles.createMantraContainer}>
            <ThemedText type="defaultSemiBold" style={styles.mantrasTitle}>
              {t('my-mantras')}
            </ThemedText>

            <Pressable onPress={handleCreateMantra}>
              <TextInput
                placeholder={t('type-here')}
                style={styles.textInput}
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
          </View>

          {mantras && mantras.length > 0 && (
            <View style={styles.mantrasContainer}>
              {mantras?.map(({ id, mantra }) => (
                <View key={id} style={styles.myMantraContainer}>
                  <Checkbox
                    key={id}
                    label={mantra}
                    checked={selectedMantra === mantra}
                    onToggle={() => handleSelectMantra(mantra)}
                  />

                  <Pressable onPress={() => handleDeleteMantra(id)}>
                    <MaterialIcons name="delete" size={scale(24)} color={Colors.light.gray1} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <View style={styles.didYouKnowContainer}>
            <ThemedText type="defaultSemiBold" style={styles.didYouKnowTitle}>
              {t('did-you-know')}
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.didYouKnowDescription}>
              {t('did-you-know-description')}
            </ThemedText>
          </View>
        </ScrollView>

        <Button
          disabled={!isMantraSelected}
          style={styles.button}
          variant="secondary"
          title={t('done')}
          onPress={handleUpdateDrinkSession}
        />
      </View>

      <Modal visible={modalVisible} onClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {t('my-mantras')}
          </ThemedText>

          <TextInput
            placeholder={t('type-here')}
            style={styles.modalTextInput}
            value={newMantra}
            onChangeText={setNewMantra}
          />

          <Button
            title={t('save')}
            onPress={handleSaveMantra}
          />
        </View>
      </Modal>
    </ThemedGradient>
  )
}

export default MantraScreen

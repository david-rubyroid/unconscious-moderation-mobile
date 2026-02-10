import { MaterialIcons } from '@expo/vector-icons'

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import { useUpdateDrinkSession } from '@/api/queries/drink-session'
import { useCreateMantra, useDeleteMantra, useGetMantras } from '@/api/queries/mantras'

import mantraBackgroundImage from '@/assets/images/mantra.webp'

import {
  Button,
  Checkbox,
  Header,
  Modal,
  ScreenContainer,
  TextInput,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { getErrorMessage } from '@/utils/error-handler'
import { scale, verticalScale } from '@/utils/responsive'
import { showErrorToast } from '@/utils/toast'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: verticalScale(21),
  },
  title: {
    color: Colors.light.primary4,
  },
  backgroundImage: {
    padding: scale(25),
    borderRadius: scale(20),
    overflow: 'hidden',
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
  },
  createMantraContainer: {
    gap: verticalScale(11),
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
})

function MantraScreen() {
  const { back } = useRouter()
  const { sessionId } = useLocalSearchParams()

  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))

  const [newMantra, setNewMantra] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedMantra, setSelectedMantra] = useState('')

  const { t } = useTranslation('mantra')

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
    createMantra({
      mantra: newMantra,
    }, {
      onSuccess: () => {
        setModalVisible(false)
        setNewMantra('')
      },
      onError: (error) => {
        setModalVisible(false)
        showErrorToast(t('error-creating-mantra'), getErrorMessage(error))
      },
    })
  }
  const handleDeleteMantra = (id: number) => {
    deleteMantra({ id }, {
      onSuccess: () => {
        setSelectedMantra('')
      },
      onError: (error) => {
        showErrorToast(t('error-deleting-mantra'), getErrorMessage(error))
      },
    })
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
    <ScreenContainer contentContainerStyle={styles.container}>
      <Header title={t('title')} />

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
            placeholder={t('create-a-new-one')}
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
                <MaterialIcons
                  name="delete"
                  size={scale(24)}
                  color={Colors.light.gray1}
                />
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

      <Button
        disabled={!isMantraSelected}
        variant="secondary"
        title={t('done')}
        onPress={handleUpdateDrinkSession}
      />

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
            disabled={!newMantra}
            onPress={handleSaveMantra}
          />
        </View>
      </Modal>
    </ScreenContainer>
  )
}

export default MantraScreen

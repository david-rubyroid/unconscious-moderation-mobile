import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'

import { useUpdateDrinkSession } from '@/api/queries/drink-session'

import AlertIcon from '@/assets/icons/alert'
import DropIcon from '@/assets/icons/drop'
import preDrinkHydrationImage from '@/assets/images/pre-drink-hydration.jpg'

import { Button, Header, Modal, ScreenContainer, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: verticalScale(25),
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  description: {
    textAlign: 'center',
    fontWeight: 400,
    color: Colors.light.primary4,
  },
  imageBackground: {
    paddingVertical: verticalScale(17),
    paddingHorizontal: scale(40),
    borderRadius: scale(20),
    overflow: 'hidden',
    gap: verticalScale(10),
  },
  imageBackgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
  },
  imageBackgroundText: {
    textAlign: 'center',
    color: Colors.light.white,
    fontWeight: '400',
  },
  imageBackgroundTextBold: {
    color: Colors.light.white,
    fontWeight: '700',
  },
  bonusText: {
    fontWeight: '400',
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  bonusTextBold: {
    fontWeight: '700',
    color: Colors.light.primary4,
  },
  modalContainer: {
    alignItems: 'center',
    gap: verticalScale(24),
  },
  modalText: {
    color: Colors.light.primary4,
    textAlign: 'center',
    fontWeight: '400',
  },
  modalTextBold: {
    fontWeight: '700',
    color: Colors.light.primary4,
  },
})

function PreDrinkHydrationScreen() {
  const { back } = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const { t } = useTranslation('hydration')

  const { sessionId } = useLocalSearchParams()

  const { mutate: updateDrinkSession } = useUpdateDrinkSession(Number(sessionId))

  const handleModalClose = () => {
    setModalVisible(false)
  }
  const handleModalOpen = () => {
    setModalVisible(true)
  }
  const handleUpdateDrinkSession = () => {
    updateDrinkSession({
      hydrated: true,
    }, {
      onSuccess: () => {
        back()
      },
    })
  }

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <Header title={t('title')} />

      <DropIcon />

      <View style={styles.descriptionContainer}>
        <ThemedText type="preSubtitle" style={styles.description}>
          {t('description')}
        </ThemedText>

        <Pressable
          onPress={handleModalOpen}
        >
          <AlertIcon />
        </Pressable>
      </View>

      <ImageBackground
        source={preDrinkHydrationImage}
        style={styles.imageBackground}
      >
        <View style={styles.imageBackgroundOverlay} />

        <ThemedText type="defaultSemiBold" style={styles.imageBackgroundText}>
          <Trans
            i18nKey="hydration:drink-at-least-2-glasses-of-water"
            components={[
              <ThemedText type="defaultSemiBold" key="0" style={styles.imageBackgroundTextBold} />,
            ]}
          />
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.imageBackgroundText}>
          <Trans
            i18nKey="hydration:already-drinking"
            components={[
              <ThemedText type="defaultSemiBold" key="0" style={styles.imageBackgroundTextBold} />,
            ]}
          />
        </ThemedText>
      </ImageBackground>

      <ThemedText type="defaultSemiBold" style={styles.bonusText}>
        <Trans
          i18nKey="hydration:bonus-water-with-electrolytes"
          components={[
            <ThemedText type="defaultSemiBold" key="0" style={styles.bonusTextBold} />,
            <ThemedText type="defaultSemiBold" key="1" style={styles.bonusTextBold} />,
          ]}
        />
      </ThemedText>

      <Button title={t('i-ve-hydrated')} onPress={handleUpdateDrinkSession} />

      <Modal
        visible={modalVisible}
        onClose={handleModalClose}
        children={(
          <View style={styles.modalContainer}>
            <AlertIcon transform={[{ scale: 2.5 }]} />

            <ThemedText type="defaultSemiBold" style={styles.modalText}>
              <Trans
                i18nKey="hydration:research-confirms-what-many-suspect"
                components={[
                  <ThemedText type="defaultSemiBold" key="0" style={styles.modalTextBold} />,
                ]}
              />
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.modalText}>
              <Trans
                i18nKey="hydration:pre-hydrating-with-water"
                components={[
                  <ThemedText type="defaultSemiBold" key="0" style={styles.modalTextBold} />,
                ]}
              />
            </ThemedText>

            <Button title={t('got-it')} onPress={handleModalClose} />
          </View>
        )}
      />

    </ScreenContainer>
  )
}

export default PreDrinkHydrationScreen

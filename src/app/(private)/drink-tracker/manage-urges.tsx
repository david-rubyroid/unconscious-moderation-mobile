import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useGetDrinkSession } from '@/api/queries/drink-session'

import AlertIcon from '@/assets/icons/alert'
import boxBreathingImage from '@/assets/images/manage-urge/box-breathing.webp'
import quickWritingImage from '@/assets/images/manage-urge/quick-writing.webp'
import selfHypnosisImage from '@/assets/images/manage-urge/self-hypnosis.webp'
import manageUrgeVideoImage from '@/assets/images/manage-urge/urge.webp'

import {
  Button,
  CountdownTimer,
  Header,
  Modal,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { HYPNOSIS_LINKS } from '@/constants/hypnosis-links'

import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(24),
  },
  rememberText: {
    color: Colors.light.primary4,
    textAlign: 'center',
  },
  exercisesContainer: {
    flexDirection: 'row',
    gap: scale(15),
  },
  exerciseItem: {
    width: 211,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  exerciseItemImage: {
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    height: 118,
    width: '100%',
    resizeMode: 'cover',
  },
  exerciseItemContent: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(18),
  },
  exerciseItemTitle: {
    overflow: 'hidden',
    color: Colors.light.primary4,
  },
  exerciseItemDescription: {
    fontWeight: '400',
    color: Colors.light.primary4,
  },
  manageUrgesContainer: {
    flexDirection: 'row',
    gap: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(20),
    paddingRight: scale(35),
    alignSelf: 'center',
    backgroundColor: withOpacity(Colors.light.white, 0.8),
  },
  manageUrgesImage: {
    borderTopLeftRadius: scale(20),
    borderBottomLeftRadius: scale(20),
    width: 73,
    height: 71,
    resizeMode: 'cover',
  },
  manageUrgesTitle: {
    color: Colors.light.error2,
  },
  button: {
    alignSelf: 'center',
  },
  countdownTimerContainer: {
    flexDirection: 'row',
    gap: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(20),
  },
  countdownTimerDescriptionContainer: {
    gap: verticalScale(10),
  },
  why20MinContainer: {
    paddingVertical: verticalScale(8),
    backgroundColor: Colors.light.white,
    borderRadius: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(10),
  },
  takeABreakContainer: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(18),
    backgroundColor: Colors.light.white,
    borderRadius: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.light.primary4,
  },
  textBold: {
    fontWeight: '700',
    color: Colors.light.primary4,
  },
  manageUrgesDescription: {
    fontWeight: 400,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  manageUrgesDescriptionBold: {
    fontWeight: '700',
    color: Colors.light.primary,
  },
  modalContainer: {
    gap: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    color: Colors.light.primary4,
    textAlign: 'center',
  },
  modalDescription: {
    fontWeight: '400',
    color: Colors.light.primary4,
    textAlign: 'center',
  },
})

function ManageUrgesScreen() {
  const { push, back } = useRouter()

  const { t } = useTranslation('manage-urges')
  const { sessionId } = useLocalSearchParams()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))

  const openModal = () => {
    setIsModalVisible(true)
  }
  const closeModal = () => {
    setIsModalVisible(false)
  }
  const navigateToBoxBreathing = () => {
    push('/box-breathing')
  }
  const navigateToManageUrges = () => {
    push('/urge-surfing-meditation')
  }
  const navigateToQuickWriting = () => {
    push({
      pathname: '/drink-tracker/quick-writing',
      params: { sessionId },
    })
  }
  const navigateToSelfHypnosis = () => {
    push({
      pathname: '/drink-tracker/hypnosis-self',
      params: {
        sessionId,
        hypnosisLink: HYPNOSIS_LINKS.selfHypnosis,
      },
    })
  }

  return (
    <ScreenContainer horizontalPadding={13}>
      <Header marginBottom={15} title={t('title')} />

      <View style={styles.container}>
        <ThemedText type="preSubtitle" style={styles.rememberText}>
          {t('remember', { mantra: drinkSession?.mantra || 'I\'m doing just fine!' })}
        </ThemedText>

        <View style={styles.countdownTimerContainer}>
          <CountdownTimer />

          <View style={styles.countdownTimerDescriptionContainer}>
            <View style={styles.takeABreakContainer}>
              <ThemedText style={styles.text}>
                <Trans
                  i18nKey="manage-urges:take-a-break"
                  components={[
                    <ThemedText key="0" style={styles.textBold} />,
                  ]}
                />
              </ThemedText>
            </View>

            <View style={styles.why20MinContainer}>
              <ThemedText style={styles.textBold}>
                {t('why-20-min')}
              </ThemedText>

              <Pressable onPress={openModal}>
                <AlertIcon width={13} height={13} />
              </Pressable>
            </View>
          </View>
        </View>

        <ThemedText type="defaultSemiBold" style={styles.manageUrgesDescription}>
          <Trans
            i18nKey="manage-urges:manage-urges-description"
            components={[
              <ThemedText key="0" type="defaultSemiBold" style={styles.manageUrgesDescriptionBold} />,
            ]}
          />
        </ThemedText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exercisesContainer}
        >
          <Pressable style={styles.exerciseItem} onPress={navigateToBoxBreathing}>
            <Image style={styles.exerciseItemImage} source={boxBreathingImage} />
            <View style={styles.exerciseItemContent}>
              <ThemedText type="defaultSemiBold" style={styles.exerciseItemTitle}>
                {t('box-breathing')}
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.exerciseItemDescription}>
                {t('box-breathing-description')}
              </ThemedText>
            </View>
          </Pressable>

          <Pressable style={styles.exerciseItem} onPress={navigateToSelfHypnosis}>
            <Image style={styles.exerciseItemImage} source={selfHypnosisImage} />
            <View style={styles.exerciseItemContent}>
              <ThemedText type="defaultSemiBold" style={styles.exerciseItemTitle}>
                {t('self-hypnosis')}
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.exerciseItemDescription}>
                {t('self-hypnosis-description')}
              </ThemedText>
            </View>
          </Pressable>

          <Pressable style={styles.exerciseItem} onPress={navigateToQuickWriting}>
            <Image style={styles.exerciseItemImage} source={quickWritingImage} />
            <View style={styles.exerciseItemContent}>
              <ThemedText type="defaultSemiBold" style={styles.exerciseItemTitle}>
                {t('quick-writing')}
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.exerciseItemDescription}>
                {t('quick-writing-description')}
              </ThemedText>
            </View>
          </Pressable>
        </ScrollView>

        <Pressable style={styles.manageUrgesContainer} onPress={navigateToManageUrges}>
          <Image style={styles.manageUrgesImage} source={manageUrgeVideoImage} />

          <ThemedText type="defaultSemiBold" style={styles.manageUrgesTitle}>
            {t('manage-urge-video')}
          </ThemedText>
        </Pressable>

        <Button onPress={back} variant="secondary" title={t('done')} style={styles.button} />
      </View>

      <Modal
        visible={isModalVisible}
        onClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <AlertIcon width={50} height={50} />

          <ThemedText type="preSubtitle" style={styles.modalTitle}>{t('did-you-know')}</ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.modalDescription}>{t('did-you-know-description')}</ThemedText>

          <Button title={t('got-it')} onPress={closeModal} />
        </View>
      </Modal>
    </ScreenContainer>
  )
}

export default ManageUrgesScreen

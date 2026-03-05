import type { DialogScene } from '@/components'

import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import ChevronIcon from '@/assets/icons/chevron'

import { CharacterDialogWindow, Modal, ThemedText } from '@/components'

import { Colors, getResponsiveFontSize, getResponsiveLineHeight } from '@/constants/theme'

import { AsyncStorageKey, getItem, setItem } from '@/utils/async-storage'
import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: '400',
  },
  modalTitleBold: {
    color: Colors.light.primary4,
  },
  modalTitleDialog: {
    position: 'absolute',
    bottom: 0,
  },
  modalContent: {
    alignItems: 'center',
    gap: verticalScale(26),
  },
  modalContentWithDialogs: {
    height: '100%',
  },
  modalStepContent: {
    alignItems: 'center',
    gap: verticalScale(10),
  },
  modalStepTitle: {
    textAlign: 'center',
    color: Colors.light.primary,
    fontWeight: '400',
  },
  modalStepDescription: {
    textAlign: 'center',
    fontSize: getResponsiveFontSize(50),
    lineHeight: getResponsiveLineHeight(50, 1),
    letterSpacing: 0,
    color: Colors.light.primary4,
  },
  modalStepDescription2: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: '400',
  },
  pressableLeft: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -15 }],
    zIndex: 10,
  },
  pressableRight: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -15 }],
    zIndex: 10,
  },
  pressableRightDialog: {
    right: 32,
  },
  pressableLeftDialog: {
    left: 32,
  },
  modalArrowIconLeft: {
    transform: [{ rotate: '180deg' }],
  },
})

const MAX_ONBOARDING_MODAL_STEPS = 5

function FirstTimePopUp() {
  const { t } = useTranslation('drink-tracker')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [onboardingModalStep, setOnboardingModalStep] = useState(1)

  const stepsWithOtherContent = [1, 2, 3] // steps that have other content
  const stepsWithDialogs = [4, 5] // steps that have a dialog

  const TEST_SCENES: Record<number, DialogScene> = {
    4: {
      variant: 'narissa',
      narissa: {
        bubbleSize: {
          width: 143,
          height: 100,
        },
        bubblePosition: {
          top: -30,
          right: -75,
        },
        size: {
          width: 198,
          height: 207,
        },
        position: {
          top: 70,
          left: -20,
        },
        text: t('onboarding-modal.4.title'),
      },
    },
    5: {
      variant: 'buddy',
      buddy: {
        size: {
          width: 189,
          height: 200,
        },
        bubbleSize: {
          width: 163,
          height: 115,
        },
        bubblePosition: {
          top: -70,
          left: -60,
        },
        position: {
          top: 50,
          right: -20,
        },
        text: t('onboarding-modal.5.title'),
      },
    },
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }
  const handleNextStep = () => {
    if (onboardingModalStep === MAX_ONBOARDING_MODAL_STEPS) {
      handleCloseModal()
      return
    }

    setOnboardingModalStep(prev => prev + 1)
  }
  const handlePreviousStep = () => {
    if (onboardingModalStep === 1)
      return

    setOnboardingModalStep(prev => prev - 1)
  }

  useEffect(() => {
    const checkFirstTimeDrinkTrackerPopups = async () => {
      const isFirstTimeDrinkTrackerPopups
        = Boolean(await getItem(AsyncStorageKey.FIRST_TIME_DRINK_TRACKER_POPUPS))

      if (!isFirstTimeDrinkTrackerPopups) {
        setIsModalVisible(true)
        await setItem(AsyncStorageKey.FIRST_TIME_DRINK_TRACKER_POPUPS, 'true')
      }
    }

    checkFirstTimeDrinkTrackerPopups()
  }, [])

  return (
    <Modal
      variant="gradient"
      visible={isModalVisible}
      onClose={handleCloseModal}
      height={stepsWithDialogs.includes(onboardingModalStep) ? 450 : undefined}
    >
      <View style={[
        styles.modalContent,
        stepsWithDialogs.includes(onboardingModalStep) && styles.modalContentWithDialogs,
      ]}
      >
        <Pressable
          onPress={handlePreviousStep}
          style={[
            styles.pressableLeft,
          ]}
        >
          <ChevronIcon style={styles.modalArrowIconLeft} />
        </Pressable>

        <Pressable
          onPress={handleNextStep}
          style={[
            styles.pressableRight,
          ]}
        >
          <ChevronIcon />
        </Pressable>

        {
          stepsWithDialogs.includes(onboardingModalStep)
          && (
            <>
              <CharacterDialogWindow scene={TEST_SCENES[onboardingModalStep]} />

              <ThemedText type="preSubtitle" style={[styles.modalTitle, styles.modalTitleDialog]}>
                <Trans
                  i18nKey={`drink-tracker:onboarding-modal.${onboardingModalStep}.description`}
                  components={[
                    <ThemedText
                      key="0"
                      type="preSubtitle"
                      style={styles.modalTitleBold}
                    />,
                  ]}
                />
              </ThemedText>
            </>
          )

        }

        {stepsWithOtherContent.includes(onboardingModalStep)
          && (
            <>
              <ThemedText type="preSubtitle" style={styles.modalTitle}>
                <Trans
                  i18nKey="drink-tracker:onboarding-modal.title"
                  components={[
                    <ThemedText
                      key="0"
                      type="preSubtitle"
                      style={styles.modalTitleBold}
                    />,
                  ]}
                />
              </ThemedText>

              <View style={styles.modalStepContent}>
                <ThemedText
                  type="preSubtitle"
                  style={styles.modalStepTitle}
                >
                  {t(`onboarding-modal.${onboardingModalStep}.title`)}
                </ThemedText>

                <ThemedText type="title" style={styles.modalStepDescription}>
                  {t(`onboarding-modal.${onboardingModalStep}.description`)}
                </ThemedText>
              </View>

              <ThemedText type="preSubtitle" style={styles.modalStepDescription2}>
                {t(`onboarding-modal.${onboardingModalStep}.description2`)}
              </ThemedText>
            </>
          )}
      </View>
    </Modal>
  )
}

export default FirstTimePopUp

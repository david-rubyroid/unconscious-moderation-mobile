import type { DialogScene } from '@/components/character-dialog'

import { useState } from 'react'

import { ScrollView, StyleSheet, View } from 'react-native'

import {
  Button,
  CharacterDialogWindow,
  Header,
  Modal,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const TEST_SCENES: DialogScene[] = [
  {
    variant: 'buddy',
    buddy: {
      text: 'Hey, I\'m Buddy.\n I\'m literally the\n friend who keeps\n it real. hydrated!',
      bubblePosition: {
        top: -verticalScale(70),
        left: -scale(60),
      },
    },
  },
  {
    variant: 'narissa',
    narissa: {
      bubbleSize: {
        width: 143,
        height: 100,
      },
      bubblePosition: {
        top: -verticalScale(30),
        right: -scale(75),
      },
      size: {
        width: 198,
        height: 207,
      },
      position: {
        top: verticalScale(100),
        left: scale(0),
      },
      text: 'Hi, I\'m Narissa, your Water\n Queen!',
    },
  },
  {
    variant: 'duo',
    buddy: {
      bubbleSize: {
        width: 141,
        height: 100,
      },
      text: 'We\'ll check in with you during this session.',
      size: {
        width: 146,
        height: 155,
      },
      position: {
        position: 'absolute',
        top: verticalScale(80),
        right: scale(15),
      },
      bubblePosition: {
        top: -verticalScale(55),
        left: -scale(65),
      },
    },
    narissa: {
      bubbleSize: {
        width: 140,
        height: 100,
      },
      text: 'Trust us, it really helps. We\'re here for you.',
      size: {
        width: 143,
        height: 149,
      },
      position: {
        position: 'absolute',
        bottom: verticalScale(30),
        left: scale(15),
      },
      bubblePosition: {
        top: -verticalScale(35),
        right: -scale(80),
      },
    },
  },
]

const styles = StyleSheet.create({
  content: {
    padding: scale(20),
    gap: verticalScale(20),
  },
  section: {
    gap: verticalScale(12),
  },
  title: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(8),
  },
  description: {
    color: Colors.light.gray3,
    marginBottom: verticalScale(16),
  },
  buttonContainer: {
    gap: verticalScale(12),
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
  },
  navButton: {
    backgroundColor: Colors.light.white,
    borderRadius: scale(20),
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.black,
    shadowOffset: {
      width: 0,
      height: scale(2),
    },
    shadowOpacity: 0.15,
    shadowRadius: scale(4),
    elevation: 4,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  chevronLeft: {
    transform: [{ rotate: '180deg' }],
  },
})

function CharacterDialogDemoScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)

  const openDialog = (sceneIndex: number) => {
    setCurrentSceneIndex(sceneIndex)
    setModalVisible(true)
  }

  // const handleNext = () => {
  //   if (currentSceneIndex < TEST_SCENES.length - 1) {
  //     setCurrentSceneIndex(currentSceneIndex + 1)
  //   }
  // }

  // const handlePrev = () => {
  //   if (currentSceneIndex > 0) {
  //     setCurrentSceneIndex(currentSceneIndex - 1)
  //   }
  // }

  const currentScene = TEST_SCENES[currentSceneIndex]

  return (
    <ScreenContainer>
      <Header title="Character Dialog Demo" />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.title}>
            Character Dialog Component
          </ThemedText>
          <ThemedText type="default" style={styles.description}>
            Test the three variants of character dialogues: solo Buddy, solo Narissa, and duo conversation.
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Show Buddy Dialog"
            onPress={() => openDialog(0)}
            variant="primary"
            fullWidth
          />
          <Button
            title="Show Narissa Dialog"
            onPress={() => openDialog(1)}
            variant="primary"
            fullWidth
          />
          <Button
            title="Show Duo Dialog"
            onPress={() => openDialog(2)}
            variant="primary"
            fullWidth
          />
          <Button
            title="Show with Navigation (All Scenes)"
            onPress={() => {
              setCurrentSceneIndex(0)
              setModalVisible(true)
            }}
            variant="secondary"
            fullWidth
          />
        </View>

        <View style={[styles.section, { marginTop: verticalScale(32) }]}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            Features:
          </ThemedText>

          <ThemedText type="default" style={styles.description}>
            • Idle animation (sinusoidal floating)
            {'\n'}
            • Reduce motion support
            {'\n'}
            • Dynamic text sizing in speech bubbles
            {'\n'}
            • Gradient background
            {'\n'}
            • Navigation between scenes
          </ThemedText>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        variant="gradient"
        fullWidth
        heightPercentage={50}
      >
        <CharacterDialogWindow
          scene={currentScene}
          onClose={() => setModalVisible(false)}
        />

        {/* Navigation controls */}
        {/* <View style={styles.navigationContainer}>
          <Pressable
            style={[
              styles.navButton,
              currentSceneIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrev}
            disabled={currentSceneIndex === 0}
          >
            <ChevronIcon
              width={scale(20)}
              height={scale(20)}
              style={styles.chevronLeft}
            />
          </Pressable>

          <Pressable
            style={[
              styles.navButton,
              currentSceneIndex === TEST_SCENES.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentSceneIndex === TEST_SCENES.length - 1}
          >
            <ChevronIcon width={scale(20)} height={scale(20)} />
          </Pressable>
        </View> */}
      </Modal>
    </ScreenContainer>
  )
}

export default CharacterDialogDemoScreen

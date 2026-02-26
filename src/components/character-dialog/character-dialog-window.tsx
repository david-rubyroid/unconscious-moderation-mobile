import type { StyleProp, ViewStyle } from 'react-native'

import { StyleSheet, View } from 'react-native'

import { useReduceMotion } from '@/hooks/use-reduce-motion'

import { scale, verticalScale } from '@/utils/responsive'

import DialogCharacterSlot from './dialog-character-slot'

export type DialogVariant = 'buddy' | 'narissa' | 'duo'

export interface DialogScene {
  variant: DialogVariant
  buddy?: {
    text: string
    size?: { width: number, height: number }
    bubbleSize?: { width: number, height: number }
  }
  narissa?: {
    text: string
    size?: { width: number, height: number }
    bubbleSize?: { width: number, height: number }
  }
}

interface CharacterDialogWindowProps {
  scene: DialogScene
  onClose?: () => void
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    position: 'relative',
    minHeight: verticalScale(400),
  },
  buddySlotDuo: {
    position: 'absolute',
    top: verticalScale(50),
    right: scale(-10),
  },
  narissaSlotDuo: {
    position: 'absolute',
    bottom: verticalScale(0),
    left: scale(0),
  },
})

function CharacterDialogWindow({
  scene,
  style,
}: CharacterDialogWindowProps) {
  const reduceMotionEnabled = useReduceMotion()
  const { variant, buddy, narissa } = scene

  const buddyAmplitude = variant === 'duo' ? 3 : 5
  const narissaAmplitude = variant === 'duo' ? 3 : 5

  const renderContent = () => {
    if (variant === 'buddy' && buddy) {
      return (
        <DialogCharacterSlot
          character="buddy"
          text={buddy.text}
          characterSize={buddy.size}
          bubbleSize={buddy.bubbleSize}
          reduceMotionEnabled={reduceMotionEnabled}
          amplitude={buddyAmplitude}
        />
      )
    }

    if (variant === 'narissa' && narissa) {
      return (
        <DialogCharacterSlot
          character="narissa"
          text={narissa.text}
          characterSize={narissa.size}
          bubbleSize={narissa.bubbleSize}
          reduceMotionEnabled={reduceMotionEnabled}
          amplitude={narissaAmplitude}
        />
      )
    }

    if (variant === 'duo' && buddy && narissa) {
      return (
        <>
          <DialogCharacterSlot
            character="buddy"
            text={buddy.text}
            characterSize={buddy.size}
            bubbleSize={buddy.bubbleSize}
            reduceMotionEnabled={reduceMotionEnabled}
            amplitude={buddyAmplitude}
            style={styles.buddySlotDuo}
          />

          <DialogCharacterSlot
            character="narissa"
            text={narissa.text}
            characterSize={narissa.size}
            bubbleSize={narissa.bubbleSize}
            reduceMotionEnabled={reduceMotionEnabled}
            amplitude={narissaAmplitude}
            style={styles.narissaSlotDuo}
          />
        </>
      )
    }

    return null
  }

  return (
    <View style={[styles.wrapper, style]}>
      {renderContent()}
    </View>
  )
}

export default CharacterDialogWindow

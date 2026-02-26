import type { ImageStyle, StyleProp, ViewStyle } from 'react-native'

import { Image } from 'expo-image'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import buddyImage from '@/assets/images/characters/buddy.png'
import narissaImage from '@/assets/images/characters/narissa.png'

import { scale, verticalScale } from '@/utils/responsive'

import SpeechBubble from './speech-bubble'

type CharacterType = 'buddy' | 'narissa'

interface DialogCharacterSlotProps {
  character: CharacterType
  text: string
  characterSize?: { width: number, height: number }
  bubbleSize?: { width: number, height: number }
  idlePaused?: boolean
  reduceMotionEnabled?: boolean
  style?: StyleProp<ViewStyle>
  amplitude?: number
}

const CHARACTER_IMAGES = {
  buddy: buddyImage,
  narissa: narissaImage,
}

const DEFAULT_CHARACTER_SIZE = {
  width: scale(120),
  height: verticalScale(140),
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  animatedGroup: {
    alignItems: 'center',
  },
  bubbleContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  buddyBubble: {
    top: -verticalScale(60),
    left: -scale(70),
  },
  narissaBubble: {
    top: -verticalScale(40),
    right: -scale(85),
  },
  characterContainer: {
    zIndex: 1,
  },
  character: {
    resizeMode: 'contain',
  },
})

function DialogCharacterSlot({
  character,
  text,
  characterSize = DEFAULT_CHARACTER_SIZE,
  bubbleSize,
  idlePaused = false,
  reduceMotionEnabled = false,
  style,
  amplitude = 5,
}: DialogCharacterSlotProps) {
  const phase = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    if (reduceMotionEnabled || idlePaused) {
      return { transform: [{ translateY: 0 }] }
    }

    const translateY = amplitude * Math.sin(phase.value)
    return {
      transform: [{ translateY }],
    }
  })

  const characterStyle: StyleProp<ImageStyle> = [
    styles.character,
    {
      width: characterSize.width,
      height: characterSize.height,
    },
  ]

  useEffect(() => {
    if (reduceMotionEnabled || idlePaused) {
      phase.value = 0
      return
    }

    phase.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: 1600,
        easing: Easing.linear,
      }),
      -1,
      false,
    )

    return () => {
      phase.value = 0
    }
  }, [reduceMotionEnabled, idlePaused, phase])

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.animatedGroup, animatedStyle]}>
        <View
          style={[
            styles.bubbleContainer,
            character === 'buddy' ? styles.buddyBubble : styles.narissaBubble,
          ]}
        >
          <SpeechBubble
            text={text}
            character={character}
            width={bubbleSize?.width}
            height={bubbleSize?.height}
          />
        </View>

        <View style={styles.characterContainer}>
          <Image
            source={CHARACTER_IMAGES[character]}
            style={characterStyle}
            contentFit="contain"
          />
        </View>
      </Animated.View>
    </View>
  )
}

export default DialogCharacterSlot

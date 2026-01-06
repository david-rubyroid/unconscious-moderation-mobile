import type { ViewStyle } from 'react-native'

import { useEffect, useRef, useState } from 'react'

import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'

import ArrowIcon from '@/assets/icons/arrow'

import { Colors } from '@/constants/theme'

import { scale } from '@/utils/responsive'

interface AccordionProps {
  header: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  style?: ViewStyle
  headerStyle?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(11),
    paddingRight: scale(20),
  },
  headerContent: {
    flex: 1,
  },
  content: {
    width: '100%',
  },
})

function Accordion({
  header,
  children,
  defaultOpen = false,
  style,
  headerStyle,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const rotateAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current
  const contentAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: false, // height не поддерживается в native driver
      }),
    ]).start()
  }, [isOpen, rotateAnim, contentAnim])

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  })

  const contentOpacity = contentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const contentMaxHeight = contentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10000],
  })

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.header, headerStyle]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>{header}</View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ArrowIcon color={Colors.light.primary4} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            maxHeight: contentMaxHeight,
            overflow: 'hidden',
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        {children}
      </Animated.View>
    </View>
  )
}

export default Accordion

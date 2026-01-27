import type { ImageSourcePropType } from 'react-native'
import { ImageBackground, StyleSheet, View } from 'react-native'

import PlaySmall from '@/assets/icons/play-small'

import { Colors, withOpacity } from '@/constants/theme'

import { moderateScale, scale, verticalScale } from '@/utils/responsive'

import BottomSheetPopup from '../bottom-sheet-popup'
import BulletList from '../bullet-list'
import Button from '../button'
import ThemedText from '../themed-text'

const styles = StyleSheet.create({
  bottomSheetPopup: {
    padding: 0,
  },
  bottomSheetHeaderImage: {
    alignContent: 'center',
    justifyContent: 'center',
    height: verticalScale(220),
    borderTopEndRadius: moderateScale(40),
    borderTopStartRadius: moderateScale(40),
    overflow: 'hidden',
  },
  bottomSheetHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary, 0.7),
  },
  bottomSheetHeaderText: {
    color: Colors.light.white,
    textAlign: 'center',
    paddingVertical: verticalScale(26),
    paddingHorizontal: scale(20),
  },
  bottomSheetContent: {
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(32),
    marginTop: -verticalScale(30),
    borderTopEndRadius: moderateScale(40),
    borderTopStartRadius: moderateScale(40),
    backgroundColor: Colors.light.tertiaryBackground,
    gap: verticalScale(24),
  },
  bottomSheetContentTitle: {
    color: Colors.light.primary4,
    textAlign: 'center',
  },
  bottomSheetContentDescriptionBold: {
    textAlign: 'center',
  },
  bottomSheetContentDescription: {
    fontWeight: 400,
    textAlign: 'center',
  },
  bottomSheetButton: {
    width: 156,
    borderRadius: 15,
  },
})

type ContentItem
  = | { type: 'subtitle', text: string }
    | { type: 'description', text: string }
    | { type: 'descriptionBold', text: string }
    | { type: 'sectionTitle', text: string }
    | { type: 'bulletList', items: string[], i18nNamespace?: string }

interface ActivityBottomSheetProps {
  visible: boolean
  onClose: () => void
  imageSource: ImageSourcePropType
  title: string
  content: ContentItem[]
  buttonTitle: string
  onStart: () => void
  gap?: number
  buttonWithIcon?: boolean
}

function ActivityBottomSheet({
  visible,
  onClose,
  imageSource,
  title,
  content,
  buttonTitle,
  onStart,
  gap = 24,
  buttonWithIcon = true,
}: ActivityBottomSheetProps) {
  return (
    <BottomSheetPopup
      visible={visible}
      onClose={onClose}
      radius={40}
      style={styles.bottomSheetPopup}
    >
      <ImageBackground
        source={imageSource}
        style={styles.bottomSheetHeaderImage}
      >
        <View style={styles.bottomSheetHeaderOverlay} />

        <ThemedText
          type="title"
          style={styles.bottomSheetHeaderText}
        >
          {title}
        </ThemedText>
      </ImageBackground>

      <View style={[styles.bottomSheetContent, { gap: verticalScale(gap) }]}>
        {content.map((item, index) => {
          if (item.type === 'subtitle') {
            return (
              <ThemedText
                key={`${item.type}-${index}`}
                type="preSubtitle"
                style={styles.bottomSheetContentTitle}
              >
                {item.text}
              </ThemedText>
            )
          }

          if (item.type === 'sectionTitle') {
            return (
              <ThemedText
                key={`${item.type}-${index}`}
                type="defaultSemiBold"
                style={styles.bottomSheetContentTitle}
              >
                {item.text}
              </ThemedText>
            )
          }

          if (item.type === 'descriptionBold') {
            return (
              <ThemedText
                key={`${item.type}-${index}`}
                type="defaultSemiBold"
                style={styles.bottomSheetContentDescriptionBold}
              >
                {item.text}
              </ThemedText>
            )
          }

          if (item.type === 'bulletList') {
            return (
              <BulletList
                key={`${item.type}-${index}`}
                items={item.items}
                i18nNamespace={item.i18nNamespace}
              />
            )
          }

          return (
            <ThemedText
              key={`${item.type}-${index}-${item.text.slice(0, 20)}`}
              type="defaultSemiBold"
              style={styles.bottomSheetContentDescription}
            >
              {item.text}
            </ThemedText>
          )
        })}

        <Button
          icon={buttonWithIcon ? <PlaySmall /> : undefined}
          title={buttonTitle}
          onPress={onStart}
          style={styles.bottomSheetButton}
        />
      </View>
    </BottomSheetPopup>
  )
}

export default ActivityBottomSheet

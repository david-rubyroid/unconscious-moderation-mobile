import { Dimensions, StyleSheet, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { Pagination } from 'react-native-reanimated-carousel'

import firstTimePopup1 from '@/assets/images/first-time-popup/first-time-popup-1.webp'
import firstTimePopup2 from '@/assets/images/first-time-popup/first-time-popup-2.webp'
import firstTimePopup3 from '@/assets/images/first-time-popup/first-time-popup-3.webp'
import firstTimePopup4 from '@/assets/images/first-time-popup/first-time-popup-4.webp'

import { FirstTimePopup } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { moderateScale, scale, verticalScale } from '@/utils/responsive'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const HORIZONTAL_PADDING = scale(20) * 2

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: withOpacity(Colors.light.black, 0.7),
    justifyContent: 'flex-end',
  },
  container: {
    width: SCREEN_WIDTH - HORIZONTAL_PADDING,
    borderRadius: moderateScale(20),
    backgroundColor: '#C9E1FF',
    overflow: 'hidden',
    alignSelf: 'center',
    paddingTop: verticalScale(32),
  },
  paginationContainer: {
    marginBottom: verticalScale(32),
    alignItems: 'center',
  },
  carouselWrapper: {
    width: '100%',
  },
})

export default function FirstTimePopupsModal() {
  const progress = useSharedValue<number>(0)

  const images = [
    firstTimePopup1,
    firstTimePopup2,
    firstTimePopup3,
    firstTimePopup4,
  ]

  const containerWidth = SCREEN_WIDTH - HORIZONTAL_PADDING
  const contentHeight = 620

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          <Pagination.Basic
            progress={progress}
            data={images}
            size={scale(8)}
            dotStyle={{
              width: scale(8),
              height: scale(8),
              borderRadius: scale(4),
              backgroundColor: Colors.light.gray1,
            }}
            activeDotStyle={{
              width: scale(8),
              height: scale(8),
              borderRadius: scale(4),
              backgroundColor: Colors.light.primary4,
            }}
            containerStyle={{
              gap: scale(8),
              justifyContent: 'center',
            }}
          />
        </View>

        {/* Carousel */}
        <View style={styles.carouselWrapper}>
          <Carousel
            loop={false}
            width={containerWidth}
            height={contentHeight}
            data={images}
            onProgressChange={progress}
            renderItem={({ item, index }) => {
              return (
                <FirstTimePopup
                  key={index}
                  screenNumber={index + 1}
                  imageSource={item}
                />
              )
            }}
          />
        </View>
      </View>
    </View>
  )
}

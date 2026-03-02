import { Image } from 'expo-image'
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'

import mocktail1Image from '@/assets/images/mocktails/moktail-1.webp'
import mocktail2Image from '@/assets/images/mocktails/moktail-2.webp'
import mocktail3Image from '@/assets/images/mocktails/moktail-3.webp'
import mocktail4Image from '@/assets/images/mocktails/moktail-4.webp'
import mocktail5Image from '@/assets/images/mocktails/moktail-5.webp'
import mocktail6Image from '@/assets/images/mocktails/moktail-6.webp'
import mocktail7Image from '@/assets/images/mocktails/moktail-7.webp'
import mocktail8Image from '@/assets/images/mocktails/moktail-8.webp'
import mocktail9Image from '@/assets/images/mocktails/moktail-9.webp'

import mocktail10Image from '@/assets/images/mocktails/moktail-10.webp'
import mocktail11Image from '@/assets/images/mocktails/moktail-11.webp'
import mocktail12Image from '@/assets/images/mocktails/moktail-12.webp'
import mocktail13Image from '@/assets/images/mocktails/moktail-13.webp'
import mocktail14Image from '@/assets/images/mocktails/moktail-14.webp'
import mocktail15Image from '@/assets/images/mocktails/moktail-15.webp'
import mocktail16Image from '@/assets/images/mocktails/moktail-16.webp'
import mocktail17Image from '@/assets/images/mocktails/moktail-17.webp'

import { Header, ScreenContainer, ThemedText } from '@/components'

import { Colors } from '@/constants/theme'

import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
    paddingBottom: verticalScale(13),
  },
  description: {
    textAlign: 'center',
    fontWeight: 400,
    color: Colors.light.primary4,
    marginBottom: verticalScale(13),
  },
  mocktailContainer: {
    width: 165,
    height: 183,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: Colors.light.white,
  },
  mocktailTitleContainer: {
    padding: 14.5,
  },
  mocktailTitle: {
    fontWeight: 700,
    color: Colors.light.primary4,
  },
  mocktailImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
})

const MOKTAILS = [
  {
    id: 1,
    titleKey: 'mocktail-1.title',
    image: mocktail1Image,
    link: 'https://youtube.com/shorts/4bjgrGjX5JA?si=TwXszzEal_HzOiun',
  },
  {
    id: 2,
    titleKey: 'mocktail-2.title',
    image: mocktail2Image,
    link: 'https://youtube.com/shorts/6Uqi7P6Ux58?si=ptFfDQDiUrPPKoQd',
  },
  {
    id: 3,
    titleKey: 'mocktail-3.title',
    image: mocktail3Image,
    link: 'https://youtube.com/shorts/zVDV_cAmpIc?si=D3jLTaK8CyorTrfN ',
  },
  {
    id: 4,
    titleKey: 'mocktail-4.title',
    image: mocktail4Image,
    link: 'https://youtube.com/shorts/ax3wpVNNlDA?si=smu2ewPqAxDXJ4JG',
  },
  {
    id: 5,
    titleKey: 'mocktail-5.title',
    image: mocktail5Image,
    link: 'https://youtube.com/shorts/lJkU_wodAKQ?si=KxH0LUZ74uG856Of',
  },
  {
    id: 6,
    titleKey: 'mocktail-6.title',
    image: mocktail6Image,
    link: 'https://youtube.com/shorts/GgC-GTDdzTM?si=uRXSritTQAqozL1V',
  },
  {
    id: 7,
    titleKey: 'mocktail-7.title',
    image: mocktail7Image,
    link: 'https://youtube.com/shorts/fjsQzY1Y9a0?si=iWUAB86dEgJCbGms',
  },
  {
    id: 8,
    titleKey: 'mocktail-8.title',
    image: mocktail8Image,
    link: 'https://youtube.com/shorts/8BhE9riqYAI?si=mpj6q5wx5KY18riT',
  },
  {
    id: 9,
    titleKey: 'mocktail-9.title',
    image: mocktail9Image,
    link: 'https://youtube.com/shorts/bOaTA1QV1xw?si=h6O8qjXSc-7DfjAK ',
  },
  {
    id: 10,
    titleKey: 'mocktail-10.title',
    image: mocktail10Image,
    link: 'https://youtube.com/shorts/YVd6gcymSc0?si=AupFNdlXFhqqVYsj ',
  },
  {
    id: 11,
    titleKey: 'mocktail-11.title',
    image: mocktail11Image,
    link: 'https://youtube.com/shorts/e2gMjGrTJbs?si=Bcm1N964yO9nzeC2',
  },
  {
    id: 12,
    titleKey: 'mocktail-12.title',
    image: mocktail12Image,
    link: 'https://youtube.com/shorts/fDDLlnWz-TE?si=is3mAPSbH5sQbwMo',
  },
  {
    id: 13,
    titleKey: 'mocktail-13.title',
    image: mocktail13Image,
    link: 'https://youtube.com/shorts/ySITRcUO4bE?si=7Mh85hpWlNiHT29O',
  },
  {
    id: 14,
    titleKey: 'mocktail-14.title',
    image: mocktail14Image,
    link: 'https://youtube.com/shorts/-TLVWskVqRs?si=uXZKooIYv3Ne4r5E ',
  },
  {
    id: 15,
    titleKey: 'mocktail-15.title',
    image: mocktail15Image,
    link: 'https://youtube.com/shorts/3XjzwWdT618?si=KnRNZaZxMZDJcF0S',
  },
  {
    id: 16,
    titleKey: 'mocktail-16.title',
    image: mocktail16Image,
    link: 'https://youtube.com/shorts/vP_v40MUta8?si=4OJZ6NwEiEo9Y81o ',
  },
  {
    id: 17,
    titleKey: 'mocktail-17.title',
    image: mocktail17Image,
    link: 'https://youtube.com/shorts/gLnMnGwX8VM?si=csPfOseM0QaYhYcK',
  },
]

function MoktailsScreen() {
  const { t } = useTranslation('mocktails')

  const renderHeader = () => (
    <>
      <Header title={t('title')} />
      <ThemedText
        type="defaultSemiBold"
        style={styles.description}
      >
        {t('description')}
      </ThemedText>
    </>
  )

  return (
    <ScreenContainer
      scrollable={false}
      keyboardAvoiding={false}
      horizontalPadding={16}
      gradientColors={Colors.light.profileScreenGradient}
    >
      <FlatList
        data={MOKTAILS}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.mocktailContainer}
            onPress={() => void openBrowserAsync(
              item.link,
              { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC },
            )}
          >
            <Image source={item.image} style={styles.mocktailImage} />

            <View style={styles.mocktailTitleContainer}>
              <ThemedText
                style={styles.mocktailTitle}
              >
                {t(item.titleKey)}
              </ThemedText>
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  )
}

export default MoktailsScreen

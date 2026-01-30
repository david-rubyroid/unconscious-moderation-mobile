import type { DrinkLogResponse } from '@/api/queries/drink-log/dto'

import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { ImageBackground, Pressable, ScrollView, View } from 'react-native'

import { ThemedText } from '@/components'

import { getDrinkIcon } from '@/utils/drink-icons'

import { styles } from '../drink-with-awareness.styles'

interface LoggedDrinksListProps {
  currencySymbol: string
  sessionDrinks: DrinkLogResponse[] | undefined
}
interface HandlePressDrinkProps {
  sessionId: number
  drinkId: number
}

export function LoggedDrinksList({
  currencySymbol,
  sessionDrinks,
}: LoggedDrinksListProps) {
  const { push } = useRouter()
  const { t } = useTranslation('drink-with-awareness')

  const s = styles.loggedDrinks

  const handlePressDrink = ({ sessionId, drinkId }: HandlePressDrinkProps) => {
    push({
      pathname: '/drink-tracker/edit-drink',
      params: { sessionId, drinkId },
    })
  }

  return (
    <View style={s.container}>
      <ThemedText type="defaultSemiBold" style={s.title}>
        {t('logged-drinks')}
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.list}
        contentContainerStyle={s.listContent}
      >
        {(sessionDrinks?.length || 0) > 0
          ? sessionDrinks?.map((drink) => {
              const photos = drink.photos
              const photo = photos?.length
                ? photos[photos.length - 1]
                : undefined

              return (
                <Pressable
                  key={drink.id}
                  style={s.item}
                  onPress={() => handlePressDrink({
                    sessionId: drink.sessionId,
                    drinkId: drink.id,
                  })}
                >
                  {photo?.photoUrl
                    ? (
                        <ImageBackground
                          source={{ uri: photo.photoUrl }}
                          style={s.photoFull}
                          imageStyle={s.photoImageStyle}
                          resizeMode="cover"
                        >
                          <View style={s.photoContent}>
                            <ThemedText type="defaultSemiBold" style={s.itemTextWhite}>
                              {drink.drinkType}
                            </ThemedText>

                            <ThemedText type="defaultSemiBold" style={s.itemTextWhite}>
                              {currencySymbol}
                              {drink.cost}
                            </ThemedText>
                          </View>
                        </ImageBackground>
                      )
                    : (
                        <View style={s.photoContent}>
                          <ThemedText type="defaultSemiBold" style={s.itemText}>
                            {drink.drinkType}
                          </ThemedText>

                          {getDrinkIcon(drink.drinkType)}

                          <ThemedText type="defaultSemiBold" style={s.itemText}>
                            {currencySymbol}
                            {drink.cost}
                          </ThemedText>
                        </View>
                      )}
                </Pressable>
              )
            })
          : Array.from({ length: 5 }, (_, index) => (
              <View style={s.item} key={index} />
            ))}
      </ScrollView>
    </View>
  )
}

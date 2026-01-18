import type { DrinkLogResponse } from '@/api/queries/drink-log/dto'

import { useTranslation } from 'react-i18next'
import { ImageBackground, ScrollView, View } from 'react-native'

import { ThemedText } from '@/components'

import { getDrinkIcon } from '@/utils/drink-icons'

import { styles } from '../_drink-with-awareness.styles'

interface LoggedDrinksListProps {
  sessionDrinks: DrinkLogResponse[] | undefined
}

export function LoggedDrinksList({ sessionDrinks }: LoggedDrinksListProps) {
  const { t } = useTranslation('drink-with-awareness')

  return (
    <View style={styles.loggedDrinksContainer}>
      <ThemedText type="defaultSemiBold" style={styles.loggedDrinksTitle}>
        {t('logged-drinks')}
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.loggedDrinksList}
        contentContainerStyle={styles.loggedDrinksListContent}
      >
        {(sessionDrinks?.length || 0) > 0
          ? sessionDrinks?.map((drink) => {
              const photo = drink.photos[0]

              return (
                <View key={drink.id} style={styles.loggedDrinkItem}>
                  {photo?.photoUrl
                    ? (
                        <ImageBackground
                          source={{ uri: photo.photoUrl }}
                          style={styles.drinkPhotoFull}
                          imageStyle={styles.drinkPhotoImageStyle}
                          resizeMode="cover"
                        >
                          <View style={styles.drinkPhotoContent}>
                            <ThemedText type="defaultSemiBold" style={styles.loggedDrinkItemTextWhite}>
                              {drink.drinkType}
                            </ThemedText>

                            <ThemedText type="defaultSemiBold" style={styles.loggedDrinkItemTextWhite}>
                              $
                              {drink.cost}
                            </ThemedText>
                          </View>
                        </ImageBackground>
                      )
                    : (
                        <View style={styles.drinkPhotoContent}>
                          <ThemedText type="defaultSemiBold" style={styles.loggedDrinkItemText}>
                            {drink.drinkType}
                          </ThemedText>

                          {getDrinkIcon(drink.drinkType)}

                          <ThemedText type="defaultSemiBold" style={styles.loggedDrinkItemText}>
                            $
                            {drink.cost}
                          </ThemedText>
                        </View>
                      )}
                </View>
              )
            })
          : Array.from({ length: 5 }, (_, index) => (
              <View style={styles.loggedDrinkItem} key={index} />
            ))}
      </ScrollView>
    </View>
  )
}

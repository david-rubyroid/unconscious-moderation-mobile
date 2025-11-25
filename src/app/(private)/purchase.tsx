import type { PurchasesPackage } from 'react-native-purchases'

import { useRouter } from 'expo-router'

import { useEffect, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'

import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Check from '@/assets/icons/check'
import Cross from '@/assets/icons/cross'

import { Button, ThemedGradient, ThemedText } from '@/components'
import { Colors } from '@/constants/theme'

import { useRevenueCat } from '@/hooks/use-revenuecat'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 34,
  },
  crossContainer: {
    alignItems: 'flex-end',
    marginVertical: 32,
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: 25,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  itemText: {
    color: Colors.light.primary4,
  },
  itemTextBold: {
    color: Colors.light.primary4,
    fontWeight: '700',
  },
  lifeChangingShiftContainer: {
    marginTop: 25,
    gap: 25,
    paddingHorizontal: 21,
  },
  lifeChangingShift: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  lifeChangingShiftTextBold: {
    color: Colors.light.primary4,
    fontSize: 15,
    fontWeight: '700',
  },
  lifeChangingShiftText: {
    color: Colors.light.primary4,
    fontSize: 15,
    fontWeight: '500',
  },
  startYourJourney: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  startYourJourneyText: {
    textAlign: 'center',
  },
  startYourJourneyTextRegular: {
    textAlign: 'center',
    color: Colors.light.white,
  },
  startYourJourneyTextBold: {
    fontSize: 26,
    color: Colors.light.white,
    fontWeight: 500,
    lineHeight: 32,
  },
})

function PurchaseScreen() {
  const { t } = useTranslation('purchase')
  const { top, bottom } = useSafeAreaInsets()
  const router = useRouter()

  const { getOfferings, purchasePackage, isLoading } = useRevenueCat()

  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null)
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true)

  // Load offerings on mount
  useEffect(() => {
    const loadOfferings = async () => {
      setIsLoadingOfferings(true)
      const loadedOfferings = await getOfferings()

      const monthlyPackageWithWeeklyTrial = loadedOfferings?.all.default.availablePackages[0]
      if (monthlyPackageWithWeeklyTrial) {
        setSelectedPackage(monthlyPackageWithWeeklyTrial)
      }

      setIsLoadingOfferings(false)
    }

    loadOfferings()
  }, [getOfferings])

  const handleCheckout = async () => {
    if (!selectedPackage) {
      return
    }

    const customerInfo = await purchasePackage(selectedPackage)

    // If purchase was successful, navigate back
    if (customerInfo) {
      router.back()
    }
  }

  const handleClose = () => {
    router.back()
  }

  // Get price display text
  const getPriceText = () => {
    if (selectedPackage?.product?.priceString) {
      return t('start-your-journey-today-only-price', { price: selectedPackage.product.priceString })
    }
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + 10, paddingBottom: bottom + 10 }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <Pressable style={styles.crossContainer} onPress={handleClose}>
          <Cross />
        </Pressable>

        <ThemedText type="title" style={styles.title}>{t('title')}</ThemedText>

        <View style={styles.content}>
          <View style={styles.item}>
            <Check />

            <ThemedText>
              <Trans
                i18nKey="purchase:everything-in-one-app"
                components={[
                  <ThemedText key="0" style={styles.itemTextBold} />,
                  <ThemedText key="1" style={styles.itemText} />,
                ]}
              />
            </ThemedText>
          </View>

          <View style={styles.item}>
            <Check />

            <ThemedText>
              <Trans
                i18nKey="purchase:science-backed-daily-tools"
                components={[
                  <ThemedText key="0" style={styles.itemTextBold} />,
                  <ThemedText key="1" style={styles.itemText} />,
                ]}
              />
            </ThemedText>
          </View>

          <View style={styles.item}>
            <Check />

            <ThemedText>
              <Trans
                i18nKey="purchase:expert-guidance-on-tap"
                components={[
                  <ThemedText key="0" style={styles.itemTextBold} />,
                  <ThemedText key="1" style={styles.itemText} />,
                ]}
              />
            </ThemedText>
          </View>

          <View style={styles.item}>
            <Check />

            <ThemedText>
              <Trans
                i18nKey="purchase:works-anywhere-anytime"
                components={[
                  <ThemedText key="0" style={styles.itemTextBold} />,
                  <ThemedText key="1" style={styles.itemText} />,
                ]}
              />
            </ThemedText>
          </View>

          <View style={styles.item}>
            <Check />

            <ThemedText>
              <Trans
                i18nKey="purchase:zero-shame-zero-labels"
                components={[
                  <ThemedText key="0" style={styles.itemTextBold} />,
                  <ThemedText key="1" style={styles.itemText} />,
                ]}
              />
            </ThemedText>
          </View>
        </View>

        <View style={styles.lifeChangingShiftContainer}>
          <ThemedText type="default" style={styles.lifeChangingShift}>
            <Trans
              i18nKey="purchase:life-changing-shift-for-just-1-a-day"
              components={[
                <ThemedText key="0" style={styles.lifeChangingShiftTextBold} />,
                <ThemedText key="1" style={styles.lifeChangingShiftText} />,
              ]}
            />
          </ThemedText>

          <View style={styles.startYourJourney}>
            <ThemedText
              type="default"
              style={styles.startYourJourneyTextRegular}
            >
              {t('start-your-journey-today-only')}
            </ThemedText>

            <ThemedText
              type="defaultSemiBold"
              style={styles.startYourJourneyTextBold}
            >
              {getPriceText()}
            </ThemedText>
          </View>

          <Button
            fullWidth
            variant="secondary"
            title={t('checkout')}
            loading={isLoading || isLoadingOfferings}
            disabled={!selectedPackage || isLoading || isLoadingOfferings}
            onPress={handleCheckout}
          />
        </View>
      </ScrollView>
    </ThemedGradient>
  )
}

export default PurchaseScreen

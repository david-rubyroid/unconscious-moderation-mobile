import type { PurchasesPackage } from 'react-native-purchases'

import { useQueryClient } from '@tanstack/react-query'

import { useRouter } from 'expo-router'

import { useEffect, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'

import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Check from '@/assets/icons/check'
import Cross from '@/assets/icons/cross'

import { Button, ThemedGradient, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'
import { useRevenueCat } from '@/hooks/use-revenuecat'

import { moderateScale, scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(34),
  },
  crossContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: verticalScale(20),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(10),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: verticalScale(20),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(20),
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: withOpacity(Colors.light.white, 0.3),
    width: '100%',
    flexShrink: 1,
    shadowColor: Colors.light.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    color: Colors.light.primary4,
    lineHeight: moderateScale(20),
  },
  itemTextBold: {
    color: Colors.light.primary4,
    fontWeight: '700',
  },
  lifeChangingShiftContainer: {
    marginTop: verticalScale(20),
    gap: verticalScale(20),
    paddingHorizontal: scale(4),
  },
  lifeChangingShift: {
    textAlign: 'center',
    color: Colors.light.primary4,
    lineHeight: moderateScale(22),
  },
  lifeChangingShiftTextBold: {
    color: Colors.light.primary4,
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  lifeChangingShiftText: {
    color: Colors.light.primary4,
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  startYourJourney: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(20),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(8),
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startYourJourneyText: {
    textAlign: 'center',
  },
  startYourJourneyTextRegular: {
    textAlign: 'center',
    color: Colors.light.white,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
  startYourJourneyTextBold: {
    fontSize: moderateScale(28),
    color: Colors.light.white,
    fontWeight: '700',
    lineHeight: moderateScale(34),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
  },
})

function PurchaseScreen() {
  const { t } = useTranslation('purchase')
  const { top, bottom } = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()

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

    // If purchase was successful, invalidate subscription cache and navigate back
    if (customerInfo) {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'me'] })
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
    return ''
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + 10, paddingBottom: bottom + verticalScale(10) }, styles.container]}>
      <View style={styles.crossContainer}>
        <Pressable onPress={handleClose}>
          <Cross />
        </Pressable>
      </View>

      <ThemedText type="title" style={styles.title}>{t('title')}</ThemedText>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {isLoadingOfferings
          ? (
              <View style={styles.loadingContainer}>
                <ThemedText type="default" style={{ color: Colors.light.primary4 }}>
                  Loading...
                </ThemedText>
              </View>
            )
          : (
              <View style={styles.content}>
                <View style={styles.item}>
                  <Check />

                  <View style={styles.itemTextContainer}>
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
                </View>

                <View style={styles.item}>
                  <Check />

                  <View style={styles.itemTextContainer}>
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
                </View>

                <View style={styles.item}>
                  <Check />

                  <View style={styles.itemTextContainer}>
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
                </View>

                <View style={styles.item}>
                  <Check />

                  <View style={styles.itemTextContainer}>
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
                </View>

                <View style={styles.item}>
                  <Check />

                  <View style={styles.itemTextContainer}>
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
              </View>
            )}
      </ScrollView>

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

          {getPriceText() && (
            <ThemedText
              type="defaultSemiBold"
              style={styles.startYourJourneyTextBold}
            >
              {getPriceText()}
            </ThemedText>
          )}
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
    </ThemedGradient>
  )
}

export default PurchaseScreen

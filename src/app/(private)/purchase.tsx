import type { PurchasesPackage } from 'react-native-purchases'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import Check from '@/assets/icons/check'
import Cross from '@/assets/icons/cross'

import { Button, ScreenContainer, ThemedText } from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { useRevenueCat } from '@/hooks/use-revenuecat'
import { useTikTok } from '@/hooks/use-tiktok'

import { moderateScale, scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
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
    textAlign: 'center',
    fontSize: moderateScale(28),
    color: Colors.light.white,
    fontWeight: '700',
    lineHeight: moderateScale(34),
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
    minHeight: verticalScale(200),
  },
  offerCodeContainer: {
    alignItems: 'center',
  },
  offerCodeText: {
    textAlign: 'center',
    color: Colors.light.primary,
    textDecorationLine: 'underline',
  },
})

function PurchaseScreen() {
  const { t } = useTranslation('purchase')
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    getOfferings,
    purchasePackage,
    isLoading,
    presentOfferCodeRedemption,
  } = useRevenueCat()
  const { trackPurchase } = useTikTok()

  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null)
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true)

  // Load offerings on mount
  useEffect(() => {
    const loadOfferings = async () => {
      setIsLoadingOfferings(true)
      const loadedOfferings = await getOfferings()

      const monthlyPackageWith3DaysTrial = loadedOfferings?.all.default.availablePackages[0]
      if (monthlyPackageWith3DaysTrial) {
        setSelectedPackage(monthlyPackageWith3DaysTrial)
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

    if (customerInfo) {
      const price = selectedPackage.product?.price ?? 0
      const currency = selectedPackage.product?.currencyCode ?? 'USD'
      const productId = selectedPackage.identifier

      trackPurchase(
        price,
        currency,
        [{
          content_id: productId,
          content_name: selectedPackage.product?.title ?? 'Subscription',
          quantity: 1,
        }],
      )

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
    <ScreenContainer>
      <View style={styles.crossContainer}>
        <Pressable onPress={handleClose}>
          <Cross />
        </Pressable>
      </View>

      <ThemedText type="title" style={styles.title}>{t('title')}</ThemedText>

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
                <Check color={Colors.light.primary4} />

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
                <Check color={Colors.light.primary4} />

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
                <Check color={Colors.light.primary4} />

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
                <Check color={Colors.light.primary4} />

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
                <Check color={Colors.light.primary4} />

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

        {Platform.OS === 'ios' && (
          <View style={styles.offerCodeContainer}>
            <Pressable
              onPress={presentOfferCodeRedemption}
              disabled={isLoading || isLoadingOfferings}
            >
              <ThemedText type="defaultSemiBold" style={styles.offerCodeText}>
                {t('redeem-offer-code')}
              </ThemedText>
            </Pressable>
          </View>
        )}
      </View>
    </ScreenContainer>
  )
}

export default PurchaseScreen

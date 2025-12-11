import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, TextInput as RNTextInput, ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetSessionDrinks } from '@/api/queries/drink-log'
import { useGetDrinkSession } from '@/api/queries/drink-session'
import { useGetSessionReflection, useUpdateReflection } from '@/api/queries/reflections'
import { useGetSessionWater } from '@/api/queries/water-log'

import DropIcon from '@/assets/icons/drop'
import MoneyIcon from '@/assets/icons/money'
import TimeSinceIcon from '@/assets/icons/time-since'
import WineIcon from '@/assets/icons/wine'

import reflectReinforceImage from '@/assets/images/reflect-reinforce.jpg'

import { Button, Header, Modal, TextInput, ThemedGradient, ThemedText } from '@/components'
import { Colors, withOpacity } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: verticalScale(20),
  },
  imageBackground: {
    width: '100%',
    borderRadius: scale(20),
    paddingVertical: verticalScale(31),
    overflow: 'hidden',
    marginBottom: verticalScale(18),
  },
  imageBackgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(Colors.light.primary4, 0.8),
  },
  description: {
    textAlign: 'center',
    color: Colors.light.white,
  },
  postDrinkingSummary: {
    color: Colors.light.primary4,
    fontWeight: '400',
    marginBottom: verticalScale(18),
  },
  metricsContainer: {
    width: '100%',
    gap: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  metricBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(12),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  metricIconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: '50%',
    backgroundColor: withOpacity(Colors.light.black, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: withOpacity(Colors.light.black, 0.5),
    fontWeight: '400',
  },
  metricValue: {
    color: Colors.light.black,
    fontWeight: '400',
  },
  reflectReinforceInput: {
    width: '100%',
    color: withOpacity(Colors.light.black, 0.5),
    borderColor: withOpacity(Colors.light.black, 0.1),
  },
  postSessionHypnosisContainer: {
    width: '100%',
    alignItems: 'center',
    gap: scale(18),
    marginVertical: verticalScale(18),
  },
  postSessionHypnosisButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 336,
    paddingVertical: verticalScale(10),
    borderRadius: scale(8),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  postSessionHypnosisText: {
    color: Colors.light.primary4,
  },
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: '700',
    marginBottom: verticalScale(16),
  },
  modalDescription: {
    color: Colors.light.primary4,
    marginBottom: verticalScale(16),
    textAlign: 'center',
  },
  modalTextInput: {
    minHeight: verticalScale(120),
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: withOpacity(Colors.light.black, 0.1),
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    color: Colors.light.black,
    textAlignVertical: 'top',
    marginBottom: verticalScale(20),
  },
  modalRememberContainer: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: verticalScale(24),
  },
  modalRememberLabel: {
    fontWeight: '700',
  },
  modalRememberText: {
    textAlign: 'center',
  },
  modalButtonContainer: {
    alignItems: 'center',
  },
})

function ReflectReinforceScreen() {
  const [reflectReinforce, setReflectReinforce] = useState('')
  const [modalText, setModalText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { top, bottom } = useSafeAreaInsets()
  const { sessionId } = useLocalSearchParams()

  const { t } = useTranslation('reflect-reinforce')

  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))
  const { data: sessionDrinks } = useGetSessionDrinks(Number(sessionId))
  const { data: sessionWater } = useGetSessionWater(Number(sessionId))
  const { data: sessionReflection } = useGetSessionReflection(Number(sessionId))

  const { mutate: updateReflection, isPending: isUpdating } = useUpdateReflection(
    sessionReflection?.id,
  )

  const actualDrinksCount = sessionDrinks?.length || 0
  const maxDrinksCount = drinkSession?.maxDrinkCount || 0
  const totalWaterCups = sessionWater?.reduce((sum, water) => sum + water.cups, 0) || 0
  const actualSpent = Number(drinkSession?.actualSpent) || 0

  // Format session end time
  const formatEndTime = () => {
    if (!drinkSession?.actualEndTime) {
      return 'N/A*'
    }

    const endTime = new Date(drinkSession.actualEndTime)
    const hours = endTime.getHours()
    const minutes = endTime.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes} ${period}*`
  }

  const handleOpenModal = () => {
    setModalText(sessionReflection?.learnings || reflectReinforce)
    setIsModalVisible(true)
  }

  const handleSaveModal = () => {
    if (!sessionReflection?.id) {
      setIsModalVisible(false)
      return
    }

    updateReflection(
      { learnings: modalText },
      {
        onSuccess: () => {
          setReflectReinforce(modalText)
          setIsModalVisible(false)
        },
      },
    )
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} route="/drink-tracker" isReplace />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={reflectReinforceImage}
            style={styles.imageBackground}
          >
            <View style={styles.imageBackgroundOverlay} />
            <ThemedText type="defaultSemiBold" style={styles.description}>
              {t('description')}
            </ThemedText>
          </ImageBackground>

          <ThemedText type="defaultSemiBold" style={styles.postDrinkingSummary}>{t('post-drinking-summary')}</ThemedText>

          <View style={styles.metricsContainer}>
            {/* Drinks Block */}
            <View style={styles.metricBlock}>
              <View style={styles.metricIconContainer}>
                <WineIcon width={scale(14)} height={scale(24)} />
              </View>
              <View style={styles.metricContent}>
                <ThemedText type="default" style={styles.metricLabel}>
                  {t('drinks')}
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                  {`${actualDrinksCount}/${maxDrinksCount}*`}
                </ThemedText>
              </View>
            </View>

            {/* Water Block */}
            <View style={styles.metricBlock}>
              <View style={styles.metricIconContainer}>
                <DropIcon color={Colors.light.primary} width={scale(19)} height={scale(25)} />
              </View>
              <View style={styles.metricContent}>
                <ThemedText type="default" style={styles.metricLabel}>
                  {t('water')}
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                  {`${totalWaterCups}*`}
                </ThemedText>
              </View>
            </View>

            {/* Cost Block */}
            <View style={styles.metricBlock}>
              <View style={styles.metricIconContainer}>
                <MoneyIcon width={scale(45)} height={scale(45)} />
              </View>
              <View style={styles.metricContent}>
                <ThemedText type="default" style={styles.metricLabel}>
                  {t('const')}
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                  {`$${actualSpent.toFixed(2)}*`}
                </ThemedText>
              </View>
            </View>

            {/* Session End Time Block */}
            <View style={styles.metricBlock}>
              <View style={styles.metricIconContainer}>
                <TimeSinceIcon width={scale(26)} height={scale(26)} />
              </View>
              <View style={styles.metricContent}>
                <ThemedText type="default" style={styles.metricLabel}>
                  {t('session-end-time')}
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                  {formatEndTime()}
                </ThemedText>
              </View>
            </View>
          </View>

          <Pressable onPress={handleOpenModal}>
            <TextInput
              pointerEvents="none"
              style={styles.reflectReinforceInput}
              placeholder={t('take-a-moment-to-reflect-on-your-experience')}
              placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
              label={t('what-did-you-learn-from-last-night')}
              value={sessionReflection?.learnings || reflectReinforce}
              onChangeText={setReflectReinforce}
              editable={false}
            />
          </Pressable>

          <View style={styles.postSessionHypnosisContainer}>
            <Pressable style={styles.postSessionHypnosisButton}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.postSessionHypnosisText}
              >
                {t('post-session-hypnosis')}
              </ThemedText>
            </Pressable>

            <Pressable style={styles.postSessionHypnosisButton}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.postSessionHypnosisText}
              >
                {t('stay-hydrated')}
              </ThemedText>
            </Pressable>
          </View>

          <Button title={t('continue')} variant="secondary" onPress={() => {}} />
        </ScrollView>
      </View>

      <Modal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
          {t('what-did-you-learn-from-last-night')}
        </ThemedText>

        <ThemedText type="default" style={styles.modalDescription}>
          {t('what-went-well-what-and-what-felt-right-or-not')}
        </ThemedText>

        <View>
          <RNTextInput
            style={styles.modalTextInput}
            numberOfLines={4}
            placeholder="Type here.."
            placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
            value={modalText}
            onChangeText={setModalText}
            multiline
          />
        </View>

        <ThemedText type="default" style={styles.modalRememberContainer}>
          <Trans
            i18nKey="remember-when-you-mess-up-those-moments-are-golden-opportunities-to-learn-adjust-and-grow"
            ns="reflect-reinforce"
            components={{
              0: <ThemedText key="0" type="defaultSemiBold" style={styles.modalRememberLabel} />,
            }}
          />
        </ThemedText>

        <View style={styles.modalButtonContainer}>
          <Button
            title="Save"
            variant="primary"
            onPress={handleSaveModal}
            disabled={isUpdating || !sessionReflection?.id}
          />
        </View>
      </Modal>
    </ThemedGradient>
  )
}

export default ReflectReinforceScreen

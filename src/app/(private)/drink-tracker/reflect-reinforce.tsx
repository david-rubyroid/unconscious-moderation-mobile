import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  ImageBackground,
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from 'react-native'

import { useGetSessionDrinks } from '@/api/queries/drink-log'
import { useGetDrinkSession } from '@/api/queries/drink-session'
import { useGetSessionReflection, useUpdateReflection } from '@/api/queries/reflections'
import { FEELINGS } from '@/api/queries/reflections/dto'

import { useGetSessionWater } from '@/api/queries/water-log'

import AlertIcon from '@/assets/icons/alert'

import CheckIcon from '@/assets/icons/check'
import reflectReinforceImage from '@/assets/images/reflect-reinforce.webp'

import {
  Button,
  Header,
  Modal,
  ScreenContainer,
  SelectInput,
  SessionMetrics,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  postSessionHypnosisIconContainer: {
    width: scale(20),
    height: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withOpacity(Colors.light.primary4, 0.1),
    borderRadius: '50%',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    gap: verticalScale(18),
  },
  imageBackground: {
    width: '100%',
    borderRadius: scale(20),
    paddingVertical: verticalScale(31),
    overflow: 'hidden',
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
  },
  postSessionHypnosisButton: {
    flexDirection: 'row',
    gap: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    width: 336,
    paddingVertical: verticalScale(10),
    borderRadius: scale(8),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
  },
  postSessionHypnosisText: {
    fontWeight: '400',
    color: Colors.light.primary4,
  },
  modalContainer: {
    gap: verticalScale(16),
  },
  modalTitle: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: '700',
  },
  modalDescription: {
    color: Colors.light.primary4,
    textAlign: 'center',
    fontWeight: '400',
  },
  modalDescriptionBold: {
    color: Colors.light.primary4,
  },
  modalTextInput: {
    minHeight: verticalScale(250),
    backgroundColor: withOpacity(Colors.light.white, 0.5),
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    color: Colors.light.black,
    textAlignVertical: 'top',
  },
  rememberText: {
    textAlign: 'center',
    color: Colors.light.primary4,
    fontWeight: '400',
  },
  modalRememberLabel: {
    color: Colors.light.primary4,
  },
  modalRememberText: {
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
  },
  hydrationModalContainer: {
    alignItems: 'center',
    gap: verticalScale(16),
  },
})

function ReflectReinforceScreen() {
  const { push } = useRouter()
  const { t } = useTranslation('reflect-reinforce')

  const [reflectReinforce, setReflectReinforce] = useState('')
  const [modalText, setModalText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isHydrationModalVisible, setIsHydrationModalVisible] = useState(false)

  const isInitialMount = useRef(true)

  const { sessionId } = useLocalSearchParams()

  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))
  const { data: sessionDrinks } = useGetSessionDrinks(Number(sessionId))
  const { data: sessionWater } = useGetSessionWater(Number(sessionId))
  const { data: sessionReflection } = useGetSessionReflection(Number(sessionId))

  const { mutate: updateReflection, isPending: isUpdating } = useUpdateReflection(
    sessionReflection?.id,
  )

  // Initialize feeling from sessionReflection, update when it changes
  const feeling = sessionReflection?.feeling || ''

  const actualDrinksCount = sessionDrinks?.length || 0
  const maxDrinksCount = drinkSession?.maxDrinkCount || 0
  const totalWaterCups = sessionWater?.reduce((sum, water) => sum + water.cups, 0) || 0
  const actualSpent = Number(drinkSession?.actualSpent) || 0

  const isHydrated = sessionReflection?.hydrated || false
  const isPostSessionHypnosis = sessionReflection?.postSessionHypnosis || false

  // Format session end time
  const formatEndTime = () => {
    if (!drinkSession?.actualEndTime) {
      return 'N/A'
    }

    const endTime = new Date(drinkSession.actualEndTime)
    const hours = endTime.getHours()
    const minutes = endTime.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes} ${period}`
  }

  const handleOpenModal = () => {
    setModalText(sessionReflection?.learnings || reflectReinforce)
    setIsModalVisible(true)
  }
  const handleOpenHydrationModal = () => {
    setIsHydrationModalVisible(true)
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
  const handleUpdateReflectionHydrated = () => {
    updateReflection({
      hydrated: true,
    }, {
      onSuccess: () => {
        setIsHydrationModalVisible(false)
      },
    })
  }
  const navigateToPostSessionHypnosis = () => {
    push({
      pathname: '/drink-tracker/hypnosis-post-session',
      params: {
        sessionId,
        reflectionId: sessionReflection?.id,
        title: t('after-drinking-reflection'),
      },
    })
  }
  const navigateToDrinkTrackerJournal = () => {
    push('/drink-tracker/insights-dashboard')
  }

  useEffect(() => {
    if (sessionReflection?.id) {
      isInitialMount.current = false
    }
  }, [sessionReflection?.id])

  // Update feeling when user selects a new one
  const handleFeelingChange = (newFeeling: string) => {
    if (!isInitialMount.current && newFeeling && sessionReflection?.id) {
      updateReflection({
        feeling: newFeeling,
      })
    }
  }

  return (
    <ScreenContainer contentContainerStyle={styles.contentContainer}>
      <Header marginBottom={verticalScale(20)} title={t('title')} />

      <ImageBackground
        source={reflectReinforceImage}
        style={styles.imageBackground}
      >
        <View style={styles.imageBackgroundOverlay} />
        <ThemedText type="defaultSemiBold" style={styles.description}>
          {t('description')}
        </ThemedText>
      </ImageBackground>

      <ThemedText
        type="defaultSemiBold"
        style={styles.postDrinkingSummary}
      >
        {t('post-drinking-summary')}
      </ThemedText>

      <SessionMetrics
        actualDrinksCount={actualDrinksCount}
        maxDrinksCount={maxDrinksCount}
        totalWaterCups={totalWaterCups}
        actualSpent={actualSpent}
        sessionEndTime={formatEndTime()}
        showEndTime={true}
      />

      <SelectInput
        options={FEELINGS.map(feeling => ({
          label: feeling,
          value: feeling,
        }))}
        value={feeling}
        onChange={handleFeelingChange}
        label={t('how-are-you-feeling')}
        placeholder={t('select-your-feeling')}
        style={styles.reflectReinforceInput}

      />

      <View style={styles.postSessionHypnosisContainer}>
        <Pressable
          style={styles.postSessionHypnosisButton}
          onPress={handleOpenModal}
        >
          <View style={styles.postSessionHypnosisIconContainer}>
            {sessionReflection?.learnings && (
              <CheckIcon
                height={7}
                width={7}
                color={Colors.light.black}
              />
            )}
          </View>

          <ThemedText
            type="defaultSemiBold"
            style={styles.postSessionHypnosisText}
          >
            {t('what-did-you-learn-from-last-night')}
          </ThemedText>
        </Pressable>

        <Pressable
          style={styles.postSessionHypnosisButton}
          onPress={navigateToPostSessionHypnosis}
        >
          <View style={styles.postSessionHypnosisIconContainer}>
            {isPostSessionHypnosis && (
              <CheckIcon
                height={7}
                width={7}
                color={Colors.light.black}
              />
            )}
          </View>

          <ThemedText
            type="defaultSemiBold"
            style={styles.postSessionHypnosisText}
          >
            {t('after-drinking-reflection')}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.postSessionHypnosisButton} onPress={handleOpenHydrationModal}>
          <View style={styles.postSessionHypnosisIconContainer}>
            {isHydrated && (
              <CheckIcon
                height={7}
                width={6}
                color={Colors.light.black}
              />
            )}
          </View>

          <ThemedText
            type="defaultSemiBold"
            style={styles.postSessionHypnosisText}
          >
            {t('stay-hydrated')}
          </ThemedText>

          <AlertIcon />
        </Pressable>
      </View>

      <Button
        title={t('done')}
        variant="secondary"
        onPress={navigateToDrinkTrackerJournal}
      />

      <Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
            {t('what-did-you-learn-from-last-night')}
          </ThemedText>

          <ThemedText type="default" style={styles.modalDescription}>
            {t('what-went-well-what-and-what-felt-right-or-not')}
          </ThemedText>

          <View>
            <RNTextInput
              style={styles.modalTextInput}
              numberOfLines={10}
              placeholder="Type here.."
              placeholderTextColor={withOpacity(Colors.light.black, 0.5)}
              value={modalText}
              onChangeText={setModalText}
              multiline
            />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.rememberText}>
            <Trans
              i18nKey="reflect-reinforce:remember-when-you-mess-up"
              components={[
                <ThemedText key="0" type="defaultSemiBold" style={styles.modalRememberLabel} />,
              ]}
            />
          </ThemedText>

          <Button
            style={styles.button}
            title={t('save')}
            variant="primary"
            onPress={handleSaveModal}
            disabled={isUpdating || !sessionReflection?.id}
          />
        </View>
      </Modal>

      <Modal
        visible={isHydrationModalVisible}
        onClose={() => setIsHydrationModalVisible(false)}
      >
        <View style={styles.hydrationModalContainer}>
          <AlertIcon width={50} height={50} />

          <ThemedText type="defaultSemiBold" style={styles.modalDescription}>
            <Trans
              i18nKey="reflect-reinforce:stay-hydrated-description"
              components={[
                <ThemedText key="0" type="defaultSemiBold" style={styles.modalDescriptionBold} />,
                <ThemedText key="1" type="defaultSemiBold" style={styles.modalDescriptionBold} />,
              ]}
            />
          </ThemedText>

          <Button title={t('got-it')} onPress={handleUpdateReflectionHydrated} />
        </View>
      </Modal>
    </ScreenContainer>
  )
}

export default ReflectReinforceScreen

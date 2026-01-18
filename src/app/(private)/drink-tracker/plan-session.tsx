import type { DrinkType } from '@/api/queries/drink-session/dto'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import z from 'zod'

import {
  useCreateDrinkSession,
  useGetDrinkSession,
  useUpdateDrinkSession,
} from '@/api/queries/drink-session'

import AlertIcon from '@/assets/icons/alert'

import {
  Button,
  ControlledDateInput,
  ControlledTextInput,
  DrinkSelector,
  Header,
  Modal,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { dateToUTCNoon, normalizeDateToDay } from '@/utils/calendar-date'
import { getErrorMessage } from '@/utils/error-handler'
import { scale, verticalScale } from '@/utils/responsive'
import { showErrorToast } from '@/utils/toast'

const styles = StyleSheet.create({
  inputs: {
    gap: verticalScale(12),
  },
  inputContainer: {
    position: 'relative',
  },
  drinkSelectorContainer: {},
  drinkSelectorTextContainer: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(17),
  },
  drinkSelectorText: {
    color: Colors.light.primary4,
  },
  alertIconContainer: {
    position: 'absolute',
    top: -6,
    right: 0,
    zIndex: 1,
    padding: scale(8),
    minWidth: scale(40),
    minHeight: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: withOpacity(Colors.light.black, 0.5),
    borderColor: withOpacity(Colors.light.black, 0.10),
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    gap: verticalScale(24),
  },
  modalText: {
    textAlign: 'center',
  },
  modalTextBold: {
    fontWeight: 700,
  },
  modalButtonContainer: {
    alignItems: 'center',
  },
})

function PlanAndPrepareScreen() {
  const { replace, back } = useRouter()
  const { sessionId } = useLocalSearchParams()

  const [selectedDrink, setSelectedDrink] = useState<DrinkType>('wine')
  const [modalTextKey, setModalTextKey] = useState<string>('')
  const [modalVisible, setModalVisible] = useState(false)

  const { t } = useTranslation('plan-session')

  const { mutate: createDrinkSession, isPending: isCreatingDrinkSession } = useCreateDrinkSession()
  const { mutate: updateDrinkSession, isPending: isUpdatingDrinkSession } = useUpdateDrinkSession(
    Number(sessionId),
  )
  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))

  const createDrinkSessionSchema = z
    .object({
      plannedStartTime: z
        .date({
          error: t('select-your-date'),
        })
        .refine(
          (date) => {
            const selectedDay = normalizeDateToDay(date)
            const today = normalizeDateToDay(new Date())
            return selectedDay >= today
          },
          {
            message: t('plannedStartTime-cannot-be-in-past'),
          },
        ),
      maxDrinkCount: z
        .string()
        .min(1, t('maxDrinkCount-is-required'))
        .refine(
          (val) => {
            const num = Number(val)
            return !Number.isNaN(num) && num > 0 && Number.isInteger(num)
          },
          {
            message: t('maxDrinkCount-must-be-greater-than-0'),
          },
        ),
      budget: z
        .string()
        .min(1, t('budget-is-required'))
        .refine(
          (val) => {
            const num = Number(val)
            return !Number.isNaN(num) && num > 0
          },
          {
            message: t('budget-must-be-positive'),
          },
        ),
    })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<z.infer<typeof createDrinkSessionSchema>>({
    resolver: zodResolver(createDrinkSessionSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const openModal = (textKey: string) => {
    setModalTextKey(textKey)
    setModalVisible(true)
  }
  const closeModal = () => {
    setModalVisible(false)
  }
  const onSubmit = (data: z.infer<typeof createDrinkSessionSchema>) => {
    const { maxDrinkCount, budget, plannedStartTime } = data
    const numberOfDrinks = Number(maxDrinkCount)
    const budgetAmount = Number(budget)

    if (sessionId) {
      updateDrinkSession({
        plannedStartTime: dateToUTCNoon(plannedStartTime),
        maxDrinkCount: numberOfDrinks,
        budget: budgetAmount,
        drinkType: selectedDrink,
      }, {
        onSuccess: () => {
          back()
        },
        onError: (error) => {
          showErrorToast('Oops! Something went wrong', getErrorMessage(error))
        },
      })

      return
    }

    createDrinkSession({
      plannedStartTime: dateToUTCNoon(plannedStartTime),
      maxDrinkCount: numberOfDrinks,
      budget: budgetAmount,
      drinkType: selectedDrink,
    }, {
      onSuccess: (data) => {
        const { id } = data

        replace({
          pathname: '/drink-tracker/pre-drink-checklist',
          params: {
            sessionId: id,
          },
        })
      },
      onError: (error) => {
        showErrorToast('Oops! Something went wrong', getErrorMessage(error))
      },
    })
  }

  useEffect(() => {
    if (drinkSession) {
      setValue('plannedStartTime', drinkSession.plannedStartTime
        ? new Date(drinkSession.plannedStartTime)
        : new Date())
      setValue('maxDrinkCount', drinkSession.maxDrinkCount?.toString() || '1')
      setValue('budget', drinkSession.budget?.toString() || '0')
    }
  }, [drinkSession, setValue])

  return (
    <>
      <ScreenContainer scrollable={false}>
        <Header title={t('title')} />

        <View style={styles.inputs}>
          <ControlledDateInput
            control={control}
            name="plannedStartTime"
            placeholderTextColor={styles.input.color}
            placeholder={t('select-your-date')}
            style={styles.input}
            label={t('when-do-you-plan-to-drink')}
            mode="date"
          />

          <View style={styles.drinkSelectorContainer}>
            <View style={styles.drinkSelectorTextContainer}>
              <ThemedText style={styles.drinkSelectorText} type="defaultSemiBold">
                {t('what-type-of-drink-will-you-stick-with')}
              </ThemedText>

              <TouchableOpacity
                onPress={() => {
                  openModal('drink-type-description')
                }}
                activeOpacity={0.7}
              >
                <AlertIcon />
              </TouchableOpacity>
            </View>

            <DrinkSelector selectedDrink={selectedDrink} onSelectDrink={setSelectedDrink} />
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.alertIconContainer}
              onPress={() => {
                openModal('drink-limit-description')
              }}
              activeOpacity={0.7}
            >
              <AlertIcon />
            </TouchableOpacity>

            <ControlledTextInput
              control={control}
              keyboardType="numeric"
              name="maxDrinkCount"
              placeholderTextColor={styles.input.color}
              placeholder={t('set-your-drink-limit')}
              style={styles.input}
              label={t('whats-your-maximum-number-of-drinks')}
            />
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.alertIconContainer}
              onPress={() => {
                openModal('max-spending-description')
              }}
              activeOpacity={0.7}
            >
              <AlertIcon />
            </TouchableOpacity>

            <ControlledTextInput
              control={control}
              name="budget"
              keyboardType="numeric"
              placeholderTextColor={styles.input.color}
              placeholder={t('set-your-max-spending')}
              style={styles.input}
              label={t('whats-your-budget-for-the-night')}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={sessionId ? t('update') : t('continue')}
            variant="secondary"
            onPress={handleSubmit(onSubmit)}
            loading={isCreatingDrinkSession || isUpdatingDrinkSession}
            disabled={isCreatingDrinkSession || isUpdatingDrinkSession || !isValid}
          />
        </View>
      </ScreenContainer>

      <Modal
        visible={modalVisible}
        onClose={closeModal}
        children={(
          <View style={styles.modalContainer}>
            <AlertIcon width={50} height={50} />

            <ThemedText style={styles.modalText}>
              <Trans
                i18nKey={t(`${modalTextKey}`)}
                components={[
                  <ThemedText key="0" style={styles.modalTextBold} />,
                  <ThemedText key="1" style={styles.modalTextBold} />,
                ]}
              />
            </ThemedText>

            <View style={styles.modalButtonContainer}>
              <Button
                title={t('got-it')}
                onPress={closeModal}
              />
            </View>
          </View>
        )}
      />
    </>
  )
}

export default PlanAndPrepareScreen

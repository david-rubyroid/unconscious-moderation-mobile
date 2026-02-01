import type { Currency, DrinkType } from '@/api/queries/drink-session/dto'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
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
  ControlledSelectInput,
  ControlledTextInput,
  DrinkSelector,
  Header,
  Modal,
  ScreenContainer,
  TextInput,
  ThemedText,
} from '@/components'

import { CURRENCY } from '@/constants/currency'
import { Colors, withOpacity } from '@/constants/theme'

import { dateToUTCNoon, normalizeDateToDay } from '@/utils/calendar-date'
import { getErrorMessage } from '@/utils/error-handler'
import { scale, verticalScale } from '@/utils/responsive'
import { showErrorToast } from '@/utils/toast'

const styles = StyleSheet.create({
  drinkSelectorContainer: {
    gap: verticalScale(8),
  },
  inputs: {
    gap: verticalScale(12),
  },
  inputContainer: {
    position: 'relative',
  },
  budgetInput: {
    gap: scale(8),
  },
  budgetInputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(8),
  },
  budgetInputContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  budgetInputCurrencyWrapper: {
    width: 80,
  },
  budgetInputFieldWrapper: {
    flex: 1,
  },
  budgetInputLabel: {
    color: Colors.light.primary4,
  },
  drinkSelectorTextContainer: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drinkSelectorText: {
    color: Colors.light.primary4,
  },
  chooseOneText: {
    color: withOpacity(Colors.light.black, 0.5),
  },
  alertIconContainer: {
    position: 'absolute',
    top: -6,
    right: -8,
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
    color: Colors.light.primary4,
    textAlign: 'center',
  },
  modalTextBold: {
    color: Colors.light.primary4,
    fontWeight: 700,
  },
  modalButtonContainer: {
    alignItems: 'center',
  },
})

function PlanAndPrepareScreen() {
  const { back } = useRouter()
  const { sessionId } = useLocalSearchParams()

  const [selectedDrink, setSelectedDrink] = useState<DrinkType>('wine')
  const [selectedDrinkOther, setSelectedDrinkOther] = useState<string>('')
  const [modalTextKey, setModalTextKey] = useState<string>('')
  const [modalVisible, setModalVisible] = useState(false)

  const { t } = useTranslation('plan-session')

  const { mutate: createDrinkSession, isPending: isCreatingDrinkSession } = useCreateDrinkSession()
  const { mutate: updateDrinkSession, isPending: isUpdatingDrinkSession } = useUpdateDrinkSession(
    Number(sessionId),
  )
  const { data: drinkSession } = useGetDrinkSession(Number(sessionId))

  const currencyOptions = Object.values(CURRENCY).map(currency => ({
    label: currency,
    value: currency,
  }))
  const createDrinkSessionSchema = useMemo(
    () =>
      z.object({
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
        currency: z.string().min(1, t('currency-is-required')),
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
      }),
    [t],
  )

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { isValid },
  } = useForm<z.infer<typeof createDrinkSessionSchema>>({
    resolver: zodResolver(createDrinkSessionSchema),
    defaultValues: {
      currency: CURRENCY.USD,
    },
  })

  const handleSelectDrinkOther = (text: string) => {
    trigger('plannedStartTime')

    setSelectedDrinkOther(text)

    if (text.trim() !== '') {
      setSelectedDrink('other')
    }

    if (text.trim() === '') {
      setSelectedDrink(selectedDrink === 'other' ? 'wine' : selectedDrink)
    }
  }
  const handleSelectDrink = (drink: DrinkType) => {
    trigger()

    if (drink !== 'other' && selectedDrinkOther.trim()) {
      setSelectedDrinkOther('')
    }

    setSelectedDrink(drink)

    if (drink === 'other') {
      setSelectedDrinkOther('')
    }
  }
  const openModal = (textKey: string) => {
    setModalTextKey(textKey)
    setModalVisible(true)
  }
  const closeModal = () => {
    setModalVisible(false)
  }
  const onSubmit = (data: z.infer<typeof createDrinkSessionSchema>) => {
    const { maxDrinkCount, budget, plannedStartTime, currency } = data
    const numberOfDrinks = Number(maxDrinkCount)
    const budgetAmount = Number(budget)
    const selectedCurrency = currency as Currency

    if (sessionId) {
      updateDrinkSession({
        plannedStartTime: dateToUTCNoon(plannedStartTime),
        maxDrinkCount: numberOfDrinks,
        budget: budgetAmount,
        drinkType: selectedDrink,
        currency: selectedCurrency,
        drinkTypeOther: selectedDrinkOther,
      }, {
        onSuccess: () => {
          back()
        },
        onError: (error) => {
          showErrorToast(
            'Oops! Something went wrong',
            getErrorMessage(error),
          )
        },
      })

      return
    }
    createDrinkSession({
      plannedStartTime: dateToUTCNoon(plannedStartTime),
      maxDrinkCount: numberOfDrinks,
      budget: budgetAmount,
      drinkType: selectedDrink,
      currency: selectedCurrency,
      drinkTypeOther: selectedDrinkOther,
    }, {
      onSuccess: () => {
        back()
      },
      onError: (error) => {
        showErrorToast(
          'Oops! Something went wrong',
          getErrorMessage(error),
        )
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
      setValue('currency', drinkSession.currency || CURRENCY.USD)

      setSelectedDrink(drinkSession.drinkType || 'wine')
      setSelectedDrinkOther(drinkSession.drinkTypeOther || '')
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
              <ThemedText
                style={styles.drinkSelectorText}
                type="defaultSemiBold"
              >
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

            <DrinkSelector
              selectedDrink={selectedDrink}
              onSelectDrink={handleSelectDrink}
            />

            <ThemedText
              style={styles.chooseOneText}
            >
              {t('choose-one')}
            </ThemedText>

            <TextInput
              value={selectedDrinkOther}
              placeholderTextColor={styles.input.color}
              placeholder={t('other')}
              style={styles.input}
              onChangeText={handleSelectDrinkOther}
            />
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

          <View style={styles.budgetInput}>
            <View style={styles.budgetInputLabelContainer}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.budgetInputLabel}
              >
                {t('whats-your-budget-for-the-night')}
              </ThemedText>

              <TouchableOpacity
                onPress={() => {
                  openModal('max-spending-description')
                }}
                activeOpacity={0.7}
              >
                <AlertIcon />
              </TouchableOpacity>
            </View>

            <View style={styles.budgetInputContentContainer}>
              <View style={styles.budgetInputCurrencyWrapper}>
                <ControlledSelectInput
                  control={control}
                  name="currency"
                  options={currencyOptions}
                  style={styles.input}
                />
              </View>

              <View style={styles.budgetInputFieldWrapper}>
                <ControlledTextInput
                  control={control}
                  name="budget"
                  keyboardType="numeric"
                  placeholderTextColor={styles.input.color}
                  placeholder={t('set-your-max-spending')}
                  style={styles.input}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={sessionId ? t('update') : t('save')}
            variant="secondary"
            onPress={handleSubmit(onSubmit)}
            loading={isCreatingDrinkSession || isUpdatingDrinkSession}
            disabled={
              isCreatingDrinkSession
              || isUpdatingDrinkSession
              || !isValid
            }
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

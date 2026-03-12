import type { Currency } from '@/api/queries/drink-session/dto'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { z } from 'zod'

import { useCreateDrinkSession } from '@/api/queries/drink-session'

import {
  Button,
  ControlledSelectInput,
  ControlledTextInput,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { CURRENCY } from '@/constants/currency'
import { Colors, withOpacity } from '@/constants/theme'

import { dateToUTCNoon, normalizeDateToDay } from '@/utils/calendar-date'
import { getErrorMessage } from '@/utils/error-handler'
import { scale, verticalScale } from '@/utils/responsive'
import { showErrorToast } from '@/utils/toast'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: verticalScale(36),
    paddingTop: verticalScale(60),
  },
  title: {
    color: Colors.light.primary,
    textAlign: 'center',
  },
  formsContainer: {
    width: '100%',
    maxWidth: 361,
    gap: verticalScale(15),
  },
  formCard: {
    backgroundColor: withOpacity(Colors.light.white, 0.8),
    borderRadius: scale(10),
    paddingVertical: verticalScale(27),
    paddingHorizontal: scale(21),
    gap: verticalScale(10),
  },
  formLabel: {
    color: Colors.light.primary4,
    fontSize: 16,
    fontWeight: 500,
  },
  inputRow: {
    flexDirection: 'row',
    gap: scale(13),
    alignItems: 'flex-start',
  },
  currencySelect: {
    width: 80,
  },
  budgetInput: {
    flex: 1,
  },
  input: {
    borderColor: withOpacity(Colors.light.black, 0.10),
    color: withOpacity(Colors.light.black, 0.5),
  },
  saveButton: {
    width: 233,
  },
})

function CreateSessionStep4Screen() {
  const { replace, back } = useRouter()
  const params = useLocalSearchParams()

  const { mutate: createDrinkSession, isPending: isCreatingDrinkSession } = useCreateDrinkSession()

  const currencyOptions = Object.values(CURRENCY).map(currency => ({
    label: currency,
    value: currency,
  }))

  const createSessionSchema = useMemo(
    () =>
      z.object({
        maxDrinkCount: z
          .string()
          .min(1, 'Drink limit is required')
          .refine(
            (val) => {
              const num = Number(val)
              return !Number.isNaN(num) && num > 0 && Number.isInteger(num)
            },
            {
              message: 'Must be a positive number',
            },
          ),
        currency: z.string().min(1, 'Currency is required'),
        budget: z
          .string()
          .min(1, 'Budget is required')
          .refine(
            (val) => {
              const num = Number(val)
              return !Number.isNaN(num) && num >= 0
            },
            {
              message: 'Must be a positive number',
            },
          ),
      }),
    [],
  )

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.infer<typeof createSessionSchema>>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      currency: CURRENCY.USD,
      maxDrinkCount: '1',
      budget: '0',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const onSubmit = (data: z.infer<typeof createSessionSchema>) => {
    const { maxDrinkCount, budget, currency } = data

    const plannedDate = params.selectedDate
      ? new Date(params.selectedDate as string)
      : new Date()

    const today = normalizeDateToDay(new Date())
    const normalizedPlannedDate = normalizeDateToDay(plannedDate)
    const isToday = normalizedPlannedDate.getTime() === today.getTime()

    createDrinkSession(
      {
        plannedStartTime: dateToUTCNoon(plannedDate),
        maxDrinkCount: Number(maxDrinkCount),
        budget: Number(budget),
        currency: currency as Currency,
        whereLocation: params.whereLocation as any,
        whoWith: params.whoWith as any,
        whyReason: params.whyReason as any,
      },
      {
        onSuccess: (response) => {
          if (isToday) {
            replace({
              pathname: '/drink-tracker/pre-drink-checklist',
              params: { sessionId: response.id },
            })
          }
          else {
            back()
          }
        },
        onError: (error) => {
          showErrorToast('Oops! Something went wrong', getErrorMessage(error))
        },
      },
    )
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ThemedText type="preSubtitle" style={styles.title}>New Session</ThemedText>

        <View style={styles.formsContainer}>
          <View style={styles.formCard}>
            <ThemedText style={styles.formLabel}>
              What's Your Budget for the Night?
            </ThemedText>

            <View style={styles.inputRow}>
              <View style={styles.currencySelect}>
                <ControlledSelectInput
                  control={control}
                  name="currency"
                  options={currencyOptions}
                  style={styles.input}
                  gradientColors={Colors.light.profileScreenGradient}
                />
              </View>

              <View style={styles.budgetInput}>
                <ControlledTextInput
                  control={control}
                  name="budget"
                  keyboardType="numeric"
                  placeholderTextColor={styles.input.color}
                  placeholder="Set your max spending"
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <ThemedText style={styles.formLabel}>
              What's Your Maximum Number of Drinks?
            </ThemedText>

            <ControlledTextInput
              control={control}
              keyboardType="numeric"
              name="maxDrinkCount"
              placeholderTextColor={styles.input.color}
              placeholder="Set your drink limit"
              style={styles.input}
            />
          </View>
        </View>

        <Button
          title="Save"
          variant="primary"
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
          loading={isCreatingDrinkSession}
          disabled={isCreatingDrinkSession || !isValid}
        />
      </View>
    </ScreenContainer>
  )
}

export default CreateSessionStep4Screen

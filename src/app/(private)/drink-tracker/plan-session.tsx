import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import z from 'zod'

import { useCreateDrinkSession } from '@/api/queries/drink-session'

import AlertIcon from '@/assets/icons/alert'

import {
  Button,
  ControlledDateInput,
  ControlledTextInput,
  Header,
  Modal,
  ThemedGradient,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  inputs: {
    gap: verticalScale(12),
  },
  inputContainer: {
    position: 'relative',
  },
  alertIconContainer: {
    position: 'absolute',
    top: 0,
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
  const [modalTextKey, setModalTextKey] = useState<string>('')
  const [modalVisible, setModalVisible] = useState(false)

  const { t } = useTranslation('plan-session')

  const { top, bottom } = useSafeAreaInsets()

  const createDrinkSessionMutation = useCreateDrinkSession()

  const createDrinkSessionSchema = z
    .object({
      plannedStartTime: z.date(),
      maxDrinkCount: z.string(),
      budget: z.string(),
    })

  const {
    control,
    setError,
    handleSubmit,
  } = useForm<z.infer<typeof createDrinkSessionSchema>>({
    resolver: zodResolver(createDrinkSessionSchema),
    defaultValues: {
      plannedStartTime: new Date(),
      maxDrinkCount: '1',
      budget: '0',
    },
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

    if (numberOfDrinks <= 0) {
      setError('maxDrinkCount', { message: t('maxDrinkCount-must-be-greater-than-0') })
      return
    }

    createDrinkSessionMutation.mutate({
      plannedStartTime: plannedStartTime.toISOString(),
      maxDrinkCount: numberOfDrinks,
      budget: budgetAmount,
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(10), paddingBottom: bottom + verticalScale(10) }]}>
      <Header title={t('title')} />

      <View style={styles.container}>
        <View style={styles.inputs}>
          <ControlledDateInput
            control={control}
            name="plannedStartTime"
            placeholderTextColor={styles.input.color}
            placeholder={t('select-your-date')}
            style={styles.input}
            label={t('when-do-you-plan-to-drink')}
            mode="datetime"
          />

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
            title={t('continue')}
            variant="secondary"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        onClose={closeModal}
        children={(
          <View style={styles.modalContainer}>
            <AlertIcon transform={[{ scale: 2.5 }]} />

            <ThemedText style={styles.modalText}>
              <Trans
                i18nKey={`plan-and-prepare:${modalTextKey}`}
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
    </ThemedGradient>
  )
}

export default PlanAndPrepareScreen

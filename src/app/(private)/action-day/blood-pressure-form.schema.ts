import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createBloodPressureFormSchema(t: TFunction) {
  return z.object({
    systolicPressure: z
      .coerce
      .number({ message: t('validation.systolic-required') })
      .int(t('validation.systolic-integer'))
      .min(70, t('validation.systolic-min'))
      .max(200, t('validation.systolic-max')),
    diastolicPressure: z
      .coerce
      .number({ message: t('validation.diastolic-required') })
      .int(t('validation.diastolic-integer'))
      .min(40, t('validation.diastolic-min'))
      .max(130, t('validation.diastolic-max')),
  })
}

export type BloodPressureFormValues = z.infer<
  ReturnType<typeof createBloodPressureFormSchema>
>

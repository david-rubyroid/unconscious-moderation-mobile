import type { TFunction } from 'i18next'

import { getBloodPressureCategory } from '@/utils/blood-pressure'

export function getDay2BloodPressureCategoryKey(
  t: TFunction,
  systolic?: number,
  diastolic?: number,
): string {
  if (!systolic || !diastolic) {
    return t('blood-pressure-category.unknown')
  }
  const category = getBloodPressureCategory(systolic, diastolic)

  return t(`blood-pressure-category.${category}`)
}

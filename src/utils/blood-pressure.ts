export const BLOOD_PRESSURE_CATEGORIES = [
  'normal',
  'elevated',
  'high-stage-1',
  'high-stage-2',
  'hypertensive-crisis',
] as const

export type BloodPressureCategory = typeof BLOOD_PRESSURE_CATEGORIES[number]

export type BloodPressureResultType
  = 'staying-healthy'
    | 'improved'
    | 'holding-steady'
    | 'check-in'

export function getBloodPressureCategoryIndex(
  systolic: number,
  diastolic: number,
): number {
  if (systolic < 120 && diastolic < 80)
    return 0
  if (systolic < 130 && diastolic < 80)
    return 1
  if (systolic < 140 && diastolic < 90)
    return 2
  if (systolic < 180 && diastolic < 120)
    return 3
  return 4
}

export function getBloodPressureCategory(
  systolic: number,
  diastolic: number,
): BloodPressureCategory {
  const index = getBloodPressureCategoryIndex(systolic, diastolic)
  return BLOOD_PRESSURE_CATEGORIES[index]
}

export function getBloodPressureResultType(
  day2Systolic: number,
  day2Diastolic: number,
  day30Systolic: number,
  day30Diastolic: number,
): BloodPressureResultType {
  const cat2 = getBloodPressureCategoryIndex(day2Systolic, day2Diastolic)
  const cat30 = getBloodPressureCategoryIndex(day30Systolic, day30Diastolic)

  if (cat30 < cat2)
    return 'improved'
  if (cat30 > cat2)
    return 'check-in'
  if (cat2 <= 1)
    return 'staying-healthy'
  return 'holding-steady'
}

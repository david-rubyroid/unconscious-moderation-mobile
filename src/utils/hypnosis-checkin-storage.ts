import { getItem, removeItem, setItem } from './async-storage'

export type HypnosisCheckInType = '1Hour' | 'awareness' | 'grounding'

export interface HypnosisCheckInRecord {
  sessionId: number
  type: HypnosisCheckInType
  link: string
  completedAt: string // ISO timestamp
  hoursSinceFirstDrink: number
}

const getKey = (sessionId: number) => `hypnosis_checkins_${sessionId}`

export async function saveHypnosisCheckIn(
  record: HypnosisCheckInRecord,
): Promise<void> {
  const key = getKey(record.sessionId)
  const existingData = await getItem(key)
  const records: HypnosisCheckInRecord[] = existingData
    ? JSON.parse(existingData)
    : []

  // Add new record (allow multiple completions of same type for replay)
  records.push(record)

  await setItem(key, JSON.stringify(records))
}

export async function getSessionCheckIns(
  sessionId: number,
): Promise<HypnosisCheckInRecord[]> {
  const key = getKey(sessionId)
  const data = await getItem(key)
  return data ? JSON.parse(data) : []
}

export async function isCheckInCompleted(
  sessionId: number,
  hoursSinceFirstDrink: number,
): Promise<boolean> {
  const records = await getSessionCheckIns(sessionId)
  return records.some(record => record.hoursSinceFirstDrink === hoursSinceFirstDrink)
}

export async function getLastCheckInOfType(
  sessionId: number,
  type: HypnosisCheckInType,
): Promise<HypnosisCheckInRecord | null> {
  const records = await getSessionCheckIns(sessionId)
  const filtered = records.filter(record => record.type === type)
  return filtered.length > 0 ? filtered[filtered.length - 1] : null
}

export async function clearSessionCheckIns(sessionId: number): Promise<void> {
  const key = getKey(sessionId)
  await removeItem(key)
}

import type { ActivityType } from '@/api/queries/daily-activities/dto'

import { ACTION_DAY_DAYS, CONNECTION_DAY_DAYS } from '@/constants/daily-activities'

export function getAvailableActivitiesForDay(dayNumber: number): ActivityType[] {
  const activities: ActivityType[] = [
    'hypnosis',
    'journaling',
    'reading',
    'movement',
  ]

  if ((ACTION_DAY_DAYS as readonly number[]).includes(dayNumber)) {
    activities.push('action-day')
  }

  if ((CONNECTION_DAY_DAYS as readonly number[]).includes(dayNumber)) {
    activities.push('connection-day')
  }

  return activities
}

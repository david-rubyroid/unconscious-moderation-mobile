import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import FillHeartIcon from '@/assets/icons/fill-heart'
import FillHeartWithArrowIcon from '@/assets/icons/fill-heart-with-arrow'
import WarningIcon from '@/assets/icons/warning'
import { ThemedText } from '@/components'
import { Colors } from '@/constants/theme'
import { BLOOD_PRESSURE_CATEGORIES } from '@/utils/blood-pressure'
import { scale } from '@/utils/responsive'

import { actionDayStyles } from '../styles'

export function BloodPressureTable() {
  const { t } = useTranslation('action-days')

  return (
    <>
      <ThemedText type="preSubtitle" style={actionDayStyles.bloodPressureTableTitle}>
        {t('blood-pressure-table')}
      </ThemedText>

      <View style={actionDayStyles.tableContainer}>
        <View style={actionDayStyles.tableHeader}>
          <ThemedText type="defaultSemiBold" style={actionDayStyles.tableHeaderText}>
            {t('blood-pressure-reading-header')}
          </ThemedText>
        </View>

        {BLOOD_PRESSURE_CATEGORIES.map((key, index) => {
          const isFirst = index === 0
          const isLast = index === 4
          const reading = t(`blood-pressure-categories.${key}.reading`)
          const title = t(`blood-pressure-categories.${key}.title`)
          const description = t(`blood-pressure-categories.${key}.description`)
          const IconComponent
            = key === 'normal'
              ? FillHeartIcon
              : key === 'elevated'
                ? FillHeartWithArrowIcon
                : WarningIcon

          return (
            <View
              key={key}
              style={[
                actionDayStyles.tableRow,
                isFirst && actionDayStyles.tableRowFirst,
                isLast && actionDayStyles.tableRowLast,
              ]}
            >
              <ThemedText type="defaultSemiBold" style={actionDayStyles.tableCellReading}>
                {reading}
              </ThemedText>

              <View style={actionDayStyles.tableCellRight}>
                <View style={actionDayStyles.tableCellIcon}>
                  <IconComponent
                    width={scale(21)}
                    height={scale(17)}
                    color={
                      key === 'normal' || key === 'elevated'
                        ? Colors.light.primary
                        : undefined
                    }
                  />
                </View>

                <View style={actionDayStyles.tableCellTextBlock}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={actionDayStyles.tableCellTitle}
                  >
                    {title}
                  </ThemedText>

                  <ThemedText
                    type="default"
                    style={actionDayStyles.tableCellDescription}
                  >
                    {description}
                  </ThemedText>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </>
  )
}

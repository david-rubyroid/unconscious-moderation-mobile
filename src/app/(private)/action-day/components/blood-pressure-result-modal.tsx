import type { BloodPressureResultType } from '@/utils/blood-pressure'
import { useTranslation } from 'react-i18next'

import { StyleSheet, View } from 'react-native'
import HeartOutlineIcon from '@/assets/icons/heart-outline'
import HoldingSteadyHeartIcon from '@/assets/icons/holding-steady-heart'
import MedalIcon from '@/assets/icons/medal'

import WarningIcon from '@/assets/icons/warning'

import { Button, Modal, ThemedText } from '@/components'

import { Colors } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'

export type { BloodPressureResultType } from '@/utils/blood-pressure'

interface BloodPressureResultModalProps {
  visible: boolean
  resultType: BloodPressureResultType
  onClose: () => void
}

interface ResultConfig {
  titleKey: string
  descriptionKey: string
  iconColor: string
  Icon: React.ComponentType<{
    width?: number
    height?: number
    color?: string
  }>
  iconWidth: number
  iconHeight?: number
}

const RESULT_CONFIG: Record<BloodPressureResultType, ResultConfig> = {
  'staying-healthy': {
    titleKey: 'you-re-staying-healthy',
    descriptionKey: 'you-re-staying-healthy-description',
    iconColor: Colors.light.primary4,
    Icon: HeartOutlineIcon,
    iconWidth: 70,
  },
  'improved': {
    titleKey: 'you-improved',
    descriptionKey: 'you-improved-description',
    iconColor: Colors.light.primary4,
    Icon: MedalIcon,
    iconWidth: 58,
    iconHeight: 80,
  },
  'holding-steady': {
    titleKey: 'holding-steady',
    descriptionKey: 'holding-steady-description',
    iconColor: Colors.light.error2,
    Icon: HoldingSteadyHeartIcon,
    iconWidth: 72,
  },
  'check-in': {
    titleKey: 'let-s-check-in',
    descriptionKey: 'let-s-check-in-description',
    iconColor: Colors.light.error2,
    Icon: WarningIcon,
    iconWidth: 66,
  },
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    fontWeight: '400',
    color: Colors.light.primary4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'center',
    marginTop: verticalScale(8),
  },
})

function BloodPressureResultModal({
  visible,
  resultType,
  onClose,
}: BloodPressureResultModalProps) {
  const { t } = useTranslation('action-days')
  const {
    titleKey,
    descriptionKey,
    iconColor,
    Icon,
    iconWidth,
    iconHeight = iconWidth,
  } = RESULT_CONFIG[resultType]

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="gradient"
    >
      <View style={styles.content}>
        <ThemedText
          type="subtitle"
          style={[styles.title, { color: iconColor }]}
        >
          {t(titleKey)}
        </ThemedText>

        <View style={styles.iconContainer}>
          <Icon
            width={scale(iconWidth)}
            height={scale(iconHeight)}
            {...(Icon !== MedalIcon && { color: iconColor })}
          />
        </View>

        <ThemedText
          type="defaultSemiBold"
          style={styles.description}
        >
          {t(descriptionKey)}
        </ThemedText>

        <Button
          title={t('got-it')}
          onPress={onClose}
          style={styles.button}
          variant="secondary"
        />
      </View>
    </Modal>
  )
}

export default BloodPressureResultModal

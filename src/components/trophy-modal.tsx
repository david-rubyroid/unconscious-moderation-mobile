import type { TrophyType } from '@/api/queries/sobriety-tracker/dto'

import { useRouter } from 'expo-router'
import { Trans, useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'

import threeDays from '@/assets/images/trophies/3-days.png'
import sevenDays from '@/assets/images/trophies/7-days.png'

import fourteenDays from '@/assets/images/trophies/14-days.png'
import twentyOneDays from '@/assets/images/trophies/21-days.png'
import twentyFourHours from '@/assets/images/trophies/24-hours.png'
import thirtyDays from '@/assets/images/trophies/30-days.png'
import sixtyDays from '@/assets/images/trophies/60-days.png'
import ninetyDays from '@/assets/images/trophies/90-days.png'

import { Colors } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/responsive'
import Button from './button'

import Modal from './modal'
import ThemedText from './themed-text'

interface TrophyModalProps {
  visible: boolean
  trophyType: TrophyType
  onClose: () => void
}

const TROPHY_IMAGES = {
  '24h': twentyFourHours,
  '3d': threeDays,
  '7d': sevenDays,
  '14d': fourteenDays,
  '21d': twentyOneDays,
  '30d': thirtyDays,
  '60d': sixtyDays,
  '90d': ninetyDays,
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  trophyImageContainer: {
    width: scale(90),
    height: scale(80),
    backgroundColor: Colors.light.white,
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trophyImage: {
    width: scale(66),
    height: scale(55),
    resizeMode: 'contain',
  },
  description: {
    textAlign: 'center',
  },
  descriptionBold: {
  },
  buttonContainer: {
    marginTop: verticalScale(8),
  },
})

function TrophyModal({ visible, trophyType, onClose }: TrophyModalProps) {
  const { t } = useTranslation('trophies')
  const router = useRouter()

  const handleSeeMyTrophies = () => {
    onClose()
    router.push('/trophies')
  }

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <ThemedText type="preSubtitle" style={styles.title}>
          {t('congratulations-new-trophy-achieved')}
        </ThemedText>

        <View style={styles.trophyImageContainer}>
          <Image
            source={TROPHY_IMAGES[trophyType]}
            style={styles.trophyImage}
          />
        </View>

        <ThemedText style={styles.description}>
          <Trans
            i18nKey={`trophies:${trophyType}-alert`}
            components={[
              <ThemedText key="0" type="defaultSemiBold" />,
            ]}
          />
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Button
            title={t('see-my-trophies')}
            onPress={handleSeeMyTrophies}
            variant="primary"
          />
        </View>
      </View>
    </Modal>
  )
}

export default TrophyModal

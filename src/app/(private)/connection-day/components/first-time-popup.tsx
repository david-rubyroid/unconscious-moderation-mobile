import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HeartOutlineIcon from '@/assets/icons/heart-outline'

import { Button, Modal, ThemedText } from '@/components'

import { Colors } from '@/constants/theme'

import { AsyncStorageKey, getItem, setItem } from '@/utils/async-storage'
import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    textAlign: 'center',
    fontWeight: '400',
    color: Colors.light.primary4,
  },
  descriptionBold: {
    color: Colors.light.primary4,
  },
  button: {
    marginTop: verticalScale(8),
    alignSelf: 'center',
  },
})

export function ConnectionDayFirstTimePopup() {
  const { t } = useTranslation('connection-days')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkFirstTime = async () => {
      const hasSeenPopup = Boolean(
        await getItem(AsyncStorageKey.FIRST_TIME_CONNECTION_DAY_POPUP),
      )

      if (!hasSeenPopup) {
        setIsVisible(true)
        await setItem(AsyncStorageKey.FIRST_TIME_CONNECTION_DAY_POPUP, 'true')
      }
    }

    checkFirstTime()
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <Modal visible={isVisible} onClose={handleClose} variant="gradient">
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <HeartOutlineIcon color={Colors.light.primary4} />
        </View>

        <ThemedText type="defaultSemiBold" style={styles.description}>
          <Trans
            i18nKey="connection-days:first-time-popup.description"
            components={[
              <ThemedText
                key="0"
                type="defaultSemiBold"
                style={styles.descriptionBold}
              />,
            ]}
          />
        </ThemedText>

        <Button
          title={t('got-it', { defaultValue: 'Got it!' })}
          onPress={handleClose}
          style={styles.button}
          variant="secondary"
        />
      </View>
    </Modal>
  )
}

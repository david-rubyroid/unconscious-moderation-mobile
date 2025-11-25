import { useRouter } from 'expo-router'

import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { useUserFearsAdd } from '@/api/queries/user'
import { Button, ThemedGradient, ThemedText } from '@/components'
import { FEARS } from '@/constants/gifts-and-fears'
import { Colors } from '@/constants/theme'
import { verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    color: Colors.light.primary4,
    marginBottom: 22,
    fontWeight: 400,
  },
  titleBold: {
    color: Colors.light.primary4,
    fontWeight: 700,
  },
  gifts: {
    gap: 22,
  },
  section: {
    padding: 16,
    borderRadius: 10,
    gap: 20,
    backgroundColor: Colors.light.white,
  },
  sectionTitle: {
    textAlign: 'center',
    color: Colors.light.primary,
    fontWeight: 700,
  },
  sectionContent: {
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sectionItem: {
    minHeight: 56,
    width: '48%', // (100% - gap) / 2
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.light.tertiaryBackground,
  },
  sectionItemSelected: {
    backgroundColor: Colors.light.primary4,
  },
  lastItem: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sectionItemText: {
    textAlign: 'center',
    color: Colors.light.primary4,
  },
  sectionItemSelectedText: {
    color: Colors.light.white,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  button: {
    width: 233,
  },
})

function FearsScreen() {
  const { replace } = useRouter()
  const { t } = useTranslation('questions')
  const { top, bottom } = useSafeAreaInsets()

  const [selectedFears, setSelectedFears] = useState<string[]>([])

  const { mutate: addFears, isPending: isAddingFears } = useUserFearsAdd()

  const handleSelectFear = (fear: string) => {
    setSelectedFears((prev) => {
      if (prev.includes(fear)) {
        return prev.filter(item => item !== fear)
      }

      return [...prev, fear]
    })
  }

  const fears = useMemo(() => {
    return FEARS.map(item => (
      {
        label: t(item.label),
        value: item.value,
      }
    ))
  }, [t])

  const handleSaveFears = () => {
    addFears({ fears: selectedFears }, {
      onSuccess: () => {
        replace('/(private)/shared-awareness')
      },
      onError: () => {
        Toast.show({
          type: 'success',
          text1: t('error-title-fears'),
          text2: t('error-description-fears'),
        })
      },
    })
  }

  return (
    <ThemedGradient style={[{ paddingTop: top + verticalScale(41), paddingBottom: bottom + verticalScale(22) }, styles.container]}>
      <ThemedText style={styles.title} type="defaultSemiBold">
        <Trans
          i18nKey="questions:opening-up-is-a-way-to-heal-let-us-know-what-fears-do-you-have-before-starting-this-new-path"
          components={[
            <ThemedText key="0" style={styles.titleBold} type="defaultSemiBold" />,
            <ThemedText key="1" style={styles.titleBold} type="defaultSemiBold" />,
          ]}
        />
      </ThemedText>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.gifts}>
          <View style={styles.section}>
            <ThemedText
              style={styles.sectionTitle}
              type="defaultSemiBold"
            >
              {t('here-are-some-common-fears')}
            </ThemedText>

            <View style={styles.sectionContent}>
              {fears.map((item, index) => (
                <TouchableOpacity
                  style={[
                    styles.sectionItem,
                    index === fears.length - 1 && styles.lastItem,
                    selectedFears.includes(item.value) && styles.sectionItemSelected,
                  ]}
                  key={item.value}
                  onPress={() => handleSelectFear(item.value)}
                >
                  <ThemedText style={[styles.sectionItemText, selectedFears.includes(item.value) && styles.sectionItemSelectedText]}>{item.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          disabled={isAddingFears}
          loading={isAddingFears}
          style={styles.button}
          title={t('save')}
          onPress={handleSaveFears}
        />
      </View>
    </ThemedGradient>
  )
}

export default FearsScreen

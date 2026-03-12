import type { WhoWith } from '@/api/queries/drink-session/dto'

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import {
  Button,
  ScreenContainer,
  ThemedText,
} from '@/components'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: verticalScale(36),
    paddingTop: verticalScale(60),
  },
  title: {
    color: Colors.light.primary,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 361,
    gap: verticalScale(12),
    backgroundColor: withOpacity(Colors.light.white, 0.8),
    borderRadius: scale(10),
    paddingVertical: verticalScale(29),
    paddingHorizontal: scale(16),
  },
  optionButton: {
    backgroundColor: Colors.light.tertiaryBackground,
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    minHeight: 56,
    justifyContent: 'center',
  },
  optionButtonSelected: {
    backgroundColor: Colors.light.primary4,
  },
  optionText: {
    color: Colors.light.primary4,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
  },
  optionTextSelected: {
    color: Colors.light.white,
  },
  saveButton: {
    width: 233,
  },
})

const whoWithOptions: Array<{ value: WhoWith, label: string }> = [
  { value: 'alone', label: 'Alone' },
  { value: 'partner_date', label: 'Partner / Date' },
  { value: 'friends_family', label: 'Friends / Family' },
  { value: 'coworkers_work_event', label: 'Coworkers / Work Event' },
  { value: 'mixed_group', label: 'Mixed Group' },
]

function CreateSessionStep2Screen() {
  const { replace } = useRouter()
  const params = useLocalSearchParams()

  const [selectedWhoWith, setSelectedWhoWith] = useState<WhoWith | null>(null)

  const handleSave = () => {
    if (!selectedWhoWith) {
      return
    }

    replace({
      pathname: '/drink-tracker/create-session-step-3',
      params: {
        whereLocation: params.whereLocation as string,
        whoWith: selectedWhoWith,
        selectedDate: params.selectedDate as string,
      },
    })
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ThemedText type="preSubtitle" style={styles.title}>
          Who Are You Drinking With?
        </ThemedText>

        <View style={styles.optionsContainer}>
          {whoWithOptions.map(option => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                selectedWhoWith === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedWhoWith(option.value)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  selectedWhoWith === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <Button
          title="Save"
          variant="primary"
          style={styles.saveButton}
          onPress={handleSave}
          disabled={!selectedWhoWith}
        />
      </View>
    </ScreenContainer>
  )
}

export default CreateSessionStep2Screen

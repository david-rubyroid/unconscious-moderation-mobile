import type { WhyReason } from '@/api/queries/drink-session/dto'

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
    fontWeight: '700',
    fontSize: 20,
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

const whyReasonOptions: Array<{ value: WhyReason, label: string }> = [
  { value: 'celebrating', label: 'Celebrating' },
  { value: 'strong_emotion', label: 'Strong emotion' },
  { value: 'bored', label: 'Bored' },
  { value: 'social_pressure', label: 'Social pressure' },
  { value: 'habit_routine', label: 'Habit / Routine' },
]

function CreateSessionStep3Screen() {
  const { replace } = useRouter()
  const params = useLocalSearchParams()

  const [selectedWhyReason, setSelectedWhyReason] = useState<WhyReason | null>(null)

  const handleSave = () => {
    if (!selectedWhyReason) {
      return
    }

    replace({
      pathname: '/drink-tracker/create-session-step-4',
      params: {
        whereLocation: params.whereLocation as string,
        whoWith: params.whoWith as string,
        whyReason: selectedWhyReason,
        selectedDate: params.selectedDate as string,
      },
    })
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ThemedText style={styles.title}>
          Why are you drinking?
        </ThemedText>

        <View style={styles.optionsContainer}>
          {whyReasonOptions.map(option => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                selectedWhyReason === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedWhyReason(option.value)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  selectedWhyReason === option.value && styles.optionTextSelected,
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
          disabled={!selectedWhyReason}
        />
      </View>
    </ScreenContainer>
  )
}

export default CreateSessionStep3Screen

import type { WhereLocation } from '@/api/queries/drink-session/dto'

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

const whereLocationOptions: Array<{ value: WhereLocation, label: string }> = [
  { value: 'home', label: 'Home' },
  { value: 'bar_restaurant', label: 'Bar / Restaurant' },
  { value: 'event_party', label: 'Event / Party' },
  { value: 'someone_elses_place', label: 'Someone else\'s place' },
  { value: 'outdoors', label: 'Outdoors' },
  { value: 'hotel_travel', label: 'Hotel / Travel' },
]

function CreateSessionStep1Screen() {
  const { replace } = useRouter()
  const params = useLocalSearchParams()

  const [selectedLocation, setSelectedLocation] = useState<WhereLocation | null>(null)

  const handleSave = () => {
    if (!selectedLocation) {
      return
    }

    replace({
      pathname: '/drink-tracker/create-session-step-2',
      params: {
        whereLocation: selectedLocation,
        selectedDate: params.selectedDate as string,
      },
    })
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ThemedText style={styles.title}>
          Where are you drinking?
        </ThemedText>

        <View style={styles.optionsContainer}>
          {whereLocationOptions.map(option => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                selectedLocation === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedLocation(option.value)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  selectedLocation === option.value && styles.optionTextSelected,
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
          disabled={!selectedLocation}
        />
      </View>
    </ScreenContainer>
  )
}

export default CreateSessionStep1Screen

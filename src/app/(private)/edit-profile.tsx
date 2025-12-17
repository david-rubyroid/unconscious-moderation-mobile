import type { UserAge, UserGender } from '@/api/types/models'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import z from 'zod'

import { useGetCurrentUser } from '@/api/queries/auth'

import { useUpdateUser } from '@/api/queries/user'

import {
  Button,
  ControlledSelectInput,
  ControlledTextInput,
  Header,
  PremiumPlanButton,
  ScreenContainer,
} from '@/components'

import { AGE_OPTIONS, GENDER_OPTIONS } from '@/constants/personalization'
import { Colors, withOpacity } from '@/constants/theme'

const styles = StyleSheet.create({
  formContainer: {
    gap: 10,
  },
  input: {
    borderColor: withOpacity(Colors.light.black, 0.1),
    color: withOpacity(Colors.light.black, 0.5),
  },
})

function EditProfileScreen() {
  const { t } = useTranslation('edit-profile')

  const { data: user } = useGetCurrentUser()
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()

  const editProfileFormSchema = z.object({
    firstName: z.string().min(1, { error: t('this-field-is-required') }),
    lastName: z.string().min(1, { error: t('this-field-is-required') }),
    age: z.string().min(1, { error: t('this-field-is-required') }),
    gender: z.string().min(1, { error: t('this-field-is-required') }),
    email: z.email({ error: t('email-is-invalid') }),
  })

  const gradientColors = ['#BDE5E2', '#DCF1EE', '#E4F4ED', '#B9E2E6'] as const
  const ageOptions = AGE_OPTIONS.map(option => ({
    ...option,
    label: t(option.label),
  }))
  const genderOptions = GENDER_OPTIONS.map(option => ({
    ...option,
    label: t(option.label),
  }))

  const { control, handleSubmit, formState: { isValid } }
    = useForm<z.infer<typeof editProfileFormSchema>>({
      resolver: zodResolver(editProfileFormSchema),
      defaultValues: {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        age: user?.age || '',
        gender: user?.gender || '',
        email: user?.email || '',
      },
    })

  const onSubmit = (data: z.infer<typeof editProfileFormSchema>) => {
    updateUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      age: data.age as UserAge,
      gender: data.gender as UserGender,
    }, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('profile-updated-successfully'),
        })
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('failed-to-update-profile'),
        })
      },
    })
  }

  return (
    <ScreenContainer gradientColors={gradientColors}>
      <Header title="Edit Profile" />

      <PremiumPlanButton />

      <View style={styles.formContainer}>
        <ControlledTextInput
          name="firstName"
          control={control}
          label={t('firstName')}
          style={styles.input}
        />
        <ControlledTextInput
          name="lastName"
          control={control}
          label={t('lastName')}
          style={styles.input}
        />
        <ControlledSelectInput
          gradientColors={gradientColors}
          name="age"
          control={control}
          label={t('age')}
          options={ageOptions}
          style={styles.input}
        />
        <ControlledSelectInput
          gradientColors={gradientColors}
          name="gender"
          control={control}
          label={t('gender')}
          options={genderOptions}
          style={styles.input}
        />
        <ControlledTextInput
          name="email"
          control={control}
          label={t('email')}
          style={styles.input}
        />
        <Button
          fullWidth
          loading={isUpdatingUser}
          disabled={!isValid}
          title={t('save')}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScreenContainer>
  )
}

export default EditProfileScreen

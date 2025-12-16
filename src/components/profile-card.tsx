import { useRouter } from 'expo-router'

import { StyleSheet, View } from 'react-native'

import { useGetCurrentUser } from '@/api/queries/auth'

import { Colors, withOpacity } from '@/constants/theme'

import { scale, verticalScale } from '@/utils/responsive'
import Button from './button'
import ThemedText from './themed-text'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(7),
    marginBottom: verticalScale(20),
  },
  avatarContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: Colors.light.gray1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: Colors.light.white,
  },
  textContainer: {
    flex: 1,
    marginLeft: scale(16),
  },
  usernameText: {
    color: withOpacity(Colors.light.black, 0.7),
  },
  editButton: {
    width: scale(50),
    borderRadius: scale(8),
  },
})

function ProfileCard() {
  const { push } = useRouter()

  const { data: user } = useGetCurrentUser()

  if (!user) {
    return null
  }

  const fullName = `${user.firstName} ${user.lastName}`
  const username = user.email ? `@${user.email.split('@')[0]}` : `@user${user.id}`

  // Get initials for avatar placeholder
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()

  const navigateToEditProfile = () => {
    push('/edit-profile')
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <ThemedText type="defaultSemiBold" style={styles.avatarInitials}>
          {initials}
        </ThemedText>
      </View>

      <View style={styles.textContainer}>
        <ThemedText type="defaultSemiBold">
          {fullName}
        </ThemedText>

        <ThemedText style={styles.usernameText}>
          {username}
        </ThemedText>
      </View>

      <Button
        onPress={navigateToEditProfile}
        variant="secondary"
        title="Edit"
        style={styles.editButton}
      />
    </View>
  )
}

export default ProfileCard

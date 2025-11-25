import { useRouter } from 'expo-router'

import { StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useGetCurrentUser, useLogout } from '@/api/queries/auth'

import { useGetSubscription } from '@/api/queries/subscriptions'

import { Button, ThemedGradient, ThemedText } from '@/components'
import { scale } from '@/utils/responsive'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(21),
  },
  buttonContainer: {
    marginTop: scale(20),
    gap: scale(10),
  },
})

function IndexScreen() {
  const { replace, push } = useRouter()

  const { data: user } = useGetCurrentUser()
  const { data: subscription } = useGetSubscription()
  const { mutateAsync: logout } = useLogout()

  const { top, bottom } = useSafeAreaInsets()

  return (
    <ThemedGradient style={[{ paddingTop: top, paddingBottom: bottom }]}>
      <View style={styles.container}>
        <ThemedText type="defaultSemiBold">
          Hello
          {' '}
          {user?.firstName}
          ,
          {' '}
          id:
          {' '}
          {user?.id}
          {' '}
        </ThemedText>

        <ThemedText type="defaultSemiBold">
          Subscription:
          {JSON.stringify(subscription)}
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Button
            title="Purchase"
            onPress={() => {
              push('/purchase')
            }}
          />

          <Button
            title="End of Free Trial"
            onPress={() => {
              push('/end-of-free-trial')
            }}
          />

          <Button
            title="Logout"
            onPress={() => {
              logout().then(() => {
                replace('/(auth)/sign-in')
              })
            }}
          />
        </View>
      </View>
    </ThemedGradient>
  )
}

export default IndexScreen

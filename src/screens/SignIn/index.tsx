import { useState } from 'react'
import { Alert } from 'react-native'
import { Container, Slogan, Title } from './styles'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Realm, useApp } from '@realm/react'

import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button'
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env'

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
})

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const app = useApp()

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true)

      const { idToken } = await GoogleSignin.signIn()

      if (idToken) {
        const credentials = Realm.Credentials.jwt(idToken)

        await app.logIn(credentials)
      } else {
        Alert.alert('Sign in', 'Not possible to log in to your google account.')
        setIsAuthenticating(false)
      }
    } catch (error) {
      console.log(error)
      setIsAuthenticating(false)
      Alert.alert('Sign in', 'Not possible to log in to your google account.')
    }
  }

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>
      <Slogan>Vehicle Use Management</Slogan>

      <Button
        title="Sign in with Google"
        isLoading={isAuthenticating}
        onPress={handleGoogleSignIn}
      />
    </Container>
  )
}

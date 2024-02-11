import { useRef, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useUser } from '@realm/react'
import { useRealm } from '@libs/realm'
import { History } from '@libs/realm/schemas/History'

import { Header } from '@components/Header'
import { LicensePlateInput } from '@components/LicensePlateInput'
import { TextAreaInput } from '@components/TextAreaInput'
import { Button } from '@components/Button'

import { Container, Content } from './styles'
import { licensePlateValidate } from '@utils/licensePlateValidate'

export function Departure() {
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const { goBack } = useNavigation()
  const realm = useRealm()
  const user = useUser()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Invalid plate',
          'The plate is invalid. Please inform the correct license plate.',
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Goal',
          'Please inform the goal for the vehicle use.',
        )
      }

      setIsRegistering(true)

      realm.write(() => {
        realm.create(
          'History',
          History.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          }),
        )
      })

      Alert.alert('Departure', 'Vehicle departure registered successfully.')
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Failed to register vehicle departure.')
      setIsRegistering(false)
    }
  }

  const keyboardAvoidingViewBehavior =
    Platform.OS === 'android' ? 'height' : 'position'

  return (
    <Container>
      <Header title="Departure" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingViewBehavior}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label="Vehicle Plate"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
              value={licensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Goal"
              placeholder="I'll use this vehicle to..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
              value={description}
            />

            <Button
              title="Register Departure"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
}

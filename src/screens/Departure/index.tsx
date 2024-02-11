import { Header } from '@components/Header'
import { Container, Content } from './styles'
import { LicensePlateInput } from '@components/LicensePlateInput'
import { TextAreaInput } from '@components/TextAreaInput'
import { Button } from '@components/Button'
import { useRef } from 'react'
import { TextInput } from 'react-native'

export function Departure() {
  const descriptionRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
    console.log('OK!')
  }

  return (
    <Container>
      <Header title="Departure" />

      <Content>
        <LicensePlateInput
          label="Vehicle Plate"
          placeholder="BRA1234"
          onSubmitEditing={() => descriptionRef.current?.focus()}
          returnKeyType="next"
        />

        <TextAreaInput
          ref={descriptionRef}
          label="Goal"
          placeholder="I'll use this vehicle to..."
          onSubmitEditing={handleDepartureRegister}
          returnKeyType="send"
          blurOnSubmit
        />

        <Button title="Register Departure" onPress={handleDepartureRegister} />
      </Content>
    </Container>
  )
}

import { Header } from '@components/Header'
import { Container, Content } from './styles'
import { LicensePlateInput } from '@components/LicensePlateInput'
import { TextAreaInput } from '@components/TextAreaInput'
import { Button } from '@components/Button'

export function Departure() {
  return (
    <Container>
      <Header title="Departure" />

      <Content>
        <LicensePlateInput label="Vehicle Plate" placeholder="BRA1234" />

        <TextAreaInput label="Goal" placeholder="I'll use this vehicle to..." />

        <Button title="Register Departure" />
      </Content>
    </Container>
  )
}

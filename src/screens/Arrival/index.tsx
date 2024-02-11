import { useRoute } from '@react-navigation/native'
import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from './styles'
import { Header } from '@components/Header'
import { Button } from '@components/Button'
import { ButtonIcon } from '@components/ButtonIcon'
import { X } from 'phosphor-react-native'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const route = useRoute()
  const { id } = route.params as RouteParamsProps

  return (
    <Container>
      <Header title="Arrival" />
      <Content>
        <Label>Vehicle Plate</Label>

        <LicensePlate>XXX0000</LicensePlate>

        <Label>Goal</Label>

        <Description>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem sequi
          asperiores quia nisi adipisci rem blanditiis labore architecto! Harum
          error totam optio pariatur molestias excepturi voluptas assumenda
          voluptates facilis saepe.
        </Description>

        <Footer>
          <ButtonIcon icon={X} />
          <Button title="Register Arrival" />
        </Footer>
      </Content>
    </Container>
  )
}

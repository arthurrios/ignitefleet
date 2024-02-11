import { useRoute } from '@react-navigation/native'
import { BSON } from 'realm'

import { useObject } from '@libs/realm'
import { History } from '@libs/realm/schemas/History'

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from './styles'
import { X } from 'phosphor-react-native'

import { Header } from '@components/Header'
import { Button } from '@components/Button'
import { ButtonIcon } from '@components/ButtonIcon'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const route = useRoute()
  const { id } = route.params as RouteParamsProps

  const history = useObject(History, new BSON.UUID(id))

  return (
    <Container>
      <Header title="Arrival" />
      <Content>
        <Label>Vehicle Plate</Label>

        <LicensePlate>{history?.license_plate}</LicensePlate>

        <Label>Goal</Label>

        <Description>{history?.description}</Description>

        <Footer>
          <ButtonIcon icon={X} />
          <Button title="Register Arrival" />
        </Footer>
      </Content>
    </Container>
  )
}

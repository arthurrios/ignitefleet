import { useNavigation, useRoute } from '@react-navigation/native'
import { Alert } from 'react-native'

import { BSON } from 'realm'
import { useObject, useRealm } from '@libs/realm'
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
  const realm = useRealm()
  const { goBack } = useNavigation()

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancel', 'Cancel vehicle usage?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => removeVehicleUsage() },
    ])
  }

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(history)
    })

    goBack()
  }

  function handleArrivalRegister() {
    try {
      if (!history) {
        return Alert.alert(
          'Error',
          `Failed fetching data to register vehicle's arrival.`,
        )
      }

      realm.write(() => {
        history.status = 'arrival'
        history.updated_at = new Date()
      })

      Alert.alert('Arrival', 'Arrival registered successfully.')
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Error', `Failed to register vehicle's arrival.`)
    }
  }

  return (
    <Container>
      <Header title="Arrival" />
      <Content>
        <Label>Vehicle Plate</Label>

        <LicensePlate>{history?.license_plate}</LicensePlate>

        <Label>Goal</Label>

        <Description>{history?.description}</Description>

        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
          <Button title="Register Arrival" onPress={handleArrivalRegister} />
        </Footer>
      </Content>
    </Container>
  )
}

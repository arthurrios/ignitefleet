/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation, useRoute } from '@react-navigation/native'
import { Alert } from 'react-native'
import { useEffect, useState } from 'react'

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
  SyncMessage,
} from './styles'
import { X } from 'phosphor-react-native'

import { Header } from '@components/Header'
import { Button } from '@components/Button'
import { ButtonIcon } from '@components/ButtonIcon'
import { getLastSyncTimestamp } from '@libs/storage/syncStorage'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false)

  const route = useRoute()
  const { id } = route.params as RouteParamsProps

  const history = useObject(History, new BSON.UUID(id))
  const realm = useRealm()
  const { goBack } = useNavigation()

  const title = history?.status === 'departure' ? 'Arrival' : 'Details'

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

  useEffect(() => {
    const lastSync = getLastSyncTimestamp()

    setDataNotSynced(history!.updated_at.getTime() > lastSync)
  }, [])

  return (
    <Container>
      <Header title={title} />
      <Content>
        <Label>Vehicle Plate</Label>

        <LicensePlate>{history?.license_plate}</LicensePlate>

        <Label>Goal</Label>

        <Description>{history?.description}</Description>
      </Content>

      {dataNotSynced && (
        <SyncMessage>
          {history?.status === 'departure' ? 'Departure' : 'Arrival'} sync
          pending.
        </SyncMessage>
      )}
      {history?.status === 'departure' && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
          <Button title="Register Arrival" onPress={handleArrivalRegister} />
        </Footer>
      )}
    </Container>
  )
}

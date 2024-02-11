/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'

import { useQuery, useRealm } from '@libs/realm'
import { History } from '@libs/realm/schemas/History'

import { HomeHeader } from '@components/HomeHeader'
import { CarStatus } from '@components/CarStatus'

import { Container, Content } from './styles'
import { HistoryCard } from '@components/HistoryCard'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<History | null>(null)

  const { navigate } = useNavigation()
  const history = useQuery(History)
  const realm = useRealm()

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigate('arrival', { id: vehicleInUse?._id.toString() })
    } else {
      navigate('departure')
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = history.filtered(`status = 'departure'`)[0]
      setVehicleInUse(vehicle)
    } catch (error) {
      console.log(error)
      Alert.alert('Vehicle in use', 'Not possible to load vehicle in use.')
    }
  }

  function fetchHistory() {
    history.filtered(`status = 'arrival' SORT(created_at DESC)`)
  }

  useEffect(() => {
    fetchVehicleInUse()
  }, [])

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())

    return () => realm.removeListener('change', fetchVehicleInUse)
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [history])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          onPress={handleRegisterMovement}
          licencePlate={vehicleInUse?.license_plate}
        />

        <HistoryCard
          data={{ created: '20/04', licensePlate: 'XXX1212', isSync: false }}
        />
      </Content>
    </Container>
  )
}

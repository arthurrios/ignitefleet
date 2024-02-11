/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { useQuery } from '@libs/realm'
import { Alert } from 'react-native'

import { HomeHeader } from '@components/HomeHeader'
import { CarStatus } from '@components/CarStatus'

import { Container, Content } from './styles'
import { History } from '@libs/realm/schemas/History'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<History | null>(null)

  const { navigate } = useNavigation()
  const history = useQuery(History)

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigate('arrival', { id: vehicleInUse?._id.toString() })
    } else {
      navigate('departure')
    }
  }

  function fetchVehicle() {
    try {
      const vehicle = history.filtered(`status = 'departure'`)[0]
      setVehicleInUse(vehicle)
    } catch (error) {
      console.log(error)
      Alert.alert('Vehicle in use', 'Not possible to load vehicle in use.')
    }
  }

  useEffect(() => {
    fetchVehicle()
  }, [])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          onPress={handleRegisterMovement}
          licencePlate={vehicleInUse?.license_plate}
        />
      </Content>
    </Container>
  )
}

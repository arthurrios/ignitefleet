import { useNavigation } from '@react-navigation/native'

import { useQuery } from '@libs/realm'

import { HomeHeader } from '@components/HomeHeader'
import { CarStatus } from '@components/CarStatus'

import { Container, Content } from './styles'
import { History } from '@libs/realm/schemas/History'
import { useEffect } from 'react'

export function Home() {
  const { navigate } = useNavigation()

  const history = useQuery(History)

  function handleRegisterMovement() {
    navigate('departure')
  }

  function fetchVehicle() {
    console.log(history)
  }

  useEffect(() => {
    fetchVehicle()
  }, [])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus onPress={handleRegisterMovement} />
      </Content>
    </Container>
  )
}

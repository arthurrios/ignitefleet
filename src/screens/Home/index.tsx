/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert, FlatList } from 'react-native'
import dayjs from 'dayjs'

import { useQuery, useRealm } from '@libs/realm'
import { History } from '@libs/realm/schemas/History'

import { HomeHeader } from '@components/HomeHeader'
import { CarStatus } from '@components/CarStatus'

import { Container, Content, Label, Title } from './styles'
import { HistoryCard, HistoryCardProps } from '@components/HistoryCard'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<History | null>(null)
  const [vehicleHistory, setVehicleHistory] = useState<HistoryCardProps[]>([])

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
      Alert.alert('Vehicle in use', 'Failed to load vehicle in use.')
    }
  }

  function fetchHistory() {
    try {
      const response = history.filtered(
        `status = 'arrival' SORT(created_at DESC)`,
      )

      const formattedHistory = response.map((item) => {
        return {
          id: item._id!.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format(
            '[Departured] MM/DD/YYYY [at] hh:mm A',
          ),
        }
      })

      setVehicleHistory(formattedHistory)
    } catch (error) {
      console.log(error)
      Alert.alert('History', 'Failed to load history.')
    }
  }

  function handleHistoryDetails(id: string) {
    navigate('arrival', { id })
  }

  useEffect(() => {
    fetchVehicleInUse()
  }, [])

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())

    return () => {
      if (realm && !realm.isClosed)
        realm.removeListener('change', fetchVehicleInUse)
    }
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

        <Title>History</Title>
        <FlatList
          data={vehicleHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryCard
              data={item}
              onPress={() => handleHistoryDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>No registry of vehicles used</Label>}
        />
      </Content>
    </Container>
  )
}

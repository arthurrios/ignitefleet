/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert, FlatList } from 'react-native'
import dayjs from 'dayjs'
import Toast from 'react-native-toast-message'

import Realm from 'realm'
import { useQuery, useRealm } from '@libs/realm'
import { History } from '@libs/realm/schemas/History'
import { useUser } from '@realm/react'
import {
  getLastSyncTimestamp,
  saveLastSyncTimestamp,
} from '@libs/storage/syncStorage'

import { HomeHeader } from '@components/HomeHeader'
import { CarStatus } from '@components/CarStatus'

import { Container, Content, Label, Title } from './styles'
import { HistoryCard, HistoryCardProps } from '@components/HistoryCard'
import { TopMessage } from '@components/TopMessage'
import { CloudArrowUp } from 'phosphor-react-native'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<History | null>(null)
  const [vehicleHistory, setVehicleHistory] = useState<HistoryCardProps[]>([])
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null)

  const { navigate } = useNavigation()
  const history = useQuery(History)
  const user = useUser()
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

      const lastSync = getLastSyncTimestamp()

      const formattedHistory = response.map((item) => {
        return {
          id: item._id!.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at!.getTime(),
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

  function progressNotification(transferred: number, transferrable: number) {
    const percentage = (transferred / transferrable) * 100

    if (percentage === 100) {
      saveLastSyncTimestamp()
      fetchHistory()
      setPercentageToSync(null)

      Toast.show({
        type: 'info',
        text1: 'All data has been synced.',
      })
    }

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% synced.`)
    }
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

  useEffect(() => {
    const syncSession = realm.syncSession

    if (!syncSession) {
      return
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification,
    )
    return () => syncSession.removeProgressNotification(progressNotification)
  }, [])

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historyByUserQuery = realm
        .objects('History')
        .filtered(`user_id = '${user!.id}'`)

      mutableSubs.add(historyByUserQuery, { name: 'history_by_user' })
    })
  }, [realm])

  return (
    <Container>
      {percentageToSync && (
        <TopMessage title={percentageToSync} icon={CloudArrowUp} />
      )}
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

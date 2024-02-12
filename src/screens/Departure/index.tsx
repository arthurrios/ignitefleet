/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { Alert, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Car } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'
import {
  LocationAccuracy,
  useForegroundPermissions,
  watchPositionAsync,
  LocationSubscription,
  LocationObjectCoords,
} from 'expo-location'

import { useUser } from '@realm/react'
import { useRealm } from '@libs/realm'
import { History } from '@libs/realm/schemas/History'

import { Header } from '@components/Header'
import { LicensePlateInput } from '@components/LicensePlateInput'
import { TextAreaInput } from '@components/TextAreaInput'
import { Button } from '@components/Button'

import { Container, Content, Message } from './styles'
import { licensePlateValidate } from '@utils/licensePlateValidate'
import { getAddressLocation } from '@utils/getAddressLocation'
import { Loading } from '@components/Loading'
import { LocationInfo } from '@components/LocationInfo'
import { Map } from '@components/Map'

export function Departure() {
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null)

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions()

  const { goBack } = useNavigation()
  const realm = useRealm()
  const user = useUser()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Invalid plate',
          'The plate is invalid. Please inform the correct license plate.',
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Goal',
          'Please inform the goal for the vehicle use.',
        )
      }

      setIsRegistering(true)

      realm.write(() => {
        realm.create(
          'History',
          History.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          }),
        )
      })

      Alert.alert('Departure', 'Vehicle departure registered successfully.')
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Failed to register vehicle departure.')
      setIsRegistering(false)
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission()
  }, [])

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return
    }

    let subscription: LocationSubscription

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords)

        getAddressLocation(location.coords)
          .then((address) => {
            if (address) {
              setCurrentAddress(address)
            }
          })
          .finally(() => setIsLoadingLocation(false))
      },
    ).then((response) => (subscription = response))

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [!locationForegroundPermission?.granted])

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Departure" />
        <Message>
          You need to allow the app to access your location to use this feature.
          Please go to your device settings to grant this permission to the app.
        </Message>
      </Container>
    )
  }

  if (isLoadingLocation) {
    return <Loading />
  }

  return (
    <Container>
      <Header title="Departure" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={100}
      >
        {currentCoords && (
          <Map
            coordinates={[
              { latitude: -23.5657, longitude: -46.6515 },
              { latitude: -23.5694, longitude: -46.6467 },
            ]}
          />
        )}
        <Content>
          {currentAddress && (
            <LocationInfo
              label="Current location"
              description={currentAddress}
              icon={Car}
            />
          )}

          <LicensePlateInput
            ref={licensePlateRef}
            label="Vehicle Plate"
            placeholder="BRA1234"
            onSubmitEditing={() => descriptionRef.current?.focus()}
            returnKeyType="next"
            onChangeText={setLicensePlate}
            value={licensePlate}
          />

          <TextAreaInput
            ref={descriptionRef}
            label="Goal"
            placeholder="I'll use this vehicle to..."
            onSubmitEditing={handleDepartureRegister}
            returnKeyType="send"
            blurOnSubmit
            onChangeText={setDescription}
            value={description}
          />

          <Button
            title="Register Departure"
            onPress={handleDepartureRegister}
            isLoading={isRegistering}
          />
        </Content>
      </KeyboardAwareScrollView>
    </Container>
  )
}

import { IconBox } from '@components/IconBox'
import { Car, FlagCheckered } from 'phosphor-react-native'

import MapView, {
  LatLng,
  MapViewProps,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps'

type Props = MapViewProps & {
  coordinates: LatLng[]
}

export function Map({ coordinates, ...props }: Props) {
  const lastCoordinates = coordinates[coordinates.length - 1]

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ width: '100%', height: 200 }}
      region={{
        latitude: lastCoordinates.latitude,
        longitude: lastCoordinates.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      {...props}
    >
      <Marker coordinate={coordinates[0]}>
        <IconBox size="SMALL" icon={Car} />
      </Marker>

      {coordinates.length > 1 && (
        <Marker coordinate={lastCoordinates}>
          <IconBox size="SMALL" icon={FlagCheckered} />
        </Marker>
      )}
    </MapView>
  )
}

import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './app.routes'
import Toast from 'react-native-toast-message'
import { TopMessage } from '@components/TopMessage'

export function Routes() {
  return (
    <NavigationContainer>
      <AppRoutes />

      <Toast
        config={{
          info: ({ text1 }) => <TopMessage title={String(text1)} />,
        }}
      />
    </NavigationContainer>
  )
}

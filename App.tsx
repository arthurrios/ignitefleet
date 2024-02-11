/* eslint-disable camelcase */
import 'react-native-get-random-values'
import '@libs/dayjs'

import { WifiSlash } from 'phosphor-react-native'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useNetInfo } from '@react-native-community/netinfo'

import { ThemeProvider } from 'styled-components'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { AppProvider, UserProvider } from '@realm/react'
import { RealmProvider, syncConfig } from '@libs/realm'

import theme from '@theme/index'

import { SignIn } from '@screens/SignIn'
import { REALM_APP_ID } from '@env'
import { Routes } from '@routes/index'

import { Loading } from '@components/Loading'
import { TopMessage } from '@components/TopMessage'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })
  const netInfo = useNetInfo()

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          {!netInfo.isConnected && (
            <TopMessage title="You're are offline." icon={WifiSlash} />
          )}
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  )
}

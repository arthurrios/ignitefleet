/* eslint-disable camelcase */
import 'react-native-get-random-values'
import '@libs/dayjs'

import { ThemeProvider } from 'styled-components'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { AppProvider, UserProvider } from '@realm/react'

import theme from './src/theme'

import { SignIn } from './src/screens/SignIn'
import { Loading } from './src/components/Loading'
import { StatusBar } from 'react-native'
import { REALM_APP_ID } from '@env'
import { Routes } from '@routes/index'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RealmProvider } from '@libs/realm'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  )
}

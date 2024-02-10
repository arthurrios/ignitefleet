import { TouchableOpacity } from 'react-native'
import { Power } from 'phosphor-react-native'
import { useApp, useUser } from '@realm/react'

import theme from '@theme/index'

import { Container, Greeting, Message, Name, Picture } from './styles'

export function HomeHeader() {
  const user = useUser()
  const app = useApp()

  function handleLogOut() {
    app.currentUser?.logOut()
  }

  return (
    <Container>
      <Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184iAoffQof00ayfQay~qj[fQj["
      />

      <Greeting>
        <Message>Hello</Message>

        <Name>Arthur</Name>
      </Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogOut}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  )
}

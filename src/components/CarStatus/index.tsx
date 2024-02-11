import { Car, Key } from 'phosphor-react-native'
import { Container, IconBox, Message, TextHighlight } from './styles'
import { useTheme } from 'styled-components/native'
import { TouchableOpacityProps } from 'react-native'

type Props = TouchableOpacityProps & {
  licencePlate?: string | null
}

export function CarStatus({ licencePlate = null, ...props }: Props) {
  const theme = useTheme()

  const Icon = licencePlate ? Car : Key
  const message = licencePlate
    ? `Vehicle ${licencePlate} in use.`
    : `No vehicle in use.`
  const status = licencePlate ? 'arrival' : 'departure'

  return (
    <Container {...props}>
      <IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </IconBox>

      <Message>
        {message}{' '}
        <TextHighlight>Click here to register the {status}</TextHighlight>
      </Message>
    </Container>
  )
}

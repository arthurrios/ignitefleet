import { Car, Key } from 'phosphor-react-native'
import { Container, IconBox, Message, TextHighlight } from './styles'
import { useTheme } from 'styled-components/native'

type Props = {
  licencePlate?: string | null
}

export function CarStatus({ licencePlate = null }: Props) {
  const theme = useTheme()

  const Icon = licencePlate ? Key : Car
  const message = licencePlate
    ? `Vehicle ${licencePlate} in use.`
    : `No vehicle in use.`
  const status = licencePlate ? 'arrival' : 'departure'

  return (
    <Container>
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

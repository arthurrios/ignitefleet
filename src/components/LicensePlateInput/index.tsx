import { useTheme } from 'styled-components/native'
import { Container, Input, Label } from './styles'
import { TextInputProps } from 'react-native'

type Props = TextInputProps & {
  label: string
}

export function LicensePlateInput({ label, ...props }: Props) {
  const { COLORS } = useTheme()

  return (
    <Container>
      <Label>{label}</Label>

      <Input
        maxLength={7}
        autoCapitalize="characters"
        placeholderTextColor={COLORS.GRAY_400}
        {...props}
      />
    </Container>
  )
}

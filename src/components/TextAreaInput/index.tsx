/* eslint-disable react/display-name */
import { TextInput, TextInputProps } from 'react-native'
import { Container, Input, Label } from './styles'
import { useTheme } from 'styled-components/native'
import { forwardRef } from 'react'

type Props = TextInputProps & {
  label: string
}

const TextAreaInput = forwardRef<TextInput, Props>(
  ({ label, ...props }, ref) => {
    const { COLORS } = useTheme()

    return (
      <Container>
        <Label>{label}</Label>

        <Input
          ref={ref}
          placeholderTextColor={COLORS.GRAY_400}
          multiline
          autoCapitalize="sentences"
          {...props}
        />
      </Container>
    )
  },
)
export { TextAreaInput }

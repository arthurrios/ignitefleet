import { TouchableOpacityProps } from 'react-native'
import { Check, ClockClockwise } from 'phosphor-react-native'

import { Container, Departure, Info, LicensePlate } from './styles'
import { useTheme } from 'styled-components/native'

export type HistoryCardProps = {
  licensePlate: string
  created: string
  isSync: boolean
}

type Props = TouchableOpacityProps & {
  data: HistoryCardProps
}

export function HistoryCard({ data, ...props }: Props) {
  const { COLORS } = useTheme()

  return (
    <Container {...props}>
      <Info>
        <LicensePlate>{data.licensePlate}</LicensePlate>

        <Departure>{data.created}</Departure>
      </Info>

      {data.isSync ? (
        <Check size={24} color={COLORS.BRAND_LIGHT} />
      ) : (
        <ClockClockwise size={24} color={COLORS.GRAY_400} />
      )}
    </Container>
  )
}

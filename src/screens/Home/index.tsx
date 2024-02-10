import { HomeHeader } from '@components/HomeHeader'
import { Container, Content } from './styles'
import { CarStatus } from '@components/CarStatus'

export function Home() {
  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus licencePlate="XXX-0000" />
      </Content>
    </Container>
  )
}

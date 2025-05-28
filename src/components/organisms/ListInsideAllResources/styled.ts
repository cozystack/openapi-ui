import styled from 'styled-components'
import { Card } from 'antd'

const Grid = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  min-height: 80vh;
`

const FullHeighCard = styled(Card)`
  height: 100%;
`

export const Styled = {
  Grid,
  FullHeighCard,
}

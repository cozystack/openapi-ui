import styled from 'styled-components'
import { NAV_HEIGHT } from 'constants/blocksSizes'

export const NavigationContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 18px;
  height: ${NAV_HEIGHT}px;
  min-height: ${NAV_HEIGHT}px;
`

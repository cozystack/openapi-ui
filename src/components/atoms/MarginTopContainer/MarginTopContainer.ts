import styled from 'styled-components'

type TMarinTopContainerProps = {
  $top: number
}

export const MarginTopContainer = styled.div<TMarinTopContainerProps>`
  margin-top: ${({ $top }) => $top}px;
`

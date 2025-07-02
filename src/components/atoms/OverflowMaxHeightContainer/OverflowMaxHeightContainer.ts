import styled from 'styled-components'

type TOverflowMaxHeightContainerProps = {
  $maxHeight: number
}

export const OverflowMaxHeightContainer = styled.div<TOverflowMaxHeightContainerProps>`
  overflow-x: auto;
  scrollbar-width: thin;
  height: ${({ $maxHeight }) => $maxHeight}px;
`

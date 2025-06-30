import styled from 'styled-components'
import { MAIN_CONTENT_HORIZONTAL_PADDING } from 'constants/blocksSizes'

type TPaddingContainerProps = {
  $height: number
}

const PaddingContainer = styled.div<TPaddingContainerProps>`
  padding: 12px ${MAIN_CONTENT_HORIZONTAL_PADDING}px;
  height: ${({ $height }) => $height}px;
`

type TBackgroundContainerProps = {
  $bgColor: string
  $borderRadius: number
}

const BackgroundContainer = styled.div<TBackgroundContainerProps>`
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  width: 100%;
`

export const Styled = {
  PaddingContainer,
  BackgroundContainer,
}

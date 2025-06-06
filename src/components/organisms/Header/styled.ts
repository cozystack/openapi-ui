import styled from 'styled-components'

const PaddingContainer = styled.div`
  padding: 10px 48px;
`

type TBackgroundContainerProps = {
  $bgColor: string
  $borderColor: string
}

const BackgroundContainer = styled.div<TBackgroundContainerProps>`
  border-bottom: 1px solid ${({ $borderColor }) => $borderColor};
  background-color: ${({ $bgColor }) => $bgColor};
  width: 100%;
`

export const Styled = {
  PaddingContainer,
  BackgroundContainer,
}

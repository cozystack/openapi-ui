import styled from 'styled-components'

type TContainerProps = {
  $height?: number
}

const Container = styled.div<TContainerProps>`
  height: ${({ $height }) => ($height ? `${$height}px` : '75vh')};
`

const OverflowContainer = styled.div`
  overflow-x: auto;
  scrollbar-width: thin;
`

export const Styled = {
  Container,
  OverflowContainer,
}

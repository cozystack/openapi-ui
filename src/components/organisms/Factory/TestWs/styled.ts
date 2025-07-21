import styled from 'styled-components'

const FullWidthDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

type TCustomCardProps = {
  $isVisible?: boolean
}

const CustomCard = styled.div<TCustomCardProps>`
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  max-height: calc(100vh - 158px);
  margin: 24px;
  /* overflow-y: auto; */
  /* background: black; */

  * {
    scrollbar-width: thin;
  }
`

export const Styled = {
  FullWidthDiv,
  CustomCard,
}

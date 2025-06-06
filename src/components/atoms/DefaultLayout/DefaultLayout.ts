import styled from 'styled-components'

type TLayoutProps = {
  $bgColor: string
}

const Layout = styled.div<TLayoutProps>`
  background: ${({ $bgColor }) => $bgColor};
  min-height: 100vh;
  width: 100%;
`

const ContentContainer = styled.div`
  min-height: 100vh;
  margin: 0;
`

type TContentPaddingProps = {
  $isFederation?: boolean
}

const ContentPadding = styled.div<TContentPaddingProps>`
  padding: ${({ $isFederation }) => ($isFederation ? 0 : '20px 48px')};
  min-height: calc(100vh - 53px - 52px - 70px);
  display: flex;
  flex-flow: column;
`

export const DefaultLayout = {
  Layout,
  ContentContainer,
  ContentPadding,
}

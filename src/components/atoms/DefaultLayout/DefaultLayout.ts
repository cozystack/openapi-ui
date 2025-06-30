import styled from 'styled-components'
import { HEAD_FIRST_ROW, FOOTER_HEIGHT, MAIN_CONTENT_HORIZONTAL_PADDING } from 'constants/blocksSizes'

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
  padding: ${({ $isFederation }) => ($isFederation ? 0 : `0 ${MAIN_CONTENT_HORIZONTAL_PADDING}px`)};
  min-height: calc(100vh - ${HEAD_FIRST_ROW}px - ${FOOTER_HEIGHT}px);
  display: flex;
  flex-flow: column;
`

export const DefaultLayout = {
  Layout,
  ContentContainer,
  ContentPadding,
}

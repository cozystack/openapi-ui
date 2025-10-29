import styled from 'styled-components'

type TRootProps = {
  $maxHeight: number
}

const Root = styled.div<TRootProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight}px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`

const Header = styled.header`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
`

const Status = styled.span`
  font-size: 12px;
  color: #6b7280;
`

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`

const Sentinel = styled.div`
  height: 1px;
`

const Footer = styled.footer`
  border-top: 1px solid #f0f2f5;
  padding: 8px 12px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Styled = {
  Root,
  Header,
  Title,
  Status,
  List,
  Sentinel,
  Footer,
}

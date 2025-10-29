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
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`

const Header = styled.header`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Status = styled.span`
  font-size: 12px;
  color: #6b7280;
`

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 8px 8px 72px;
  z-index: 2;
`

type TTimelineProps = {
  $colorText: string
  $maxHeight: number
}

const Timeline = styled.div<TTimelineProps>`
  width: 100%;
  height: ${({ $maxHeight }) => $maxHeight}px;
  position: absolute;
  top: 40px;
  left: 36px;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    width: 1px;
    background: ${({ $colorText }) => $colorText};
    pointer-events: none;
    height: 100%;
  }
`

const Sentinel = styled.div`
  height: 1px;
`

export const Styled = {
  Root,
  Header,
  Status,
  Timeline,
  List,
  Sentinel,
}

import styled from 'styled-components'
import { Card, Tag } from 'antd'

type TCustomCardProps = {
  $hoverColor: string
  $isDisabled?: boolean
}

const CustomCard = styled(Card)<TCustomCardProps>`
  position: relative;
  width: 256px;
  min-height: 256px;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};

  &:hover {
    border-color: ${({ $hoverColor, $isDisabled }) => !$isDisabled && $hoverColor};
  }

  .ant-card-body {
    height: 100%;
  }
`
const ControlsAndImageContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const ImageContainer = styled.div`
  min-width: 50px;
  min-height: 50px;

  svg {
    width: 50px;
    height: 50px;
  }
`

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ControlsItem = styled.div`
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }
`

const FlexGrow = styled.div`
  flex-grow: 1;
`

const TagsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
`

const CustomTag = styled(Tag)`
  padding: 0 12px;
  margin-right: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-right: 0;
  }
`

export const Styled = {
  CustomCard,
  ControlsAndImageContainer,
  ImageContainer,
  ControlsContainer,
  ControlsItem,
  FlexGrow,
  TagsContainer,
  CustomTag,
}

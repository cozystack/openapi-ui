import styled from 'styled-components'
import { Button } from 'antd'

const FullWidthButton = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`

const Name = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const Styled = {
  FullWidthButton,
  Name,
}

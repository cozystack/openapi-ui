import styled from 'styled-components'
import { Button } from 'antd'

const FullWidthButton = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  color: ${({ theme }) => theme.colorText};
  padding-left: 16px;
`

export const Styled = {
  FullWidthButton,
}

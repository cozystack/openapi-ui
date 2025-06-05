import styled from 'styled-components'
import { Card } from 'antd'

const CustomCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 238px;
  box-shadow:
    0px 6px 16px 0px #00000014,
    0px 3px 6px -4px #0000001f,
    0px 9px 28px 8px #0000000d;

  .ant-card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 238px;
    overflow-x: auto;
    padding: 8px;
  }
`

export const Styled = {
  CustomCard,
}

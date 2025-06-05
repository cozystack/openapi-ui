import styled from 'styled-components'
import { Typography } from 'antd'

const BigValue = styled(Typography.Text)`
  font-size: 36px;
  line-height: 36px;
  font-weight: 700;
  /* stylelint-disable-next-line value-no-vendor-prefix */
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -ms-line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  word-break: break-all;
`

export const Styled = {
  BigValue,
}

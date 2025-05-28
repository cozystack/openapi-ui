import styled from 'styled-components'
import { Typography } from 'antd'

const ActionMenuPlaceholder = styled.div`
  width: 45.33px;
  height: 1px;
`

const BigValue = styled(Typography.Text)`
  font-size: 24px;
  line-height: 32px;
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
  ActionMenuPlaceholder,
  BigValue,
}

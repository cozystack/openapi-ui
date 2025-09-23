import React, { FC } from 'react'
import { Typography } from 'antd'
import { getFooterText } from 'utils/env'
import { Styled } from './styled'

export const Footer: FC = () => {
  const footerText = getFooterText()
  
  return (
    <Styled.Container>
      <Typography.Text type="secondary">{footerText} © {new Date().getFullYear()}</Typography.Text>
    </Styled.Container>
  )
}

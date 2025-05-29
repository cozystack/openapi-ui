import React, { FC } from 'react'
import { FileTextOutlined } from '@ant-design/icons'
import { Styled } from './styled'

export const Documentation: FC = () => {
  const platformDocumentationUrl = '/docs'

  return (
    <Styled.FullWidthButton type="text" onClick={() => window.open(platformDocumentationUrl, '_blank')}>
      <FileTextOutlined />
      Documentaion
    </Styled.FullWidthButton>
  )
}

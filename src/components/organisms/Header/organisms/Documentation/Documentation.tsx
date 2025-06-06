import React, { FC } from 'react'
import { Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export const Documentation: FC = () => {
  const platformDocumentationUrl = '/docs'

  return (
    <Button type="text" onClick={() => window.open(platformDocumentationUrl, '_blank')}>
      <QuestionCircleOutlined />
    </Button>
  )
}

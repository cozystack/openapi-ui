import React, { FC } from 'react'
import { Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { DOCS_URL } from 'constants/customizationApiGroupAndVersion'

export const Documentation: FC = () => {
  return (
    <Button type="text" onClick={() => window.open(typeof DOCS_URL === 'string' ? DOCS_URL : '/docs', '_blank')}>
      <QuestionCircleOutlined />
    </Button>
  )
}

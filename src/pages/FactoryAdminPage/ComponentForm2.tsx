/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { ComponentType } from './types'
import { AntdTextForm } from './AntdTextForm'
import { AntdCardForm } from './AntdCardForm'
import { TextWithIdForm } from './TextWithIdForm'

interface ComponentFormProps {
  type: ComponentType
  data: any
  onSave: (data: any) => void
}

export const ComponentForm: React.FC<ComponentFormProps> = ({ type, data, onSave }) => {
  switch (type) {
    case 'antdText':
      return <AntdTextForm initialValues={data} onSave={onSave} />
    case 'antdCard':
      return <AntdCardForm initialValues={data} onSave={onSave} />
    case 'partsOfUrl':
    case 'multiQuery':
    case 'parsedText':
      return <TextWithIdForm initialValues={data} onSave={onSave} />
    default:
      return <div>Unsupported component type</div>
  }
}

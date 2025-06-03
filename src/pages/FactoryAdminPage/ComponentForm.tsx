/* eslint-disable @typescript-eslint/no-explicit-any */
// src/ComponentForm.tsx
import React from 'react'
import { DynamicComponentForm } from './DynamicComponentForm'
import type { ComponentType } from './types'

interface ComponentFormProps {
  type: ComponentType
  data: any
  onSave: (data: any) => void
}

export const ComponentForm: React.FC<ComponentFormProps> = ({ type, data, onSave }) => {
  return <DynamicComponentForm type={type} initialValues={data} onSave={onSave} />
}

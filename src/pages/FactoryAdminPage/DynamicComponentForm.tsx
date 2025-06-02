/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/DynamicComponentForm.tsx
import React, { useEffect } from 'react'
import { Form, Input, Select, Switch, Button, Typography } from 'antd'

import { componentMetaMap } from './utils'
import type { ComponentType } from './types'

const { TextArea } = Input
const { Option } = Select

interface DynamicComponentFormProps {
  type: ComponentType
  initialValues: any
  onSave: (data: any) => void
}

export const DynamicComponentForm: React.FC<DynamicComponentFormProps> = ({ type, initialValues, onSave }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [initialValues, form])

  const handleSubmit = (values: any) => {
    try {
      const parsedValues = Object.entries(values).reduce((acc, [key, value]) => {
        const meta = componentMetaMap[type]?.[key]

        if (meta?.inputType === 'json') {
          if (typeof value === 'string') {
            try {
              acc[key] = JSON.parse(value)
            } catch (e) {
              console.warn(`Invalid JSON for ${key}:`, value)
              acc[key] = value // Keep original string
            }
          } else {
            acc[key] = value // Already parsed or non-string
          }
        } else {
          acc[key] = value
        }

        return acc
      }, {} as any)

      onSave(parsedValues)
    } catch (e) {
      console.log('Invalid JSON input', e)
    }
  }

  const renderFormItem = (prop: string, meta: any) => {
    const value = initialValues[prop]

    switch (meta.inputType) {
      case 'text':
        return <Input placeholder={meta.label} />
      case 'textarea':
        return <TextArea rows={4} placeholder={meta.label} />
      case 'json':
        return (
          <TextArea
            rows={4}
            placeholder={`e.g. {"color": "red"}`}
            defaultValue={value ? JSON.stringify(value, null, 2) : ''}
          />
        )
      case 'boolean':
        return <Switch defaultChecked={value} />
      case 'select':
        return (
          <Select defaultValue={value}>
            {meta.options?.map((opt: { label: string; value: string }) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        )
      case 'number':
        return <Input type="number" placeholder={meta.label} />
      default:
        return <Input />
    }
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      {/* ID (always present and read-only) */}
      <Form.Item label="ID" name="id" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>

      {/* Render dynamic props */}
      {Object.entries(componentMetaMap[type] || {}).map(([prop, meta]) => (
        <Form.Item key={prop} label={meta.label} name={prop}>
          {renderFormItem(prop, meta)}
        </Form.Item>
      ))}

      {/* Submit Button */}
      <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
        Save
      </Button>
    </Form>
  )
}

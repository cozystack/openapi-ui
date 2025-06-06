/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { Form, Input, Select, Button } from 'antd'

interface AntdTextFormProps {
  initialValues: any
  onSave: (data: any) => void
}

export const AntdTextForm: React.FC<AntdTextFormProps> = ({ initialValues, onSave }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [initialValues, form])

  const handleSubmit = (values: any) => {
    try {
      if (values.style) {
        values.style = JSON.parse(values.style)
      }
    } catch (e) {
      console.log('Invalid JSON for style', e)
    }
    onSave(values)
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={initialValues}>
      <Form.Item label="ID" name="id" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item label="Text" name="text" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Type" name="type">
        <Select allowClear>
          <Select.Option value="">Default</Select.Option>
          <Select.Option value="secondary">Secondary</Select.Option>
          <Select.Option value="success">Success</Select.Option>
          <Select.Option value="warning">Warning</Select.Option>
          <Select.Option value="danger">Danger</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Style (JSON)" name="style">
        <Input.TextArea rows={4} placeholder='e.g. {"color": "red"}' />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  )
}

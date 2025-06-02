/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { Form, Input, Select, Button, Switch } from 'antd'

const { TextArea } = Input
const { Option } = Select

interface AntdCardFormProps {
  initialValues: any // This would be `TDynamicComponentsAppTypeMap['antdCard']`
  onSave: (data: any) => void
}

export const AntdCardForm: React.FC<AntdCardFormProps> = ({ initialValues, onSave }) => {
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
      return
    }

    onSave(values)
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={initialValues}>
      <Form.Item label="ID" name="id" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>

      <Form.Item label="Title" name="title">
        <Input placeholder="Card title" />
      </Form.Item>

      <Form.Item label="Bordered" name="bordered" valuePropName="checked">
        <Switch defaultChecked />
      </Form.Item>

      <Form.Item label="Cover Image URL" name="cover">
        <Input placeholder="https://example.com/image.jpg" />
      </Form.Item>

      <Form.Item label="Style (JSON)" name="style">
        <TextArea rows={4} placeholder='e.g. {"width": "300px", "margin": "10px"}' />
      </Form.Item>

      <Form.Item label="Size" name="size">
        <Select defaultValue="default">
          <Option value="default">Default</Option>
          <Option value="small">Small</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Extra Content (Right Side)" name="extra">
        <Input placeholder="Extra content like links or buttons" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  )
}

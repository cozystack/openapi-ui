import React, { useEffect } from 'react'
import { Form, Input, Button } from 'antd'

interface TextWithIdFormProps {
  initialValues: {
    id: number
    text: string
  }
  onSave: (data: { id: number; text: string }) => void
}

export const TextWithIdForm: React.FC<TextWithIdFormProps> = ({ initialValues, onSave }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [initialValues, form])

  const handleSubmit = (values: { id: number; text: string }) => {
    onSave(values)
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={initialValues}>
      <Form.Item label="ID" name="id" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item label="Text" name="text" rules={[{ required: true }]}>
        <Input.TextArea
          rows={4}
          placeholder="Enter text (you can use variables like {5}, {reqs[0]['metadata']} etc.)"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  )
}

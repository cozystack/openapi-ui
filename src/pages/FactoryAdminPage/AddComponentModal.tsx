import React, { useState } from 'react'
import { Modal, Button, Form, Select } from 'antd'
import { ComponentType } from './types'

export const componentTypes: ComponentType[] = [
  'antdText',
  'antdCard',
  'antdFlex',
  'antdRow',
  'antdCol',
  'partsOfUrl',
  'multiQuery',
  'parsedText',
]

interface AddComponentModalProps {
  onAdd: (type: ComponentType) => void
  title?: string
}

export const AddComponentModal: React.FC<AddComponentModalProps> = ({ onAdd, title = 'Add Component' }) => {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = (values: { type: ComponentType }) => {
    onAdd(values.type)
    setVisible(false)
    form.resetFields()
  }

  return (
    <>
      <Button onClick={() => setVisible(true)}>Add</Button>
      <Modal title={title} visible={visible} onCancel={() => setVisible(false)} footer={null}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item label="Component Type" name="type" rules={[{ required: true }]}>
            <Select>
              {componentTypes.map(type => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form>
      </Modal>
    </>
  )
}

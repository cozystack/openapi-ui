/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Modal } from 'antd'
import { ComponentForm } from './ComponentForm'
import { Component } from './types'

interface EditComponentModalProps {
  component: Component
  onSave: (component: Component) => void
}

export const EditComponentModal: React.FC<EditComponentModalProps> = ({ component, onSave }) => {
  const [open, setOpen] = useState(false)

  const handleSave = (data: any) => {
    onSave({ ...component, data })
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}>Edit</button>
      <Modal
        title={`Edit ${component.type}`}
        open={open} // ✅ Use open instead of visible
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <ComponentForm type={component.type} data={component.data} onSave={handleSave} />
      </Modal>
    </>
  )
}

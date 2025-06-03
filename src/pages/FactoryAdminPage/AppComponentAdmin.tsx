/* eslint-disable no-console */
/* TODO: REFACTOR */
import React, { useState } from 'react'
import { Button, Typography, Modal, Input } from 'antd'

import { ComponentNode } from './ComponentNode'
import { AddComponentModal } from './AddComponentModal'
import { Component, ComponentType, TDynamicComponentsAppTypeMap } from './types'

const { Title } = Typography
const { TextArea } = Input

export const AppComponentAdmin: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([])
  const [maxId, setMaxId] = useState(1)
  const [jsonOutput, setJsonOutput] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const getNewId = () => {
    const newId = maxId + 1
    setMaxId(newId)
    return newId
  }

  const generateDefaultData = (type: ComponentType): TDynamicComponentsAppTypeMap[ComponentType] => {
    const base = { id: getNewId() }
    switch (type) {
      case 'antdText':
        return { ...base, text: '' }
      case 'antdCard':
        return { ...base, title: '' }
      case 'antdFlex':
        return { ...base, justify: 'start', align: 'start' }
      case 'antdRow':
        return { ...base }
      case 'antdCol':
        return { ...base, span: 12 }
      case 'partsOfUrl':
      case 'multiQuery':
      case 'parsedText':
        return { ...base, text: '' }
      default:
        return base
    }
  }

  const addComponent = (type: ComponentType) => {
    const newComponent: Component = {
      type,
      data: generateDefaultData(type),
      children: [],
    }
    setComponents(prev => [...prev, newComponent])
  }

  const updateComponent = (index: number, updated: Component) => {
    setComponents(prev => {
      const newComponents = [...prev]
      newComponents[index] = updated
      return newComponents
    })
  }

  const deleteComponent = (index: number) => {
    setComponents(prev => {
      const newComponents = [...prev]
      newComponents.splice(index, 1)
      return newComponents
    })
  }

  const handleSaveAll = () => {
    const output = JSON.stringify(
      {
        data: components,
      },
      null,
      2,
    )
    setJsonOutput(output)
    setIsModalVisible(true)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput)
    console.log('Copied to clipboard!')
  }

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Component Admin Panel</Title>
      <AddComponentModal onAdd={addComponent} title="Add Root Component" />

      <div style={{ marginTop: 20 }}>
        {components.map((component, index) => (
          <ComponentNode
            key={component.data.id}
            component={component}
            onUpdate={updated => updateComponent(index, updated)}
            onDelete={() => deleteComponent(index)}
          />
        ))}
      </div>

      {/* Save Button */}
      <Button type="primary" onClick={handleSaveAll} style={{ marginTop: 20 }}>
        Save All as JSON
      </Button>

      {/* JSON Output Modal */}
      <Modal
        title="Final JSON Output"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="copy" onClick={handleCopyToClipboard}>
            Copy to Clipboard
          </Button>,
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <TextArea value={jsonOutput} readOnly rows={20} style={{ fontFamily: 'monospace' }} />
      </Modal>
    </div>
  )
}

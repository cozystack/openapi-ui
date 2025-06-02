import React from 'react'
import { Button } from 'antd'
import { Component, ComponentType } from './types'
import { EditComponentModal } from './EditComponentModal'
import { AddComponentModal } from './AddComponentModal'
import { generateDefaultData } from './utils'

interface ComponentNodeProps {
  component: Component
  onUpdate: (component: Component) => void
  onDelete: () => void
}

export const ComponentNode: React.FC<ComponentNodeProps> = ({ component, onUpdate, onDelete }) => {
  const handleAddChild = (type: ComponentType) => {
    const newChild: Component = {
      type,
      data: generateDefaultData(type),
      children: [],
    }
    const updated = { ...component }
    updated.children = updated.children ? [...updated.children, newChild] : [newChild]
    onUpdate(updated)
  }

  const handleUpdateChild = (index: number, updatedChild: Component) => {
    const updated = { ...component }
    updated.children![index] = updatedChild
    onUpdate(updated)
  }

  const handleDeleteChild = (index: number) => {
    const updated = { ...component }
    updated.children!.splice(index, 1)
    onUpdate(updated)
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: 10, margin: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          <strong>{component.type}</strong> (ID: {component.data.id})
        </span>
        <div>
          <EditComponentModal component={component} onSave={onUpdate} />
          <AddComponentModal onAdd={handleAddChild} title="Add Child" />
          <Button danger size="small" onClick={onDelete} style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </div>
      </div>
      <div style={{ marginLeft: 20, marginTop: 10 }}>
        {component.children?.map((child, idx) => (
          <ComponentNode
            key={child.data.id}
            component={child}
            onUpdate={updated => handleUpdateChild(idx, updated)}
            onDelete={() => handleDeleteChild(idx)}
          />
        ))}
      </div>
    </div>
  )
}

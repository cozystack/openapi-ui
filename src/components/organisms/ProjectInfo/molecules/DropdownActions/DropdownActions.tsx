import React, { FC } from 'react'
import { Button, Dropdown } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'

type TDropdownActionsProps = {
  onDelete?: () => void
  onUpdate?: () => void
}

export const DropdownActions: FC<TDropdownActionsProps> = ({ onDelete, onUpdate }) => {
  const getDropdownItems = () => {
    const items = []
    if (onUpdate) {
      items.push({
        key: 'update',
        label: (
          <div
            onClick={e => {
              e.stopPropagation()
              onUpdate()
            }}
          >
            Edit
          </div>
        ),
      })
    }
    if (onDelete) {
      items.push({
        key: 'delete',
        label: (
          <div
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
          >
            Delete
          </div>
        ),
      })
    }
    return items
  }

  return (
    <Dropdown placement="bottom" menu={{ items: getDropdownItems() }} trigger={['click']}>
      <Button
        type="text"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <EllipsisOutlined />
      </Button>
    </Dropdown>
  )
}

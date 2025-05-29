import React, { FC } from 'react'
import { Tooltip, Dropdown } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { ThemeSelector } from 'components'
import { useAuth } from 'hooks/useAuth'
import { logout } from 'api/auth'
import { Styled } from './styled'

export const User: FC = () => {
  const { fullName } = useAuth()

  return (
    <Dropdown
      placement="top"
      menu={{
        items: [
          {
            key: '1',
            label: <ThemeSelector />,
          },
          {
            key: '2',
            label: (
              <div onClick={() => logout()}>
                <LogoutOutlined /> Logout
              </div>
            ),
          },
        ],
      }}
      trigger={['click']}
    >
      <Styled.FullWidthButton type="text">
        {fullName && fullName.length > 25 ? (
          <Tooltip title={fullName}>
            <Styled.Name>{fullName.slice(25)}</Styled.Name>
          </Tooltip>
        ) : (
          <Styled.Name>{fullName || 'User'}</Styled.Name>
        )}
      </Styled.FullWidthButton>
    </Dropdown>
  )
}

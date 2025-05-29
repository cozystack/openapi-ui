import React, { FC, useCallback } from 'react'
import { notification } from 'antd'
import { FireOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { Styled } from './styled'

type TAccessGroupsProps = {
  clusterName: string | undefined
  instanceName: string
  projectName: string
}

export const AccessGroups: FC<TAccessGroupsProps> = ({ clusterName, projectName, instanceName }) => {
  const [api, contextHolder] = notification.useNotification()
  const clusterList = useSelector((state: RootState) => state.clusterList.clusterList)

  const cluster = clusterList ? clusterList.find(({ name }) => name === clusterName) : undefined
  const clusterTenant = cluster?.tenant || ''

  const shortName = instanceName.startsWith(`${projectName}-`)
    ? instanceName.substring(`${projectName}-`.length)
    : instanceName

  const value = `${projectName}:${shortName}:${clusterTenant}`

  const renderValue = value.length > 37 ? `${value.slice(0, 34)}...` : value

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    api.success({
      message: 'Access Group copied:',
      description: value,
      key: 'copy-success',
    })
  }, [value, api])

  return (
    <>
      {contextHolder}
      <Styled.FullWidthButton type="text" icon={<FireOutlined />} onClick={handleCopy}>
        {renderValue}
      </Styled.FullWidthButton>
    </>
  )
}

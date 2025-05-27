import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { HomeOutlined } from '@ant-design/icons'
import { ListCrdsByApiGroup } from 'components'
import { BaseTemplate } from 'templates'

type TListCrdByApiGroupPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListCrdByApiGroupPage: FC<TListCrdByApiGroupPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, apiGroup, apiVersion, apiExtensionVersion } = useParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const breadcrumbItems = [
    {
      title: (
        <Link to={`${baseprefix}/cluster-list`}>
          <HomeOutlined />
        </Link>
      ),
      key: 'home',
    },
    {
      title: <Link to={`${baseprefix}/${clusterName}${namespace ? `/${namespace}` : ''}/apis`}>API Resources</Link>,
      key: 'list-api',
    },
    {
      title: 'CRD by Group',
      key: 'crd-by-group',
    },
    {
      title: apiGroup,
      key: 'api-group',
    },
  ]

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <Breadcrumb items={breadcrumbItems} separator=">" />
      <Spacer $space={16} $samespace />
      {apiGroup && apiVersion && apiExtensionVersion && (
        <ListCrdsByApiGroup
          namespace={namespace}
          apiGroup={apiGroup}
          apiVersion={apiVersion}
          apiExtensionVersion={apiExtensionVersion}
        />
      )}
    </BaseTemplate>
  )
}

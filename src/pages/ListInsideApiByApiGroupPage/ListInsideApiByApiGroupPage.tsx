import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { ListInsideApisByApiGroup } from 'components'
import { BaseTemplate } from 'templates'

type TListInsideApiByApiGroupPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListInsideApiByApiGroupPage: FC<TListInsideApiByApiGroupPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, apiGroup, apiVersion } = useParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const breadcrumbItems = [
    {
      title: <Link to={`${baseprefix}/inside/clusters`}>In-Cloud: inside</Link>,
      key: 'home',
    },
    {
      title: (
        <Link to={`${baseprefix}/inside/${clusterName}${namespace ? `/${namespace}` : ''}/apis`}>API Resources</Link>
      ),
      key: 'list-api',
    },
    {
      title: 'Api Resources by Group',
      key: 'api-resources-by-group',
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
      {apiGroup && apiVersion && (
        <ListInsideApisByApiGroup namespace={namespace} apiGroup={apiGroup} apiVersion={apiVersion} />
      )}
    </BaseTemplate>
  )
}

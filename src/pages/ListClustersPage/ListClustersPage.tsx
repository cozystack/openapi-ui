import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { ContentCard, ListClusters } from 'components'
import { BaseTemplate } from 'templates'

type TListClustersPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListClustersPage: FC<TListClustersPageProps> = ({ forcedTheme }) => {
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const breadcrumbItems = [
    {
      title: <Link to={`${baseprefix}/`}>In-Cloud</Link>,
      key: 'home',
    },
    {
      title: 'Cluster List',
      key: 'cluster-list',
    },
  ]

  return (
    <BaseTemplate withNoCluster forcedTheme={forcedTheme}>
      <Breadcrumb items={breadcrumbItems} separator=">" />
      <Spacer $space={20} $samespace />
      <ContentCard flexGrow={1}>
        <ListClusters />
      </ContentCard>
    </BaseTemplate>
  )
}

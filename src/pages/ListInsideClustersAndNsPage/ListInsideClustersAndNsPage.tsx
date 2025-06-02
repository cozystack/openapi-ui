import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { ContentCard, ListInsideClusterAndNs } from 'components'
import { BaseTemplate } from 'templates'

type TListInsideClustersAndNsPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListInsideClustersAndNsPage: FC<TListInsideClustersAndNsPageProps> = ({ forcedTheme }) => {
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const breadcrumbItems = [
    {
      title: <Link to={`${baseprefix}/inside/clusters`}>In-Cloud: inside</Link>,
      key: 'home',
    },
    {
      title: 'Select cluster / namespace',
      key: 'select-cluster-and-ns',
    },
  ]

  return (
    <BaseTemplate withNoCluster forcedTheme={forcedTheme}>
      <Breadcrumb items={breadcrumbItems} separator=">" />
      <Spacer $space={20} $samespace />
      <ContentCard flexGrow={1}>
        <ListInsideClusterAndNs />
      </ContentCard>
    </BaseTemplate>
  )
}

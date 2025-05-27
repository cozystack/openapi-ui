import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { HomeOutlined } from '@ant-design/icons'
import { AllResourcesList } from 'components'
import { BaseTemplate } from 'templates'

type TListApiPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListApiPage: FC<TListApiPageProps> = ({ forcedTheme }) => {
  const { namespace } = useParams()
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
      title: 'API Resources',
      key: 'list-api',
    },
  ]

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <Breadcrumb items={breadcrumbItems} separator=">" />
      <Spacer $space={16} $samespace />
      <AllResourcesList namespace={namespace} />
    </BaseTemplate>
  )
}

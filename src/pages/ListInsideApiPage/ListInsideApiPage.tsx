import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { ListInsideAllResources } from 'components'
import { BaseTemplate } from 'templates'

type TListInsideApiPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const ListInsideApiPage: FC<TListInsideApiPageProps> = ({ forcedTheme, inside }) => {
  const { namespace } = useParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const breadcrumbItems = [
    {
      title: <Link to={`${baseprefix}/inside/clusters`}>In-Cloud: inside</Link>,
      key: 'home',
    },
    {
      title: 'API Resources',
      key: 'list-api',
    },
  ]

  return (
    <BaseTemplate forcedTheme={forcedTheme} inside={inside}>
      <Breadcrumb items={breadcrumbItems} separator=">" />
      <Spacer $space={20} $samespace />
      <ListInsideAllResources namespace={namespace} />
    </BaseTemplate>
  )
}

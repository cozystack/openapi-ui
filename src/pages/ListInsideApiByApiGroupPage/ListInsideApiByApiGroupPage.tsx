import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams } from 'react-router-dom'
import { ListInsideApisByApiGroup, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TListInsideApiByApiGroupPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const ListInsideApiByApiGroupPage: FC<TListInsideApiByApiGroupPageProps> = ({ forcedTheme, inside }) => {
  const { namespace, apiGroup, apiVersion } = useParams()

  return (
    <BaseTemplate forcedTheme={forcedTheme} inside={inside}>
      <ManageableBreadcrumbs inside />
      <Spacer $space={20} $samespace />
      {apiGroup && apiVersion && (
        <ListInsideApisByApiGroup namespace={namespace} apiGroup={apiGroup} apiVersion={apiVersion} />
      )}
    </BaseTemplate>
  )
}

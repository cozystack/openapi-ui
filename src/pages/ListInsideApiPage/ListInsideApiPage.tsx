import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams } from 'react-router-dom'
import { ListInsideAllResources, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TListInsideApiPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const ListInsideApiPage: FC<TListInsideApiPageProps> = ({ forcedTheme, inside }) => {
  const { namespace } = useParams()

  return (
    <BaseTemplate forcedTheme={forcedTheme} inside={inside}>
      <ManageableBreadcrumbs inside />
      <Spacer $space={20} $samespace />
      <ListInsideAllResources namespace={namespace} />
    </BaseTemplate>
  )
}

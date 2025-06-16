import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams } from 'react-router-dom'
import { ListInsideCrdsByApiGroup, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TListInsideCrdByApiGroupPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const ListInsideCrdByApiGroupPage: FC<TListInsideCrdByApiGroupPageProps> = ({ forcedTheme, inside }) => {
  const { namespace, apiGroup, apiVersion, apiExtensionVersion } = useParams()

  return (
    <BaseTemplate forcedTheme={forcedTheme} inside={inside}>
      <ManageableBreadcrumbs inside />
      <Spacer $space={20} $samespace />
      {apiGroup && apiVersion && apiExtensionVersion && (
        <ListInsideCrdsByApiGroup
          namespace={namespace}
          apiGroup={apiGroup}
          apiVersion={apiVersion}
          apiExtensionVersion={apiExtensionVersion}
        />
      )}
    </BaseTemplate>
  )
}

import React, { FC } from 'react'
import { ContentCard } from '@prorobotech/openapi-k8s-toolkit'
import { useParams } from 'react-router-dom'
import { ListInsideCrdsByApiGroup, ManageableBreadcrumbs, ManageableSidebar, NavigationContainer } from 'components'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { BaseTemplate } from 'templates'

type TListInsideCrdByApiGroupPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const ListInsideCrdByApiGroupPage: FC<TListInsideCrdByApiGroupPageProps> = ({ forcedTheme, inside }) => {
  const { namespace, apiGroup, apiVersion, apiExtensionVersion } = useParams()

  const sidebarId = `${getSidebarIdPrefix({ namespace: !!namespace, inside })}crd-by-api`

  return (
    <BaseTemplate forcedTheme={forcedTheme} inside={inside} sidebar={<ManageableSidebar idToCompare={sidebarId} />}>
      <NavigationContainer>
        <ManageableBreadcrumbs inside />
      </NavigationContainer>
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        {apiGroup && apiVersion && apiExtensionVersion && (
          <ListInsideCrdsByApiGroup
            namespace={namespace}
            apiGroup={apiGroup}
            apiVersion={apiVersion}
            apiExtensionVersion={apiExtensionVersion}
          />
        )}
      </ContentCard>
    </BaseTemplate>
  )
}

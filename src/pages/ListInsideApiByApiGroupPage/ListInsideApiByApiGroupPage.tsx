import React, { FC } from 'react'
import { ContentCard } from '@prorobotech/openapi-k8s-toolkit'
import { useParams } from 'react-router-dom'
import { ListInsideApisByApiGroup, ManageableBreadcrumbs, ManageableSidebar, NavigationContainer } from 'components'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { BaseTemplate } from 'templates'

type TListInsideApiByApiGroupPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const ListInsideApiByApiGroupPage: FC<TListInsideApiByApiGroupPageProps> = ({ forcedTheme, inside }) => {
  const { namespace, apiGroup, apiVersion } = useParams()

  const sidebarId = `${getSidebarIdPrefix({ namespace: !!namespace, inside })}api-by-api`

  return (
    <BaseTemplate forcedTheme={forcedTheme} inside={inside} sidebar={<ManageableSidebar idToCompare={sidebarId} />}>
      <NavigationContainer>
        <ManageableBreadcrumbs inside />
      </NavigationContainer>
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        {apiGroup && apiVersion && (
          <ListInsideApisByApiGroup namespace={namespace} apiGroup={apiGroup} apiVersion={apiVersion} />
        )}
      </ContentCard>
    </BaseTemplate>
  )
}

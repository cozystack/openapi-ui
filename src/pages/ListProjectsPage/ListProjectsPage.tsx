import React, { FC } from 'react'
import { ContentCard } from '@prorobotech/openapi-k8s-toolkit'
import { ListProjects, ManageableBreadcrumbs, ManageableSidebar, NavigationContainer } from 'components'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { getBreadcrumbsIdPrefix } from 'utils/getBreadcrumbsIdPrefix'
import { BaseTemplate } from 'templates'

type TListProjectsPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListProjectsPage: FC<TListProjectsPageProps> = ({ forcedTheme }) => {
  const sidebarId = `${getSidebarIdPrefix({})}projects-list`
  const breadcrumbsId = `${getBreadcrumbsIdPrefix({})}projects-list`

  return (
    <BaseTemplate forcedTheme={forcedTheme} sidebar={<ManageableSidebar idToCompare={sidebarId} />}>
      <NavigationContainer>
        <ManageableBreadcrumbs idToCompare={breadcrumbsId} />
      </NavigationContainer>
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        <ListProjects />
      </ContentCard>
    </BaseTemplate>
  )
}

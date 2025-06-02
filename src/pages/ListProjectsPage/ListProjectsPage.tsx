import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { ContentCard, ListProjects, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TListProjectsPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListProjectsPage: FC<TListProjectsPageProps> = ({ forcedTheme }) => {
  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <ManageableBreadcrumbs />
      <Spacer $space={20} $samespace />
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        <ListProjects />
      </ContentCard>
    </BaseTemplate>
  )
}

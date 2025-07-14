import React, { FC } from 'react'
import { RedirectProjectList } from 'components'
import { BaseTemplate } from 'templates'

type TListProjectsPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListProjectsPage: FC<TListProjectsPageProps> = ({ forcedTheme }) => {
  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <RedirectProjectList />
    </BaseTemplate>
  )
}

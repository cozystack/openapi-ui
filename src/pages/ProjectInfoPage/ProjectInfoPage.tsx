import React, { FC } from 'react'
import { RedirectProjectInfo } from 'components'
import { BaseTemplate } from 'templates'

type TProjectInfoPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ProjectInfoPage: FC<TProjectInfoPageProps> = ({ forcedTheme }) => {
  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <RedirectProjectInfo />
    </BaseTemplate>
  )
}

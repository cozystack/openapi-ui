import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { ProjectInfo, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TProjectInfoPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ProjectInfoPage: FC<TProjectInfoPageProps> = ({ forcedTheme }) => {
  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <ManageableBreadcrumbs />
      <Spacer $space={16} $samespace />
      <ProjectInfo />
    </BaseTemplate>
  )
}

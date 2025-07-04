import React, { FC } from 'react'
import { ContentCard } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import {
  CreateBuiltinForm,
  UpdateBuiltinForm,
  BackLink,
  ManageableBreadcrumbs,
  ManageableSidebar,
  NavigationContainer,
} from 'components'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { getBreadcrumbsIdPrefix } from 'utils/getBreadcrumbsIdPrefix'
import { BaseTemplate } from 'templates'

type TFormBuiltinPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const FormBuiltinPage: FC<TFormBuiltinPageProps> = ({ forcedTheme, inside }) => {
  const { clusterName, syntheticProject, namespace, typeName, entryName } = useParams()
  const [searchParams] = useSearchParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const customBacklink = possibleInstance
    ? `${baseprefix}/${clusterName}/${possibleInstance}/${possibleProject}/api-table/apps/v1/deployments`
    : `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`

  if (!typeName) {
    return null
  }

  const backLink = searchParams.get('backlink')?.startsWith('/') ? searchParams.get('backlink') : undefined

  const sidebarId = `${getSidebarIdPrefix({ instance: !!syntheticProject, project: !!namespace, inside })}builtin-form`
  const breadcrumbsId = `${getBreadcrumbsIdPrefix({
    instance: !!syntheticProject,
    project: !!namespace,
    inside,
  })}builtin-form${entryName ? '-edit' : ''}`

  return (
    <BaseTemplate
      forcedTheme={forcedTheme}
      inside={inside}
      sidebar={
        <ManageableSidebar
          instanceName={possibleInstance}
          projectName={possibleProject}
          idToCompare={sidebarId}
          currentTags={[typeName]}
        />
      }
    >
      <NavigationContainer>
        <ManageableBreadcrumbs idToCompare={breadcrumbsId} inside={inside} />
        <BackLink
          to={backLink || customBacklink}
          title={`${entryName ? 'Update' : 'Create'} ${typeName}${entryName ? `/${entryName}` : ''}`}
        />
      </NavigationContainer>
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        {entryName ? (
          <UpdateBuiltinForm namespace={namespace} typeName={typeName} entryName={entryName} backLink={backLink} />
        ) : (
          <CreateBuiltinForm namespace={namespace} typeName={typeName} backLink={backLink} />
        )}
      </ContentCard>
    </BaseTemplate>
  )
}

import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { CreateCrdsForm, UpdateCrdsForm, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TFormCrdPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const FormCrdPage: FC<TFormCrdPageProps> = ({ forcedTheme }) => {
  const { clusterName, syntheticProject, apiGroup, apiVersion, namespace, typeName, entryName } = useParams()
  const [searchParams] = useSearchParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const customBacklink = possibleInstance
    ? `${baseprefix}/${clusterName}/${possibleInstance}/${possibleProject}/api-table/apps/v1/deployments`
    : `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`

  if (!typeName || !apiGroup || !apiVersion) {
    return null
  }

  const backLink = searchParams.get('backlink')?.startsWith('/') ? searchParams.get('backlink') : undefined

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <ManageableBreadcrumbs />
      <BackLink
        to={backLink || customBacklink}
        title={`${entryName ? 'Update' : 'Create'} ${apiGroup}/${apiVersion}/${typeName}${
          entryName ? `/${entryName}` : ''
        }`}
      />
      <Spacer $space={16} $samespace />
      {entryName ? (
        <UpdateCrdsForm
          namespace={namespace}
          apiGroup={apiGroup}
          apiVersion={apiVersion}
          typeName={typeName}
          entryName={entryName}
          backLink={backLink}
        />
      ) : (
        <CreateCrdsForm
          namespace={namespace}
          apiGroup={apiGroup}
          apiVersion={apiVersion}
          typeName={typeName}
          backLink={backLink}
        />
      )}
    </BaseTemplate>
  )
}

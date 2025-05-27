import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { CreateApisForm, UpdateApisForm, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TFormApiPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const FormApiPage: FC<TFormApiPageProps> = ({ forcedTheme }) => {
  const { clusterName, syntheticProject, namespace, apiGroup, apiVersion, typeName, entryName } = useParams()
  const [searchParams] = useSearchParams()
  const isFederation = useSelector((state: RootState) => state.federation.isFederation)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  if (!typeName || !apiGroup || !apiVersion) {
    return null
  }

  const backLink = searchParams.get('backlink')?.startsWith('/') ? searchParams.get('backlink') : undefined

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      {isFederation && <ManageableBreadcrumbs />}{' '}
      {isFederation && (
        <BackLink
          to={
            backLink ||
            `/core/clusters/${clusterName}/projects/${possibleProject}${
              possibleInstance ? `/instances/${possibleInstance}` : ''
            }`
          }
          title={`${entryName ? 'Update' : 'Create'} ${apiGroup}/${apiVersion}/${typeName}${
            entryName ? `/${entryName}` : ''
          }`}
        />
      )}
      <Spacer $space={16} $samespace />
      {entryName ? (
        <UpdateApisForm
          namespace={namespace}
          apiGroup={apiGroup}
          apiVersion={apiVersion}
          typeName={typeName}
          entryName={entryName}
          backLink={backLink}
        />
      ) : (
        <CreateApisForm
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

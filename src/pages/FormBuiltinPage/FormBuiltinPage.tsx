import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { CreateBuiltinForm, UpdateBuiltinForm, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TFormBuiltinPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const FormBuiltinPage: FC<TFormBuiltinPageProps> = ({ forcedTheme }) => {
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

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <ManageableBreadcrumbs />
      <BackLink
        to={backLink || customBacklink}
        title={`${entryName ? 'Update' : 'Create'} ${typeName}${entryName ? `/${entryName}` : ''}`}
      />
      <Spacer $space={16} $samespace />
      {entryName ? (
        <UpdateBuiltinForm namespace={namespace} typeName={typeName} entryName={entryName} backLink={backLink} />
      ) : (
        <CreateBuiltinForm namespace={namespace} typeName={typeName} backLink={backLink} />
      )}
    </BaseTemplate>
  )
}

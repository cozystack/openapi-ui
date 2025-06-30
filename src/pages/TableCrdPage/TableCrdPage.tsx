import React, { FC } from 'react'
import { ContentCard } from '@prorobotech/openapi-k8s-toolkit'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { TableCrdInfo, BackLink, ManageableBreadcrumbs, ManageableSidebar, NavigationContainer } from 'components'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { BaseTemplate } from 'templates'
import {
  BASE_INSTANCES_API_GROUP,
  BASE_INSTANCES_VERSION,
  BASE_INSTANCES_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

type TTableCrdPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const TableCrdPage: FC<TTableCrdPageProps> = ({ forcedTheme, inside }) => {
  const { clusterName, namespace, syntheticProject, apiGroup, apiVersion, apiExtensionVersion, crdName } = useParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const customBacklink = possibleInstance
    ? `${baseprefix}/${clusterName}/${possibleProject}/api-table/${BASE_INSTANCES_API_GROUP}/${BASE_INSTANCES_VERSION}/${BASE_INSTANCES_RESOURCE_NAME}`
    : `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`

  const customBacklinkWithInside = inside
    ? `${baseprefix}/inside/${clusterName}${namespace ? `/${namespace}` : ''}/apis`
    : customBacklink

  const clustererBacklink = inside ? customBacklinkWithInside : `${baseprefix}/clusters`

  const sidebarId = `${getSidebarIdPrefix({ instance: !!syntheticProject, project: !!namespace, inside })}crd-table`

  return (
    <BaseTemplate
      forcedTheme={forcedTheme}
      inside={inside}
      sidebar={
        <ManageableSidebar
          instanceName={possibleInstance}
          projectName={possibleProject}
          idToCompare={sidebarId}
          currentTags={[`${apiGroup}/${apiVersion}/${crdName}`]}
        />
      }
    >
      <NavigationContainer>
        <ManageableBreadcrumbs inside={inside} />
        <BackLink
          to={namespace ? customBacklinkWithInside : clustererBacklink}
          title={`${apiGroup}/${apiVersion}/${crdName}`}
        />
      </NavigationContainer>
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        {crdName && apiGroup && apiVersion && apiExtensionVersion && (
          <TableCrdInfo
            namespace={namespace}
            apiGroup={apiGroup}
            apiVersion={apiVersion}
            crdName={crdName}
            apiExtensionVersion={apiExtensionVersion}
            inside={inside}
          />
        )}
      </ContentCard>
    </BaseTemplate>
  )
}

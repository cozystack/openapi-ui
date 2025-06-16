import React, { FC } from 'react'
import { Col } from 'antd'
import { ContentCard, Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { TableCrdInfo, BackLink, ManageableBreadcrumbs, ManageableSidebar, RowFlexGrow, FlexCol } from 'components'
import { BaseTemplate } from 'templates'
import {
  BASE_INSTANCES_API_GROUP,
  BASE_INSTANCES_VERSION,
  BASE_INSTANCES_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

type TTableCrdPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const TableCrdPage: FC<TTableCrdPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, syntheticProject, apiGroup, apiVersion, apiExtensionVersion, crdName } = useParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const customBacklink = possibleInstance
    ? `${baseprefix}/${clusterName}/${possibleProject}/api-table/${BASE_INSTANCES_API_GROUP}/${BASE_INSTANCES_VERSION}/${BASE_INSTANCES_RESOURCE_NAME}`
    : `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`

  const clustererBacklink = `${baseprefix}/clusters`

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <ManageableBreadcrumbs />
      <BackLink to={namespace ? customBacklink : clustererBacklink} title={`${apiGroup}/${apiVersion}/${crdName}`} />
      <Spacer $space={20} $samespace />
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        <RowFlexGrow>
          <Col span="auto">
            <ManageableSidebar instanceName={possibleInstance} projectName={possibleProject} />
          </Col>
          <FlexCol flex="auto">
            {crdName && apiGroup && apiVersion && apiExtensionVersion && (
              <TableCrdInfo
                namespace={namespace}
                apiGroup={apiGroup}
                apiVersion={apiVersion}
                crdName={crdName}
                apiExtensionVersion={apiExtensionVersion}
              />
            )}
          </FlexCol>
        </RowFlexGrow>
      </ContentCard>
    </BaseTemplate>
  )
}

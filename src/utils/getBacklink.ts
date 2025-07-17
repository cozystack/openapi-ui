import {
  BASE_INSTANCES_API_GROUP,
  BASE_INSTANCES_VERSION,
  BASE_INSTANCES_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

export const getFormsBackLink = ({
  backLink,
  clusterName,
  possibleProject,
  possibleInstance,
  baseprefix,
  namespacesMode,
}: {
  backLink?: string | null
  clusterName?: string
  possibleProject?: string
  possibleInstance?: string
  baseprefix?: string
  namespacesMode?: boolean
}): string => {
  if (backLink) {
    return backLink
  }

  if (possibleInstance) {
    return `${baseprefix}/${clusterName}/${possibleInstance}/${possibleProject}/api-table/apps/v1/deployments`
  }

  if (namespacesMode) {
    return `${baseprefix}/${clusterName}/builtin-table/namespaces`
  }

  if (possibleProject) {
    return `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`
  }

  return `${baseprefix}/clusters`
}

export const getTablesBackLink = ({
  clusterName,
  possibleProject,
  possibleInstance,
  namespace,
  baseprefix,
  inside,
  namespacesMode,
}: {
  clusterName?: string
  possibleProject?: string
  possibleInstance?: string
  namespace?: string
  baseprefix?: string
  inside?: boolean
  namespacesMode?: boolean
}): string => {
  if (inside) {
    return `${baseprefix}/inside/${clusterName}${namespace ? `/${namespace}` : ''}/apis`
  }

  if (possibleInstance) {
    return `${baseprefix}/${clusterName}/${possibleProject}/api-table/${BASE_INSTANCES_API_GROUP}/${BASE_INSTANCES_VERSION}/${BASE_INSTANCES_RESOURCE_NAME}`
  }

  if (namespacesMode) {
    return `${baseprefix}/${clusterName}/builtin-table/namespaces`
  }

  if (possibleProject) {
    return `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`
  }

  return `${baseprefix}/clusters`
}

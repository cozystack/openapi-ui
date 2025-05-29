import { useApiResources, TClusterList, TSingleResource } from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { BASE_API_GROUP, BASE_RPROJECTS_VERSION } from 'constants/customizationApiGroupAndVersion'

const mappedClusterToOptionInSidebar = ({ name }: TClusterList[number]): { value: string; label: string } => ({
  value: name,
  label: name,
})

const mappedToOptionInSidebar = ({ metadata }: TSingleResource): { value: string; label: string } => ({
  value: metadata.name,
  label: metadata.name,
})

export const useNavSelector = (clusterName?: string, projectName?: string) => {
  const clusterList = useSelector((state: RootState) => state.clusterList.clusterList)

  const { data: projects } = useApiResources({
    clusterName: clusterName || '',
    namespace: '',
    apiGroup: BASE_API_GROUP,
    apiVersion: BASE_RPROJECTS_VERSION,
    typeName: 'projects',
    limit: null,
  })

  const { data: instances, isSuccess: allInstancesLoadingSuccess } = useApiResources({
    clusterName: clusterName || '',
    namespace: '',
    apiGroup: BASE_API_GROUP,
    apiVersion: BASE_RPROJECTS_VERSION,
    typeName: 'instances',
    limit: null,
  })

  const clustersInSidebar = clusterList ? clusterList.map(mappedClusterToOptionInSidebar) : []
  const projectsInSidebar = clusterName && projects ? projects.items.map(mappedToOptionInSidebar) : []
  const instancesInSidebar =
    clusterName && instances
      ? instances.items.filter(item => item.metadata.namespace === projectName).map(mappedToOptionInSidebar)
      : []

  return { clustersInSidebar, projectsInSidebar, instancesInSidebar, allInstancesLoadingSuccess }
}

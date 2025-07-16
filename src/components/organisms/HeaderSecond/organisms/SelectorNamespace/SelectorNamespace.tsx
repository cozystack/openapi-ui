import React, { FC, useState } from 'react'
import { Flex } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDirectUnknownResource } from '@prorobotech/openapi-k8s-toolkit'
import { useNavSelectorInside } from 'hooks/useNavSelectorInside'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from 'components/atoms'
import {
  BASE_API_GROUP,
  BASE_API_VERSION,
  BASE_CUSTOMIZATION_NAVIGATION_RESOURCE_NAME,
  BASE_CUSTOMIZATION_NAVIGATION_RESOURCE,
} from 'constants/customizationApiGroupAndVersion'

type TSelectorNamespaceProps = {
  clusterName?: string
  namespace?: string
}

export const SelectorNamespace: FC<TSelectorNamespaceProps> = ({ clusterName, namespace }) => {
  const navigate = useNavigate()

  const [selectedClusterName, setSelectedClusterName] = useState(clusterName)
  const [selectedNamespace, setSelectedNamespace] = useState(namespace)

  const { namespacesInSidebar } = useNavSelectorInside(selectedClusterName)

  const { data: navigationData } = useDirectUnknownResource<{
    spec: { namespaces: { clear: string; change: string } }
  }>({
    uri: `/api/clusters/${clusterName}/k8s/apis/${BASE_API_GROUP}/${BASE_API_VERSION}/${BASE_CUSTOMIZATION_NAVIGATION_RESOURCE_NAME}/${BASE_CUSTOMIZATION_NAVIGATION_RESOURCE}`,
    refetchInterval: false,
    queryKey: ['navigation', clusterName || 'no-cluster'],
    isEnabled: clusterName !== undefined,
  })

  const handleNamepsaceChange = (value?: string) => {
    if (value) {
      setSelectedNamespace(value)
      const changeUrl =
        navigationData?.spec.namespaces.change
          .replace('{selectedCluster}', selectedClusterName || 'no-cluster')
          .replace('{value}', value) || 'no navigation data'
      navigate(changeUrl)
    } else {
      const clearUrl =
        navigationData?.spec.namespaces.clear.replace('{selectedCluster}', selectedClusterName || 'no-cluster') ||
        'no navigation data'
      navigate(clearUrl)
    }
  }

  useMountEffect(() => {
    setSelectedClusterName(clusterName)
    setSelectedNamespace(namespace)
  }, [namespace, clusterName])

  return (
    <Flex gap={18} justify="start">
      <EntrySelect
        placeholder="Namespace"
        options={namespacesInSidebar}
        value={selectedNamespace}
        onChange={handleNamepsaceChange}
        disabled={selectedClusterName === undefined || namespacesInSidebar.length === 0}
      />
    </Flex>
  )
}

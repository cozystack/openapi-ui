import React, { FC, useState } from 'react'
import { Flex } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useNavSelectorInside } from 'hooks/useNavSelectorInside'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from './molecules'

type TSelectorInsideProps = {
  clusterName?: string
  namespace?: string
}

export const SelectorInside: FC<TSelectorInsideProps> = ({ clusterName, namespace }) => {
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const [selectedClusterName, setSelectedClusterName] = useState(clusterName)
  const [selectedNamespace, setSelectedNamespace] = useState(namespace)

  const { namespacesInSidebar, clustersInSidebar } = useNavSelectorInside(selectedClusterName)

  const handleClusterChange = (value: string) => {
    setSelectedClusterName(value)
    navigate(`${baseprefix}/inside/${value}/apis`)
    setSelectedNamespace(undefined)
  }

  const handleNamepsaceChange = (value: string) => {
    setSelectedNamespace(value)
    navigate(`${baseprefix}/inside/${selectedClusterName}/${value}/apis`)
  }

  useMountEffect(() => {
    setSelectedClusterName(clusterName)
    setSelectedNamespace(namespace)
  }, [namespace, clusterName])

  return (
    <Flex gap={18} justify="center">
      <EntrySelect
        placeholder="Cluster"
        options={clustersInSidebar}
        value={selectedClusterName}
        onChange={handleClusterChange}
      />
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

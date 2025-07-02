import React, { FC, useState } from 'react'
import { Flex } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useNavSelectorInside } from 'hooks/useNavSelectorInside'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from 'components/atoms'

type TSelectorInsideProps = {
  clusterName?: string
  namespace?: string
}

export const SelectorInside: FC<TSelectorInsideProps> = ({ clusterName, namespace }) => {
  const navigate = useNavigate()
  const params = useParams()

  const [selectedClusterName, setSelectedClusterName] = useState(clusterName)
  const [selectedNamespace, setSelectedNamespace] = useState(namespace)

  // const { namespacesInSidebar, clustersInSidebar } = useNavSelectorInside(selectedClusterName)
  const { namespacesInSidebar } = useNavSelectorInside(selectedClusterName)

  // const handleClusterChange = (value: string) => {
  //   setSelectedClusterName(value)
  //   navigate(`${baseprefix}/inside/${value}/apis`)
  // }

  const handleNamepsaceChange = (value?: string) => {
    if (value && params.namespace) {
      setSelectedNamespace(value)
      const pathnames = window.location.pathname.split('/')
      const newPathNames = [...pathnames.slice(0, 4), value, ...pathnames.slice(5)]
      navigate(newPathNames.join('/'))
    } else if (value && !params.namespace) {
      setSelectedNamespace(value)
      const pathnames = window.location.pathname.split('/')
      const newPathNames = [...pathnames.slice(0, 4), value, ...pathnames.slice(4)]
      navigate(newPathNames.join('/'))
    } else {
      const pathnames = window.location.pathname.split('/')
      const newPathnames = pathnames.filter((_, i) => i !== 4)
      navigate(newPathnames.join('/'))
    }
  }

  useMountEffect(() => {
    setSelectedClusterName(clusterName)
    setSelectedNamespace(namespace)
  }, [namespace, clusterName])

  return (
    <Flex gap={18} justify="start">
      {/* <EntrySelect
        placeholder="Cluster"
        options={clustersInSidebar}
        value={selectedClusterName}
        onChange={handleClusterChange}
      /> */}
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

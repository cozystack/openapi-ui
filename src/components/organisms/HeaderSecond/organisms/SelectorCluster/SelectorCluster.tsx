import React, { FC, useState } from 'react'
import { Flex, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useNavSelectorClusters } from 'hooks/useNavSelectorClusters'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from 'components/atoms'

type TSelectorClusterProps = {
  clusterName?: string
}

export const SelectorCluster: FC<TSelectorClusterProps> = ({ clusterName }) => {
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const [selectedClusterName, setSelectedClusterName] = useState(clusterName)

  const { clustersInSidebar } = useNavSelectorClusters()

  const handleClusterChange = (value?: string) => {
    if (value) {
      setSelectedClusterName(value)
      navigate(`${baseprefix}/clusters/${value}`)
    } else {
      navigate(`${baseprefix}/clusters/`)
    }
  }

  useMountEffect(() => {
    setSelectedClusterName(clusterName)
  }, [clusterName])

  return (
    <Flex gap={18} justify="start" align="center">
      <Typography.Text>Cluster: </Typography.Text>
      <EntrySelect
        placeholder="Cluster"
        options={clustersInSidebar}
        value={selectedClusterName}
        onChange={handleClusterChange}
        // fullwidth
      />
    </Flex>
  )
}

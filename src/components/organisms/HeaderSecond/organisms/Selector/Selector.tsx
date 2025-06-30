import React, { FC, useState } from 'react'
import { Flex } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useNavSelector } from 'hooks/useNavSelector'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from 'components/atoms'

type TSelectorProps = {
  clusterName?: string
  projectName?: string
  instanceName?: string
}

export const Selector: FC<TSelectorProps> = ({ clusterName, projectName, instanceName }) => {
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const [selectedClusterName, setSelectedClusterName] = useState(clusterName)
  const [selectedProjectName, setSelectedProjectName] = useState(projectName)
  const [selectedInstanceName, setSelectedInstanceName] = useState(instanceName)

  // const { projectsInSidebar, instancesInSidebar, allInstancesLoadingSuccess, clustersInSidebar } = useNavSelector(
  const { projectsInSidebar, instancesInSidebar, allInstancesLoadingSuccess } = useNavSelector(
    selectedClusterName,
    projectName,
  )

  // const handleClusterChange = (value: string) => {
  //   setSelectedClusterName(value)
  //   navigate(`${baseprefix}/clusters/${value}`)
  // }

  const handleProjectChange = (value: string) => {
    setSelectedProjectName(value)
    navigate(`${baseprefix}/clusters/${selectedClusterName}/projects/${value}`)
  }

  const handleInstanceChange = (value: string) => {
    setSelectedInstanceName(value)
    navigate(`${baseprefix}/${selectedClusterName}/${value}/${selectedProjectName}/api-table/apps/v1/deployments`)
  }

  useMountEffect(() => {
    setSelectedClusterName(clusterName)
    setSelectedProjectName(projectName)
    setSelectedInstanceName(instanceName)
  }, [projectName, instanceName, clusterName])

  return (
    <Flex gap={18} justify="start">
      {/* <EntrySelect
        placeholder="Cluster"
        options={clustersInSidebar}
        value={selectedClusterName}
        onChange={handleClusterChange}
      /> */}
      <EntrySelect
        placeholder="Project"
        options={projectsInSidebar}
        value={selectedProjectName}
        onChange={handleProjectChange}
        disabled={selectedClusterName === undefined || projectsInSidebar.length === 0}
      />
      <EntrySelect
        placeholder="Intance"
        options={instancesInSidebar}
        value={selectedInstanceName}
        onChange={handleInstanceChange}
        disabled={
          selectedClusterName === undefined ||
          selectedProjectName === undefined ||
          (allInstancesLoadingSuccess && instancesInSidebar.length === 0)
        }
      />
    </Flex>
  )
}

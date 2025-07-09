import React, { FC, useState } from 'react'
import { Flex } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useNavSelector } from 'hooks/useNavSelector'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from 'components/atoms'
import {
  BASE_INSTANCES_API_GROUP,
  BASE_INSTANCES_VERSION,
  BASE_INSTANCES_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

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

  const handleProjectChange = (value?: string) => {
    if (value) {
      setSelectedProjectName(value)
      navigate(`${baseprefix}/clusters/${selectedClusterName}/projects/${value}`)
    } else {
      navigate(`${baseprefix}/clusters/${selectedClusterName}/`)
    }
  }

  const handleInstanceChange = (value?: string) => {
    if (value) {
      setSelectedInstanceName(value)
      navigate(`${baseprefix}/${selectedClusterName}/${value}/${selectedProjectName}/api-table/apps/v1/deployments`)
    } else {
      navigate(
        `${baseprefix}/${selectedClusterName}/${selectedProjectName}/api-table/${BASE_INSTANCES_API_GROUP}/${BASE_INSTANCES_VERSION}/${BASE_INSTANCES_RESOURCE_NAME}`,
      )
    }
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
        placeholder="Instance"
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

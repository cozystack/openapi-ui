import React, { FC, useState } from 'react'
import { Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useNavSelector } from 'hooks/useNavSelector'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from './molecules'

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

  const { projectsInSidebar, instancesInSidebar, allInstancesLoadingSuccess, clustersInSidebar } = useNavSelector(
    selectedClusterName,
    projectName,
  )

  const handleClusterChange = (value: string) => {
    setSelectedClusterName(value)
    navigate(`${baseprefix}/clusters/${value}`)
    setSelectedProjectName(undefined)
    setSelectedInstanceName(undefined)
  }

  const handleProjectChange = (value: string) => {
    setSelectedProjectName(value)
    setSelectedInstanceName(undefined)
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
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <EntrySelect
          placeholder="Cluster"
          options={clustersInSidebar}
          value={selectedClusterName}
          onChange={handleClusterChange}
        />
      </Col>
      <Col span={8}>
        <EntrySelect
          placeholder="Project"
          options={projectsInSidebar}
          value={selectedProjectName}
          onChange={handleProjectChange}
          disabled={selectedClusterName === undefined || projectsInSidebar.length === 0}
        />
      </Col>
      <Col span={8}>
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
      </Col>
    </Row>
  )
}

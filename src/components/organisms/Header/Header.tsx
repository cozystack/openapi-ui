import React, { FC } from 'react'
import { Row, Col } from 'antd'
import { useParams } from 'react-router-dom'
import { AccessGroups, Documentation, Logo, ManageableSidebar, Selector, User } from './organisms'

export const Header: FC = () => {
  const { projectName, instanceName, clusterName, entryType, namespace, syntheticProject } = useParams()

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  return (
    <Row>
      <Col span={2}>
        <Logo />
      </Col>
      <Col span={8}>
        <Selector
          clusterName={clusterName}
          projectName={projectName || possibleProject}
          instanceName={instanceName || possibleInstance}
        />
      </Col>
      <Col span={8}>
        <ManageableSidebar
          clusterName={clusterName}
          entryType={entryType}
          instanceName={instanceName}
          projectName={projectName}
        />
      </Col>
      <Col span={2}>
        {instanceName && projectName && (
          <AccessGroups clusterName={clusterName} instanceName={instanceName} projectName={projectName} />
        )}
      </Col>
      <Col span={2}>
        <Documentation key="SidebarDocumentation" />
      </Col>
      <Col span={2}>
        <User key="SidebarUser" />
      </Col>
    </Row>
  )
}

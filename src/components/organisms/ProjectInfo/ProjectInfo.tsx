import React, { FC, useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Spacer, useDirectUnknownResource, DeleteModal, usePermissions } from '@prorobotech/openapi-k8s-toolkit'
import { Typography, Flex, Row, Col, Spin, Button } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { BASE_API_GROUP, BASE_RPROJECTS_VERSION } from 'constants/customizationApiGroupAndVersion'
import { ContentCard, MarketPlace } from 'components'
import { DropdownActions, DropdownAccessGroups } from './molecules'
import { Styled } from './styled'

export const ProjectInfo: FC = () => {
  const navigate = useNavigate()
  const { clusterName, namespace } = useParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const {
    data: project,
    isLoading,
    error,
  } = useDirectUnknownResource<{
    apiVersion: string
    kind: 'Project'
    metadata: {
      labels: {
        paas: string
        pj: string
      }
      name: string
      resourceVersion: string
      uid: string
    }
    spec: {
      businessName?: string
      description: string
      prefix: string
    }
    status: {
      conditions: {
        lastTransitionTime: string
        message: string
        reason: string
        status: string
        type: string
      }[]
    }
  }>({
    uri: `/api/clusters/${clusterName}/k8s/apis/${BASE_API_GROUP}/${BASE_RPROJECTS_VERSION}/projects/${namespace}`,
    refetchInterval: 5000,
    queryKey: ['projects', clusterName || 'no-cluster'],
    isEnabled: clusterName !== undefined,
  })

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const updatePermission = usePermissions({
    apiGroup: BASE_API_GROUP,
    typeName: 'projects',
    namespace: '',
    clusterName: clusterName || '',
    verb: 'update',
    refetchInterval: false,
  })

  const deletePermission = usePermissions({
    apiGroup: BASE_API_GROUP,
    typeName: 'projects',
    namespace: '',
    clusterName: clusterName || '',
    verb: 'delete',
    refetchInterval: false,
  })

  const openUpdate = useCallback(() => {
    navigate(
      `${baseprefix}/${clusterName}/forms/apis/${BASE_API_GROUP}/${BASE_RPROJECTS_VERSION}/projects/${namespace}?backlink=${baseprefix}/clusters/${clusterName}`,
    )
  }, [baseprefix, clusterName, namespace, navigate])

  if (isLoading) {
    return <Spin />
  }

  if (!project || error) {
    return null
  }

  // const readyCondition = project.status.conditions.find(({ type }) => type === 'Ready')
  const readyCondition = project.status.conditions.find(({ type }) => type !== 'Ready')

  return (
    <>
      <Row gutter={[24, 24]} style={{ flexGrow: 1 }}>
        <Col span={13}>
          <ContentCard flexGrow={1}>
            <Flex justify="space-between">
              <div>
                <Flex gap={20} vertical>
                  <div>
                    <Typography.Text type="secondary">Project Business Name</Typography.Text>
                  </div>
                  <div>
                    <Flex gap="small">
                      <Styled.BigValue>{project.spec.businessName || '-'}</Styled.BigValue>
                      {readyCondition && (
                        <Flex align="center" gap="small">
                          <Typography.Text type={readyCondition.status === 'True' ? 'success' : 'warning'}>
                            {readyCondition.reason}
                          </Typography.Text>
                        </Flex>
                      )}
                    </Flex>
                  </div>
                  <div>
                    <Typography.Text>{project.spec.description}</Typography.Text>
                  </div>
                </Flex>
                <Spacer $space={24} $samespace />
                <Flex gap={14} vertical>
                  <div>
                    <Typography.Text type="secondary">Developer Instruments</Typography.Text>
                  </div>
                  <div>
                    <Flex gap={14} wrap>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                      <Button type="link">Test</Button>
                    </Flex>
                  </div>
                </Flex>
              </div>
              <div>
                <Flex gap={24} vertical>
                  <Flex justify="flex-end">
                    {readyCondition?.status === 'True' &&
                    (updatePermission.data?.status.allowed || deletePermission.data?.status.allowed) ? (
                      <DropdownActions
                        onDelete={
                          deletePermission.data?.status.allowed
                            ? () => {
                                setIsDeleteModalOpen(true)
                              }
                            : undefined
                        }
                        onUpdate={updatePermission.data?.status.allowed ? openUpdate : undefined}
                      />
                    ) : (
                      <Styled.ActionMenuPlaceholder />
                    )}
                  </Flex>
                  <DropdownAccessGroups />
                </Flex>
              </div>
            </Flex>
          </ContentCard>
        </Col>
        <Col span={11}>
          <ContentCard flexGrow={1}>
            <MarketPlace />
          </ContentCard>
        </Col>
      </Row>
      {isDeleteModalOpen && (
        <DeleteModal
          name={project.metadata.name}
          onClose={() => {
            setIsDeleteModalOpen(false)
            navigate(`${baseprefix}/clusters/${clusterName}`)
          }}
          endpoint={`/api/clusters/${clusterName}/k8s/apis/${BASE_API_GROUP}/${BASE_RPROJECTS_VERSION}/projects/${project.metadata.name}`}
        />
      )}
    </>
  )
}

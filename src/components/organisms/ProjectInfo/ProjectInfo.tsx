import React, { FC, useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDirectUnknownResource, DeleteModal, usePermissions } from '@prorobotech/openapi-k8s-toolkit'
import { Card, Typography, Flex, Row, Col, Spin } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { BASE_API_GROUP, BASE_RPROJECTS_VERSION } from 'constants/customizationApiGroupAndVersion'
import { MarketPlace } from 'components'
import { DropdownActions } from './molecules'
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

  const readyCondition = project.status.conditions.find(({ type }) => type === 'Ready')

  return (
    <>
      <Card>
        <Row>
          <Col span={14}>
            <Flex gap={16} vertical>
              <div>
                <Flex align="center" gap="small">
                  <Typography.Text type="secondary">Project Business Name</Typography.Text>
                </Flex>
                <Flex gap="small">
                  <Styled.BigValue className="overflowOneLine">{project.spec.businessName || '-'}</Styled.BigValue>
                  {readyCondition && (
                    <Flex align="center" gap="small">
                      <Typography.Text type={readyCondition.status === 'True' ? 'success' : 'warning'}>
                        {readyCondition.reason}
                      </Typography.Text>
                    </Flex>
                  )}
                </Flex>
              </div>
              <Typography.Text>{project.spec.description}</Typography.Text>
            </Flex>
          </Col>
          <Col span={10}>
            <Flex justify="space-between">
              <Flex vertical gap="small">
                <div>
                  <div>
                    <Flex gap="small">
                      <Typography.Text type="secondary">Project Prefix</Typography.Text>
                    </Flex>
                  </div>
                  <div>
                    <Styled.BigValue>{project.spec.prefix}</Styled.BigValue>
                  </div>
                </div>
              </Flex>

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
          </Col>
        </Row>
      </Card>
      <MarketPlace />
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

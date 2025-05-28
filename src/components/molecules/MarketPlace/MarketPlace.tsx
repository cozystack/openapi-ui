/* eslint-disable max-lines-per-function */
import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import { usePermissions, useDirectUnknownResource, DeleteModal } from '@prorobotech/openapi-k8s-toolkit'
import { notification, Typography, Card, Flex, Divider, Switch, theme, Spin, Alert } from 'antd'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'
import { AddCard } from './atoms'
import { AddEditFormModal, CardInProject, SearchTextInput } from './molecules'
import {
  TMarketPlacePanelResponse,
  TMarketPlacePanelResource,
  TMarketPlacePanel,
  TMarketPlaceFiltersAndSorters,
} from './types'

export const MarketPlace: FC = () => {
  const { useToken } = theme
  const { token } = useToken()
  const [api, contextHolder] = notification.useNotification()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isAddEditOpen, setIsAddEditOpen] = useState<boolean | TMarketPlacePanelResource>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<{ name: string } | boolean>(false)

  const [createUpdateError, setCreateUpdateError] = useState<AxiosError | Error>()
  const [deleteError, setDeleteError] = useState<AxiosError | Error>()

  const [initialData, setInitialData] = useState<TMarketPlacePanel[]>([])
  const [filteredAndSortedData, setFilterAndSortedData] = useState<TMarketPlacePanel[]>([])
  const [uniqueTags, setUniqueTags] = useState<string[]>([])
  const [filtersAndSorters, setFiltersAndSorters] = useState<TMarketPlaceFiltersAndSorters>({
    searchText: '',
  })

  const { clusterName, namespace } = useParams()

  const {
    data: marketplacePanels,
    isLoading,
    error,
  } = useDirectUnknownResource<TMarketPlacePanelResponse>({
    uri: `/api/clusters/${clusterName}/k8s/apis/${BASE_API_GROUP}/${BASE_API_VERSION}/marketplacepanels/`,
    refetchInterval: 5000,
    queryKey: ['marketplacePanels', clusterName || 'no-cluster'],
    isEnabled: clusterName !== undefined,
  })

  const createPermission = usePermissions({
    apiGroup: BASE_API_GROUP,
    typeName: 'marketplacepanels',
    namespace: '',
    clusterName: clusterName || '',
    verb: 'create',
    refetchInterval: false,
  })

  const updatePermission = usePermissions({
    apiGroup: BASE_API_GROUP,
    typeName: 'marketplacepanels',
    namespace: '',
    clusterName: clusterName || '',
    verb: 'update',
    refetchInterval: false,
  })

  const deletePermission = usePermissions({
    apiGroup: BASE_API_GROUP,
    typeName: 'marketplacepanels',
    namespace: '',
    clusterName: clusterName || '',
    verb: 'delete',
    refetchInterval: false,
  })

  const onCreateSuccess = () =>
    api.success({
      message: 'Card created',
      key: 'create-marketplace-success',
    })

  const onUpdateSuccess = () =>
    api.success({
      message: 'Card modified',
      key: 'update-marketplace-success',
    })

  useEffect(() => {
    if (marketplacePanels) {
      if (isEditMode) {
        setInitialData(marketplacePanels.items.map(({ spec }) => spec).sort())
        setUniqueTags(
          marketplacePanels.items
            .flatMap(({ spec }) => spec.tags)
            .filter((value, index, arr) => arr.indexOf(value) === index),
        )
      } else {
        setInitialData(
          marketplacePanels.items
            .map(({ spec }) => spec)
            .filter(({ hidden }) => hidden !== true)
            .sort(),
        )
        setUniqueTags(
          marketplacePanels.items
            .filter(({ spec }) => spec.hidden !== true)
            .flatMap(({ spec }) => spec.tags)
            .filter((value, index, arr) => arr.indexOf(value) === index),
        )
      }
    }
  }, [marketplacePanels, isEditMode])

  useEffect(() => {
    const { searchText, selectedTag } = filtersAndSorters

    let newData = initialData
      .filter(
        ({ name, description }) =>
          name.toLowerCase().includes(searchText.toLowerCase()) ||
          description.toLowerCase().includes(searchText.toLowerCase()),
      )
      .sort()

    if (selectedTag) {
      newData = newData.filter(({ tags }) => tags.includes(selectedTag))
    }

    setFilterAndSortedData(newData)
  }, [filtersAndSorters, initialData])

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  if (isLoading) {
    return <Spin />
  }

  if (!marketplacePanels) {
    return <div>No panels</div>
  }

  const onSearchTextChange = (searchText: string) => {
    setFiltersAndSorters({ ...filtersAndSorters, searchText })
  }

  const onTagSelect = (tag: string) => {
    if (filtersAndSorters.selectedTag === tag) {
      setFiltersAndSorters({
        ...filtersAndSorters,
        selectedTag: undefined,
      })
    } else {
      setFiltersAndSorters({
        ...filtersAndSorters,
        selectedTag: tag,
      })
    }
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <>
      {contextHolder}
      <Flex justify="space-between" align="center" style={{ marginTop: '30px' }}>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Marketplace
        </Typography.Title>
        <div>
          {(createPermission.data?.status.allowed ||
            updatePermission.data?.status.allowed ||
            deletePermission.data?.status.allowed) && (
            <div>
              <Switch defaultChecked checked={isEditMode} onClick={toggleEditMode} /> Edit Mode
            </div>
          )}
        </div>
      </Flex>
      {createUpdateError && (
        <Alert
          description={JSON.stringify(createUpdateError)}
          message="Card was not created"
          onClose={() => setCreateUpdateError(undefined)}
          type="error"
        />
      )}
      {deleteError && (
        <Alert
          description={JSON.stringify(deleteError)}
          message="Card was not deleted"
          onClose={() => setDeleteError(undefined)}
          type="error"
        />
      )}
      <Flex>
        <Card style={{ maxWidth: '255px', marginRight: '8px' }}>
          <Flex justify="center" align="center" vertical>
            <SearchTextInput searchText={filtersAndSorters.searchText} onSearchTextChange={onSearchTextChange} />
            <Divider style={{ borderColor: token.colorBorder }} />
            <Flex justify="center" align="center" vertical style={{ width: '100%' }}>
              <Typography.Text
                style={{ width: '100%', marginBottom: '8px', cursor: 'pointer' }}
                type={!filtersAndSorters.selectedTag ? 'success' : undefined}
                onClick={() =>
                  setFiltersAndSorters({
                    ...filtersAndSorters,
                    selectedTag: undefined,
                  })
                }
              >
                All Items
              </Typography.Text>
              {uniqueTags.map(tag => (
                <Typography.Text
                  style={{ width: '100%', marginBottom: '8px', cursor: 'pointer' }}
                  type={filtersAndSorters.selectedTag === tag ? 'success' : undefined}
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                >
                  {tag}
                </Typography.Text>
              ))}
            </Flex>
          </Flex>
        </Card>
        <div>
          <Flex wrap gap="small">
            {clusterName &&
              namespace &&
              filteredAndSortedData.map(
                ({ name, description, icon, type, pathToNav, typeName, apiGroup, apiVersion, tags, disabled }) => (
                  <CardInProject
                    description={description}
                    disabled={disabled}
                    icon={icon}
                    isEditMode={isEditMode}
                    key={name}
                    name={name}
                    clusterName={clusterName}
                    namespace={namespace}
                    type={type}
                    pathToNav={pathToNav}
                    typeName={typeName}
                    apiGroup={apiGroup}
                    apiVersion={apiVersion}
                    // pathToNav={pathToNav}
                    tags={tags}
                    onDeleteClick={() => {
                      const entry = marketplacePanels.items.find(({ spec }) => spec.name === name)
                      setIsDeleteOpen(
                        entry
                          ? {
                              name: entry.metadata.name,
                            }
                          : false,
                      )
                    }}
                    onEditClick={() => {
                      setIsAddEditOpen(marketplacePanels.items.find(({ spec }) => spec.name === name) || false)
                    }}
                  />
                ),
              )}
            {isEditMode && (
              <AddCard
                onAddClick={() => {
                  setIsAddEditOpen(true)
                }}
              />
            )}
          </Flex>
        </div>
      </Flex>
      {isAddEditOpen && (
        <AddEditFormModal
          isOpen={isAddEditOpen}
          setError={setCreateUpdateError}
          setIsOpen={setIsAddEditOpen}
          onCreateSuccess={onCreateSuccess}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
      {typeof isDeleteOpen !== 'boolean' && (
        <DeleteModal
          name={isDeleteOpen.name}
          onClose={() => setIsDeleteOpen(false)}
          endpoint={`/api/clusters/${clusterName}/k8s/apis/${BASE_API_GROUP}/${BASE_API_VERSION}/marketplacepanels/${isDeleteOpen.name}`}
        />
      )}
    </>
  )
}

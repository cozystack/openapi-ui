import React, { FC } from 'react'
import { EnrichedTable } from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { TABLE_PROPS } from 'constants/tableProps'

export const ListClusters: FC = () => {
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)
  const clusterList = useSelector((state: RootState) => state.clusterList.clusterList)

  if (!clusterList) {
    return null
  }

  return (
    <EnrichedTable
      theme={theme}
      baseprefix={baseprefix}
      dataSource={clusterList}
      columns={[
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Api',
          dataIndex: 'api',
          key: 'api',
        },
        {
          title: 'Tenant',
          dataIndex: 'tenant',
          key: 'tenant',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
      ]}
      pathToNavigate={`${baseprefix}/clusters/~recordValue~`}
      recordKeysForNavigation={['name']}
      withoutControls
      tableProps={TABLE_PROPS}
    />
  )
}

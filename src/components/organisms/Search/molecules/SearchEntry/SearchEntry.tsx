import React, { FC } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Typography } from 'antd'
import { TableApiBuiltin } from 'components'
import { getTableCustomizationIdPrefix } from 'utils/getTableCustomizationIdPrefix'
import { BASE_USE_NAMESPACE_NAV } from 'constants/customizationApiGroupAndVersion'

type TSearchEntryProps = {
  resource: string
}

export const SearchEntry: FC<TSearchEntryProps> = ({ resource }) => {
  const { namespace, syntheticProject } = useParams()
  const [searchParams] = useSearchParams()

  const [apiGroup, apiVersion, typeName] = resource.split('~')

  const tableCustomizationIdPrefix = getTableCustomizationIdPrefix({
    instance: !!syntheticProject,
    project: BASE_USE_NAMESPACE_NAV !== 'true' && !!namespace,
    namespace: !!namespace,
    search: true,
  })

  return (
    <div>
      <Typography.Title level={4}>
        {apiGroup.length > 0 ? `${apiGroup}/${apiVersion}/` : 'v1/'}
        {typeName}
      </Typography.Title>
      {typeName && apiGroup && apiVersion && (
        <TableApiBuiltin
          resourceType={apiGroup ? 'api' : 'builtin'}
          namespace={namespace}
          apiGroup={apiGroup.length > 0 ? apiGroup : undefined}
          apiVersion={apiGroup.length > 0 ? apiVersion : undefined}
          typeName={typeName}
          limit={searchParams.get('limit')}
          customizationIdPrefix={tableCustomizationIdPrefix}
          searchMount
        />
      )}
    </div>
  )
}

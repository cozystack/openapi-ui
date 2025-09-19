import React, { FC } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Typography } from 'antd'
import { TableApiBuiltin } from 'components'
import { getTableCustomizationIdPrefix } from 'utils/getTableCustomizationIdPrefix'
import { BASE_USE_NAMESPACE_NAV } from 'constants/customizationApiGroupAndVersion'

type TSearchEntryProps = {
  resource: string
  name?: string
  labels?: string[]
  fields?: string[]
}

export const SearchEntry: FC<TSearchEntryProps> = ({ resource, name, labels, fields }) => {
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
        {name ? ` & name=${name}` : ''}
        {labels && labels.length ? ` & labels=${labels.join('+')}` : ''}
        {fields && fields.length ? ` & labels=${fields.join('+')}` : ''}
      </Typography.Title>
      {typeName && (
        <TableApiBuiltin
          resourceType={apiGroup.length > 0 ? 'api' : 'builtin'}
          namespace={namespace}
          apiGroup={apiGroup.length > 0 ? apiGroup : undefined}
          apiVersion={apiGroup.length > 0 ? apiVersion : undefined}
          typeName={typeName}
          specificName={name?.length ? name : undefined}
          labels={labels?.length ? labels : undefined}
          fields={fields?.length ? fields : undefined}
          limit={searchParams.get('limit')}
          customizationIdPrefix={tableCustomizationIdPrefix}
          searchMount
        />
      )}
    </div>
  )
}

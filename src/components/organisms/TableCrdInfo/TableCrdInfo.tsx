import React, { FC, useState, useEffect } from 'react'
// import { Typography, Spin, Alert, Tabs } from 'antd'
import { Spin, Alert } from 'antd'
import { usePermissions, checkIfApiInstanceNamespaceScoped, useCrdData } from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { ResourceInfo } from './molecules'

type TTableCrdInfoProps = {
  namespace?: string
  apiGroup: string
  apiVersion: string
  apiExtensionVersion: string
  crdName: string
  inside?: boolean
}

export const TableCrdInfo: FC<TTableCrdInfoProps> = ({
  namespace,
  apiGroup,
  apiVersion,
  apiExtensionVersion,
  crdName,
  inside,
}) => {
  const cluster = useSelector((state: RootState) => state.cluster.cluster)
  const swagger = useSelector((state: RootState) => state.swagger.swagger)

  const [isNamespaced, setIsNamespaced] = useState<boolean>()

  const { isPending, error, data } = useCrdData({
    clusterName: cluster,
    crdName,
    apiExtensionVersion,
  })

  useEffect(() => {
    if (swagger && data && !isPending && !error) {
      const { isNamespaceScoped } = checkIfApiInstanceNamespaceScoped({
        apiGroup,
        apiVersion,
        typeName: data.spec.names.plural,
        swagger,
      })
      if (isNamespaceScoped) {
        setIsNamespaced(true)
      }
    }
  }, [swagger, data, isPending, error, apiGroup, apiVersion])

  const createPermission = usePermissions({
    apiGroup,
    typeName: data ? data.spec.names.singular : '',
    namespace: '',
    clusterName: cluster,
    verb: 'create',
    refetchInterval: false,
  })

  const updatePermission = usePermissions({
    apiGroup,
    typeName: data ? data.spec.names.singular : '',
    namespace: '',
    clusterName: cluster,
    verb: 'update',
    refetchInterval: false,
  })

  const deletePermission = usePermissions({
    apiGroup,
    typeName: data ? data.spec.names.singular : '',
    namespace: '',
    clusterName: cluster,
    verb: 'delete',
    refetchInterval: false,
  })

  return (
    <>
      {isPending && <Spin />}
      {error && <Alert message={`An error has occurred: ${error?.message} `} type="error" />}
      {!error && data && data.spec && (
        <ResourceInfo
          clusterName={cluster}
          namespace={namespace}
          crdName={crdName}
          crdPluralName={data.spec.names.plural}
          apiGroup={data.spec.group}
          apiVersion={apiVersion}
          apiExtensionVersion={apiExtensionVersion}
          crdAdditionalPrinterColumns={
            data.spec.versions.find(({ name }) => name === apiVersion)?.additionalPrinterColumns
          }
          permissions={{
            canCreate: isNamespaced ? true : createPermission.data?.status.allowed,
            canUpdate: isNamespaced ? true : updatePermission.data?.status.allowed,
            canDelete: isNamespaced ? true : deletePermission.data?.status.allowed,
          }}
          inside={inside}
        />
      )}
    </>
  )
}

//   return (
//     <Tabs defaultActiveKey="instances">
//       <Tabs.TabPane tab="Details" key="details">
//         {isPending && <Spin />}
//         {!error && data && (
//           <>
//             <div>
//               <Typography.Text type="secondary">Kind Name: </Typography.Text>
//               <Typography.Text>{data.spec.names.kind}</Typography.Text>
//             </div>
//             <div>
//               <Typography.Text type="secondary">Plural Name: </Typography.Text>
//               <Typography.Text>{data.spec.names.plural}</Typography.Text>
//             </div>
//             <div>
//               <Typography.Text type="secondary">Versions: </Typography.Text>
//               <Typography.Text>
//                 {data.spec.versions.length > 0 && data.spec.versions.map(({ name }) => name).join(', ')}
//               </Typography.Text>
//             </div>
//           </>
//         )}
//         {error && <Alert message={`An error has occurred: ${error?.message} `} type="error" />}
//       </Tabs.TabPane>
//       <Tabs.TabPane tab="Instances" key="instances">
//         {isPending && <Spin />}
//         {error && <Alert message={`An error has occurred: ${error?.message} `} type="error" />}
//         {!error && data && data.spec && (
//           <ResourceInfo
//             clusterName={cluster}
//             namespace={namespace}
//             crdName={crdName}
//             crdPluralName={data.spec.names.plural}
//             apiGroup={data.spec.group}
//             apiVersion={apiVersion}
//             apiExtensionVersion={apiExtensionVersion}
//             crdAdditionalPrinterColumns={
//               data.spec.versions.find(({ name }) => name === apiVersion)?.additionalPrinterColumns
//             }
//             permissions={{
//               canCreate: isNamespaced ? true : createPermission.data?.status.allowed,
//               canUpdate: isNamespaced ? true : updatePermission.data?.status.allowed,
//               canDelete: isNamespaced ? true : deletePermission.data?.status.allowed,
//             }}
//           />
//         )}
//       </Tabs.TabPane>
//     </Tabs>
//   )
// }

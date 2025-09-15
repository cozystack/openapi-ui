/* eslint-disable max-lines-per-function */
import React, { FC } from 'react'
import { Search as PackageSearch } from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

export const Search: FC = () => {
  const cluster = useSelector((state: RootState) => state.cluster.cluster)

  return <PackageSearch cluster={cluster} />
}

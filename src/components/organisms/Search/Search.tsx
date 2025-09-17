/* eslint-disable max-lines-per-function */
import React, { FC, Fragment, useState } from 'react'
import { Search as PackageSearch, Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { SearchEntry } from './molecules'

export const Search: FC = () => {
  const cluster = useSelector((state: RootState) => state.cluster.cluster)

  const [currentSearch, setCurrentSearch] = useState<string[]>()

  return (
    <>
      <PackageSearch cluster={cluster} updateCurrentSearch={value => setCurrentSearch(value)} />
      {currentSearch?.map(item => (
        <Fragment key={item}>
          <SearchEntry resource={item} />
          <Spacer $space={50} $samespace />
        </Fragment>
      ))}
    </>
  )
}

import React, { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useNavSelectorInside } from 'hooks/useNavSelectorInside'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from 'components/atoms'

type TSelectorInsideProps = {
  clusterName?: string
}

export const SelectorInside: FC<TSelectorInsideProps> = ({ clusterName }) => {
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const [selectedClusterName, setSelectedClusterName] = useState(clusterName)

  const { clustersInSidebar } = useNavSelectorInside(selectedClusterName)

  const handleClusterChange = (value?: string) => {
    if (value) {
      setSelectedClusterName(value)
      navigate(`${baseprefix}/inside/${value}/apis`)
    } else {
      navigate(`${baseprefix}/inside/`)
    }
  }

  useMountEffect(() => {
    setSelectedClusterName(clusterName)
  }, [clusterName])

  return (
    <EntrySelect
      placeholder="Cluster"
      options={clustersInSidebar}
      value={selectedClusterName}
      onChange={handleClusterChange}
      fullwidth
    />
  )
}

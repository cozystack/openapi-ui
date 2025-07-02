import React, { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { useNavSelector } from 'hooks/useNavSelector'
import { useMountEffect } from 'hooks/useMountEffect'
import { EntrySelect } from 'components/atoms'

type TSelectorProps = {
  clusterName?: string
  projectName?: string
}

export const Selector: FC<TSelectorProps> = ({ clusterName, projectName }) => {
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const [selectedClusterName, setSelectedClusterName] = useState(clusterName)

  const { clustersInSidebar } = useNavSelector(selectedClusterName, projectName)

  const handleClusterChange = (value?: string) => {
    if (value) {
      setSelectedClusterName(value)
      navigate(`${baseprefix}/clusters/${value}`)
    } else {
      navigate(`${baseprefix}/clusters/`)
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

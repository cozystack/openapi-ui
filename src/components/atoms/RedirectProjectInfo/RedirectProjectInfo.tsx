import { FC, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

export const RedirectProjectInfo: FC = () => {
  const { clusterName, namespace } = useParams()
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  navigate(`${baseprefix}/${clusterName}/${namespace}/factory/project/${namespace}`)

  useEffect(() => {
    navigate(`${baseprefix}/${clusterName}/${namespace}/factory/project/${namespace}`)
  }, [clusterName, namespace, baseprefix, navigate])

  return null
}

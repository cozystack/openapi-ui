import { FC, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import {
  BASE_PROJECTS_API_GROUP,
  BASE_PROJECTS_VERSION,
  BASE_PROJECTS_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

export const RedirectProjectList: FC = () => {
  const { clusterName } = useParams()
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  navigate(
    `${baseprefix}/${clusterName}/api-table/${BASE_PROJECTS_API_GROUP}/${BASE_PROJECTS_VERSION}/${BASE_PROJECTS_RESOURCE_NAME}`,
  )

  useEffect(() => {
    navigate(
      `${baseprefix}/${clusterName}/api-table/${BASE_PROJECTS_API_GROUP}/${BASE_PROJECTS_VERSION}/${BASE_PROJECTS_RESOURCE_NAME}`,
    )
  }, [clusterName, baseprefix, navigate])

  return null
}

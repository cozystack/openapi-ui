/* eslint-disable react/no-danger */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Flex, theme } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { TitleWithNoTopMargin } from 'components/atoms'
import { TMarketPlacePanel } from '../../types'
import { getPathToNav } from './utils'
import { Styled } from './styled'

type TCardInProjectProps = {
  clusterName: string
  namespace: string
  isEditMode?: boolean
  onDeleteClick: () => void
  onEditClick: () => void
} & Omit<TMarketPlacePanel, 'hidden'>

export const CardInProject: FC<TCardInProjectProps> = ({
  description,
  name,
  icon,
  clusterName,
  namespace,
  type,
  pathToNav,
  typeName,
  apiGroup,
  apiVersion,
  tags,
  disabled,
  isEditMode,
  onDeleteClick,
  onEditClick,
}) => {
  const { useToken } = theme
  const { token } = useToken()
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  let decodedIcon = ''

  try {
    decodedIcon = window.atob(icon)
  } catch {
    decodedIcon = "Can't decode"
  }

  const navigateUrl = getPathToNav({
    clusterName,
    namespace,
    type,
    pathToNav,
    typeName,
    apiGroup,
    apiVersion,
    baseprefix,
  })

  return (
    <Styled.CustomCard
      $isDisabled={disabled}
      $hoverColor={token.colorPrimary}
      onClick={() => (disabled ? null : navigate(navigateUrl))}
    >
      <Flex vertical style={{ width: '100%', height: '100%' }} gap="middle" justify="spaceBetween">
        <Styled.ControlsAndImageContainer>
          <Styled.ImageContainer dangerouslySetInnerHTML={{ __html: decodedIcon }} />
          {isEditMode && (
            <Styled.ControlsContainer>
              <Styled.ControlsItem>
                <DeleteOutlined
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDeleteClick()
                  }}
                />
              </Styled.ControlsItem>
              <Styled.ControlsItem>
                <EditOutlined
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEditClick()
                  }}
                />
              </Styled.ControlsItem>
            </Styled.ControlsContainer>
          )}
        </Styled.ControlsAndImageContainer>
        <TitleWithNoTopMargin level={4}>{name}</TitleWithNoTopMargin>
        <Styled.FlexGrow>
          <Styled.TagsContainer>
            {tags.map(tag => (
              <Styled.CustomTag key={tag}>{tag}</Styled.CustomTag>
            ))}
          </Styled.TagsContainer>
        </Styled.FlexGrow>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </Flex>
    </Styled.CustomCard>
  )
}

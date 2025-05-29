import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { TitleWithNoTopMargin } from 'components/atoms'
import { Styled } from './styled'

export const Logo: FC = () => {
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  return (
    <Styled.CursorPointer>
      <TitleWithNoTopMargin level={2} onClick={() => navigate(`${baseprefix}`)}>
        InCloud
      </TitleWithNoTopMargin>
    </Styled.CursorPointer>
  )
}

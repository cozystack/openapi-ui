import React, { FC } from 'react'
import { Switch } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from 'store/store'
import { setTheme } from 'store/theme/theme/theme'
import { Styled } from './styled'

export const ThemeSelector: FC = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)

  const updateTheme = (checked: boolean) => {
    if (checked) {
      localStorage.setItem('theme', 'dark')
      dispatch(setTheme('dark'))
    } else {
      localStorage.setItem('theme', 'light')
      dispatch(setTheme('light'))
    }
  }

  return (
    <Styled.Container>
      Dark Mode
      <Switch size="small" value={theme === 'dark'} onChange={checked => updateTheme(checked)} />
    </Styled.Container>
  )
}

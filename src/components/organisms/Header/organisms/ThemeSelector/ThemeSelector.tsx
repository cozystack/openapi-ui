import React, { FC } from 'react'
import { Button } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from 'store/store'
import { setTheme } from 'store/theme/theme/theme'

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
    <Button type="text" onClick={() => updateTheme(theme !== 'dark')}>
      <BulbOutlined />
    </Button>
  )
}

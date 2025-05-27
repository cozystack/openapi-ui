import React, { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { BaseTemplate } from 'templates'

type TMainPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const MainPage: FC<TMainPageProps> = ({ forcedTheme }) => {
  const navigate = useNavigate()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  useEffect(() => {
    navigate(`${baseprefix}/cluster-list`)
  }, [navigate, baseprefix])

  return <BaseTemplate forcedTheme={forcedTheme} />
}

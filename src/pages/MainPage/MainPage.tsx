import React, { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseTemplate } from 'templates'

type TMainPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const MainPage: FC<TMainPageProps> = ({ forcedTheme }) => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('./clusters')
  }, [navigate])

  return <BaseTemplate withNoCluster forcedTheme={forcedTheme} />
}

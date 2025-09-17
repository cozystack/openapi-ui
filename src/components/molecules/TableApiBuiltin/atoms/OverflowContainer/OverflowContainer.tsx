/* eslint-disable max-lines-per-function */
import React, { FC, PropsWithChildren } from 'react'
import { OverflowMaxHeightContainer } from 'components'

type TOverflowContainerProps = PropsWithChildren<{
  height: number
  searchMount?: boolean
}>

export const OverflowContainer: FC<TOverflowContainerProps> = ({ height, searchMount, children }) => {
  if (searchMount) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>
  }

  return <OverflowMaxHeightContainer $maxHeight={height}>{children}</OverflowMaxHeightContainer>
}

import React from 'react'
import {Box} from '../'

export type UnderlineNavActionsProps = {
  children: React.ReactNode
}

export const UnderlineNavActions = ({children}: UnderlineNavActionsProps) => {
  const styles = {
    flex: '1 1 auto',
    alignSelf: 'center'
  }
  return <Box sx={styles}>{children}</Box>
}

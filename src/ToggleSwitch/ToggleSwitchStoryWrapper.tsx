import React from 'react'
import {Box} from '..'

const ToggleSwitchStoryWrapper: React.FC<React.PropsWithChildren> = ({children}) => (
  <Box
    display="grid"
    gridTemplateColumns="max-content auto"
    maxWidth="20rem"
    alignItems="center"
    justifyContent="space-between"
  >
    {children}
  </Box>
)

export default ToggleSwitchStoryWrapper

import {BaseStyles, Box} from '@primer/components'
import {ThemeSwitcherProvider, ThemeSwitcher} from './theme-switcher'

import React from 'react'

// Users can shadow this file to wrap live previews.
// This is useful for applying global styles.
function LivePreviewWrapper({children}) {
  const [dayScheme, setDayScheme] = React.useState('light')
  return (
    <>
      <Box p={2} width="200px">
        <ThemeSwitcher
          onSwitch={scheme => {
            setDayScheme(scheme)
          }}
        />
      </Box>
      <ThemeSwitcherProvider colorProps={{dayScheme}}>
        <Box width="100%" p={3} bg="canvas.default" sx={{borderTopLeftRadius: 2, borderTopRightRadius: 2}}>
          <BaseStyles>{children}</BaseStyles>
        </Box>
      </ThemeSwitcherProvider>
    </>
  )
}

export default LivePreviewWrapper

import {BaseStyles, Box} from '@primer/components'
import {ThemeSwitcherProvider, defaultColorProps, ThemeSwitcher} from './theme-switcher'
import React from 'react'

// Users can shadow this file to wrap live previews.
// This is useful for applying global styles.
function LivePreviewWrapper({children}) {
  const [selectedColorProps, setColorProps] = React.useState(defaultColorProps)
  return (
    <ThemeSwitcherProvider colorProps={selectedColorProps}>
      <Box width="100%" p={3} bg="canvas.default" sx={{borderTopLeftRadius: 2, borderTopRightRadius: 2}}>
        <ThemeSwitcher
          onSwitch={colorProps => {
            setColorProps(colorProps)
          }}
        />

        <BaseStyles>{children}</BaseStyles>
      </Box>
    </ThemeSwitcherProvider>
  )
}

export default LivePreviewWrapper

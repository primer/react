import {BaseStyles, Box, ThemeProvider} from '@primer/components'
import React from 'react'

// This is a temporary way to allow us to preview components in dark mode.
// We'll replace this component when @primer/components has a first-class
// API for theme switching.
function ThemeSwitcher({children}) {
  const [colorMode, setColorMode] = React.useState('day')

  React.useEffect(() => {
    function handleKeyDown(event) {
      // Use `ctrl + cmd + t` to toggle between light and dark mode
      if (event.key === 't' && event.ctrlKey && event.metaKey) {
        setColorMode(colorMode === 'day' ? 'night' : 'day')
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [colorMode])

  return <ThemeProvider colorMode={colorMode}>{children}</ThemeProvider>
}

// Users can shadow this file to wrap live previews.
// This is useful for applying global styles.
function LivePreviewWrapper({children}) {
  return (
    <ThemeSwitcher>
      <Box width="100%" p={3} bg="canvas.default" sx={{borderTopLeftRadius: 2, borderTopRightRadius: 2}}>
        <BaseStyles>{children}</BaseStyles>
      </Box>
    </ThemeSwitcher>
  )
}

export default LivePreviewWrapper

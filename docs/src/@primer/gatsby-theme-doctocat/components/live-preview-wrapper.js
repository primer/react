import {BaseStyles, Box} from '@primer/components'
import {theme as darkTheme} from '@primer/components/theme-dark-preval'
import {theme as lightTheme} from '@primer/components/theme-preval'
import React from 'react'
import {ThemeProvider} from 'styled-components'

// This is a temporary way to allow us to preview components in dark mode.
// We'll replace this component when @primer/components has a first-class
// API for theme switching.
function ThemeSwitcher({children}) {
  const [theme, setTheme] = React.useState('light')

  React.useEffect(() => {
    function handleKeyDown(event) {
      // Use `ctrl + cmd + t` to toggle between light and dark mode
      if (event.key === 't' && event.ctrlKey && event.metaKey) {
        setTheme(theme === 'light' ? 'dark' : 'light')
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [theme])

  return <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>{children}</ThemeProvider>
}

// Users can shadow this file to wrap live previews.
// This is useful for applying global styles.
function LivePreviewWrapper({children}) {
  return (
    <ThemeSwitcher>
      <Box width="100%" p={3} bg="bg.canvas" sx={{borderTopLeftRadius: 2, borderTopRightRadius: 2}}>
        <BaseStyles>{children}</BaseStyles>
      </Box>
    </ThemeSwitcher>
  )
}

export default LivePreviewWrapper

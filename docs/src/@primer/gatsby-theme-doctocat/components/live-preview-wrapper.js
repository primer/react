import {BaseStyles, Box, ThemeProvider, useTheme, DropdownMenu, DropdownButton} from '@primer/components'
import React from 'react'

function ThemeSwitcher() {
  const {theme, dayScheme, setDayScheme} = useTheme()
  const items = Object.keys(theme.colorSchemes).map(scheme => ({text: scheme.replace(/_/g, ' '), key: scheme}))
  const selectedItem = React.useMemo(() => items.find(item => item.key === dayScheme), [items, dayScheme])
  return (
    <DropdownMenu
      renderAnchor={({children, ...anchorProps}) => (
        <DropdownButton variant="small" {...anchorProps}>
          {children}
        </DropdownButton>
      )}
      items={items}
      selectedItem={selectedItem}
      onChange={item => {
        setDayScheme(item.key)
      }}
    />
  )
}

// Users can shadow this file to wrap live previews.
// This is useful for applying global styles.
function LivePreviewWrapper({children}) {
  const [showSwitcher, setShowSwitcher] = React.useState(false)
  return (
    <ThemeProvider>
      <Box
        tabIndex="0"
        onFocusCapture={() => {
          setShowSwitcher(true)
        }}
        onMouseEnter={() => {
          setShowSwitcher(true)
        }}
        onMouseLeave={() => {
          setShowSwitcher(false)
        }}
        width="100%"
        bg="canvas.default"
        position="relative"
        sx={{borderTopLeftRadius: 2, borderTopRightRadius: 2}}
      >
        <Box p={2} display={showSwitcher ? '' : 'none'} zIndex="1" position="absolute" right="2">
          <ThemeSwitcher />
        </Box>
        <Box p={3}>
          <BaseStyles>{children}</BaseStyles>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default LivePreviewWrapper

import {BaseStyles, Box, ThemeProvider, useTheme, DropdownMenu, DropdownButton} from '@primer/components'
import React from 'react'

function ThemeSwitcher({setIsDropdownOpen}) {
  const {theme, dayScheme, setDayScheme} = useTheme()
  const items = Object.keys(theme.colorSchemes).map(scheme => ({text: scheme.replace(/_/g, ' '), key: scheme}))
  const selectedItem = React.useMemo(() => items.find(item => item.key === dayScheme), [items, dayScheme])
  return (
    <DropdownMenu
      onOpenChange={setIsDropdownOpen}
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
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
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
          !isDropdownOpen && setShowSwitcher(false)
        }}
        width="100%"
        bg="canvas.default"
        position="relative"
        sx={{borderTopLeftRadius: 2, borderTopRightRadius: 2, display: 'flex'}}
      >
        <Box p={3} sx={{flexGrow: 1}}>
          <BaseStyles>{children}</BaseStyles>
        </Box>
        <Box p={2} display={showSwitcher ? '' : 'none'}>
          <ThemeSwitcher setIsDropdownOpen={setIsDropdownOpen} />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default LivePreviewWrapper

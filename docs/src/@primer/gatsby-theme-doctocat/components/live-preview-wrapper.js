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
  return (
    <ThemeProvider>
      <Box width="100%" bg="canvas.default" sx={{borderTopLeftRadius: 2, borderTopRightRadius: 2}}>
        <Box pt={2} px={2} display="flex" justifyContent="flex-end">
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

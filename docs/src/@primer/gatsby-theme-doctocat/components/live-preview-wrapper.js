import React from 'react'
import {ActionMenu, ActionList, BaseStyles, Box, ThemeProvider, useTheme} from '@primer/react'

function ThemeSwitcher() {
  const {theme, dayScheme, setDayScheme} = useTheme()
  const items = Object.keys(theme.colorSchemes).map(scheme => ({name: scheme.replace(/_/g, ' '), key: scheme}))
  const selectedItem = React.useMemo(() => items.find(item => item.key === dayScheme), [items, dayScheme])
  const itemsKeys = items.map(item => item.key)
  const [selectedIndex, setSelectedIndex] = React.useState(itemsKeys.indexOf(dayScheme))

  return (
    <ActionMenu>
      <ActionMenu.Button aria-label="Select field type">{selectedItem?.name}</ActionMenu.Button>
      <ActionMenu.Overlay sx={{width: 'medium'}}>
        <ActionList selectionVariant="single">
          {items.map((type, index) => (
            <ActionList.Item
              key={index}
              selected={index === selectedIndex}
              onSelect={() => {
                setSelectedIndex(index)
                setDayScheme(items[index].key)
              }}
            >
              {type.name}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
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

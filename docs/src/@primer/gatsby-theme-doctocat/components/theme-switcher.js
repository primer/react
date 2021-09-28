import React from 'react'
import {ThemeProvider, useTheme, DropdownMenu, DropdownButton} from '@primer/components'

function ThemeSwitcherProvider({children, colorProps}) {
  return (
    <ThemeProvider {...defaultColorProps} {...colorProps}>
      {children}
    </ThemeProvider>
  )
}

function ThemeSwitcher({onSwitch}) {
  const {theme} = useTheme()
  const items = Object.keys(theme.colorSchemes).map(scheme => ({text: scheme, key: scheme}))
  const [selectedItem, setSelectedItem] = React.useState({
    key: defaultColorProps.dayScheme,
    text: defaultColorProps.dayScheme
  })

  return (
    <DropdownMenu
      renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
        <DropdownButton aria-labelledby={`favorite-color-label ${ariaLabelledBy}`} {...anchorProps}>
          {children}
        </DropdownButton>
      )}
      items={items}
      selectedItem={selectedItem}
      onChange={item => {
        setSelectedItem(item)
        onSwitch(item.key)
      }}
    />
  )
}
const defaultColorProps = {
  colorMode: 'day',
  dayScheme: 'light',
  nightScheme: 'dark'
}

export {ThemeSwitcherProvider, defaultColorProps, ThemeSwitcher}

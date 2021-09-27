import React from 'react'
import {ThemeProvider, useTheme, Dropdown} from '@primer/components'

function ThemeSwitcherProviderV2({children, colorProps}) {
  return <ThemeProvider {...colorProps}>{children}</ThemeProvider>
}

function ThemeSwitcher({onSwitch}) {
  const {theme} = useTheme()
  //   return <Dropdown>
  //   <Dropdown.Button>ColorScheme</Dropdown.Button>
  //   <Dropdown.Menu
  //     direction="sw"
  //     items={theme.colorSchemes}
  //     onChange={colorScheme => {
  //       const colorMode = colorScheme === 'light' ? 'day' : 'night'
  //       const nightScheme = colorScheme === 'light' ? 'dark' : colorScheme
  //       onSwitch({
  //         colorMode,
  //         dayScheme: 'light',
  //         nightScheme
  //       })
  //     }}
  //   ></Dropdown.Menu>
  // </Dropdown>
  return (
    <select
      style={{float: 'right'}}
      onChange={event => {
        const colorScheme = event.target.value
        const colorMode = colorScheme === 'light' ? 'day' : 'night'
        const nightScheme = colorScheme === 'light' ? 'dark' : colorScheme
        onSwitch({
          colorMode,
          dayScheme: 'light',
          nightScheme
        })
      }}
    >
      {Object.keys(theme.colorSchemes).map(key => (
        <option>{key}</option>
      ))}
    </select>
  )
}
const defaultColorProps = {
  colorMode: 'day',
  dayScheme: 'night'
}

export {ThemeSwitcherProviderV2, defaultColorProps, ThemeSwitcher}

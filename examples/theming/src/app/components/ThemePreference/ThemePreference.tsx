'use client'

import {SunIcon, MoonIcon} from '@primer/octicons-react'
import {useTheme} from '@primer/styled-react'
import {Button} from '@primer/react'

import classes from './ThemePreference.module.css'

export function ThemePreference() {
  const {setColorMode} = useTheme()
  return (
    <Button
      aria-label="Toggle theme preference"
      type="button"
      onClick={async () => {
        const colorMode = document.documentElement.getAttribute('data-color-mode')
        const nextColorMode = colorMode === 'light' ? 'dark' : 'light'
        document.documentElement.setAttribute('data-color-mode', nextColorMode)

        setColorMode(nextColorMode)

        await fetch('http://localhost:3000/api/color-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            colorMode: nextColorMode,
          }),
        })
      }}
    >
      <SunIcon className={classes.Light} />
      <MoonIcon className={classes.Dark} />
    </Button>
  )
}

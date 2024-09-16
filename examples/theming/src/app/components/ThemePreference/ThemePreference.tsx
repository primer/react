'use client'

import {SunIcon, MoonIcon} from '@primer/octicons-react'
import {Button, useTheme} from '@primer/react'
import {clsx} from 'clsx'
import classes from './ThemePreference.module.css'

export function ThemePreference() {
  const {setColorMode} = useTheme()
  return (
    <Button
      aria-label="Toggle theme preference"
      type="button"
      onClick={() => {
        const {colorMode} = document.documentElement.dataset
        const nextColorMode = colorMode === 'light' ? 'dark' : 'light'
        document.documentElement.dataset.colorMode = nextColorMode

        setColorMode(nextColorMode)

        fetch('http://localhost:3000/api/color-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            colorMode: nextColorMode,
          }),
        }).catch(error => {
          console.log(error)
        })
      }}
    >
      <SunIcon className={clsx(classes.icon, classes.light)} />
      <MoonIcon className={clsx(classes.icon, classes.dark)} />
    </Button>
  )
}

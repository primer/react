import React from 'react'
import {useSyncedState} from '../../hooks/useSyncedState'
import type {ThemeContextValue} from '../../ThemeContext'
import type {ColorMode, ThemeProviderProps} from '../../ThemeProvider'
import {useTheme} from '../../useTheme'

const defaultColorMode = 'day'
const defaultDayScheme = 'light'
const defaultNightScheme = 'dark'

export interface ThemeProviderValue extends ThemeContextValue {
  colorScheme: string
  colorMode: NonNullable<ThemeContextValue['colorMode']>
  resolvedColorMode: ColorMode
  dayScheme: string
  nightScheme: string
}

export function useThemeProvider(props: ThemeProviderProps): {
  parentValue: ThemeContextValue
  value: ThemeProviderValue
} {
  const parentValue = useTheme()
  const [colorMode, setColorMode] = useSyncedState(props.colorMode ?? parentValue.colorMode ?? defaultColorMode)
  const [dayScheme, setDayScheme] = useSyncedState(props.dayScheme ?? parentValue.dayScheme ?? defaultDayScheme)
  const [nightScheme, setNightScheme] = useSyncedState(
    props.nightScheme ?? parentValue.nightScheme ?? defaultNightScheme,
  )
  const systemColorMode = useSystemColorMode()
  const resolvedColorMode = colorMode === 'auto' ? systemColorMode : colorMode
  const colorScheme = resolvedColorMode === 'day' || resolvedColorMode === 'light' ? dayScheme : nightScheme

  const value = React.useMemo(
    () => ({
      colorScheme,
      colorMode,
      resolvedColorMode,
      dayScheme,
      nightScheme,
      setColorMode,
      setDayScheme,
      setNightScheme,
    }),
    [colorScheme, colorMode, resolvedColorMode, dayScheme, nightScheme, setColorMode, setDayScheme, setNightScheme],
  )

  return {parentValue, value}
}

function subscribeToSystemColorMode(callback: () => void) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const media = window?.matchMedia?.('(prefers-color-scheme: dark)')
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  media?.addEventListener('change', callback)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return () => media?.removeEventListener('change', callback)
}

function useSystemColorMode() {
  return React.useSyncExternalStore<ColorMode>(subscribeToSystemColorMode, getSystemColorMode, () => 'day')
}

function getSystemColorMode(): ColorMode {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'night' : 'day'
}

import React from 'react'
import defaultTheme from './theme'
import {useSyncedState} from './hooks/useSyncedState'
import {ThemeContext} from './ThemeContext'
import {useTheme} from './useTheme'

export const defaultColorMode = 'day'
const defaultDayScheme = 'light'
const defaultNightScheme = 'dark'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Theme = {[key: string]: any}
export type ColorMode = 'day' | 'night' | 'light' | 'dark'
export type ColorModeWithAuto = ColorMode | 'auto'

export type ThemeProviderProps = {
  colorMode?: ColorModeWithAuto
  dayScheme?: string
  nightScheme?: string
  /**
   * @deprecated This prop is no longer used and has no effect.
   */
  preventSSRMismatch?: boolean
  /**
   * When true, only provides theme context to descendants without rendering
   * a wrapping `<div>` with `data-*` theme attributes.
   * @default false
   */
  contextOnly?: boolean
}

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({children, ...props}) => {
  // Get fallback values from parent ThemeProvider (if exists)
  const {
    theme: fallbackTheme,
    colorMode: fallbackColorMode,
    dayScheme: fallbackDayScheme,
    nightScheme: fallbackNightScheme,
  } = useTheme()

  // Initialize state
  const theme = fallbackTheme ?? defaultTheme

  const [colorMode, setColorMode] = useSyncedState(props.colorMode ?? fallbackColorMode ?? defaultColorMode)
  const [dayScheme, setDayScheme] = useSyncedState(props.dayScheme ?? fallbackDayScheme ?? defaultDayScheme)
  const [nightScheme, setNightScheme] = useSyncedState(props.nightScheme ?? fallbackNightScheme ?? defaultNightScheme)
  const systemColorMode = useSystemColorMode()
  const resolvedColorMode = resolveColorMode(colorMode, systemColorMode)
  const colorScheme = chooseColorScheme(resolvedColorMode, dayScheme, nightScheme)

  const contextValue = React.useMemo(
    () => ({
      theme,
      colorScheme,
      colorMode,
      resolvedColorMode,
      dayScheme,
      nightScheme,
      setColorMode,
      setDayScheme,
      setNightScheme,
    }),
    [
      theme,
      colorScheme,
      colorMode,
      resolvedColorMode,
      dayScheme,
      nightScheme,
      setColorMode,
      setDayScheme,
      setNightScheme,
    ],
  )

  if (props.contextOnly) {
    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        data-component="ThemeProvider"
        data-color-mode={colorMode === 'auto' ? 'auto' : colorScheme.includes('dark') ? 'dark' : 'light'}
        data-light-theme={dayScheme}
        data-dark-theme={nightScheme}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
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

function resolveColorMode(colorMode: ColorModeWithAuto, systemColorMode: ColorMode) {
  switch (colorMode) {
    case 'auto':
      return systemColorMode
    default:
      return colorMode
  }
}

function chooseColorScheme(colorMode: ColorMode, dayScheme: string, nightScheme: string) {
  switch (colorMode) {
    case 'day':
    case 'light':
      return dayScheme
    case 'dark':
    case 'night':
      return nightScheme
  }
}

export default ThemeProvider

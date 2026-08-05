import React from 'react'
import {useSyncedState} from '../hooks/useSyncedState'
import {ThemeContext} from '../ThemeContext'
import type {ColorMode, ThemeProviderProps} from '../ThemeProvider'
import {useTheme} from '../useTheme'

const defaultColorMode = 'day'
const defaultDayScheme = 'light'
const defaultNightScheme = 'dark'

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({children, ...props}) => {
  const {colorMode: fallbackColorMode, dayScheme: fallbackDayScheme, nightScheme: fallbackNightScheme} = useTheme()
  const [colorMode, setColorMode] = useSyncedState(props.colorMode ?? fallbackColorMode ?? defaultColorMode)
  const [dayScheme, setDayScheme] = useSyncedState(props.dayScheme ?? fallbackDayScheme ?? defaultDayScheme)
  const [nightScheme, setNightScheme] = useSyncedState(props.nightScheme ?? fallbackNightScheme ?? defaultNightScheme)
  const systemColorMode = useSystemColorMode()
  const resolvedColorMode = colorMode === 'auto' ? systemColorMode : colorMode
  const colorScheme = resolvedColorMode === 'day' || resolvedColorMode === 'light' ? dayScheme : nightScheme

  const contextValue = React.useMemo(
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

export default ThemeProvider

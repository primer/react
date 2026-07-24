'use client'

import React from 'react'
import {cn} from './internal/cn'
import {ThemeContext, type ColorMode, type ColorModeWithAuto, type ThemeContextValue} from './ThemeContext'

export interface ThemeProviderProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  colorMode?: ColorModeWithAuto
  defaultColorMode?: ColorModeWithAuto
  dayScheme?: string
  defaultDayScheme?: string
  nightScheme?: string
  defaultNightScheme?: string
  contextOnly?: boolean
  onColorModeChange?: (colorMode: ColorModeWithAuto) => void
  onDaySchemeChange?: (scheme: string) => void
  onNightSchemeChange?: (scheme: string) => void
}

function normalizeColorMode(colorMode: ColorMode): 'light' | 'dark' {
  return colorMode === 'dark' || colorMode === 'night' ? 'dark' : 'light'
}

function subscribeToSystemColorMode(callback: () => void) {
  if (typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getSystemColorMode(): 'light' | 'dark' {
  if (typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function useControllableValue<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined
  defaultValue: T
  onChange: ((value: T) => void) | undefined
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const currentValue = value ?? uncontrolledValue

  const setValue = React.useCallback(
    (nextValue: T) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [onChange, value],
  )

  return [currentValue, setValue] as const
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  colorMode: controlledColorMode,
  defaultColorMode = 'day',
  dayScheme: controlledDayScheme,
  defaultDayScheme = 'light',
  nightScheme: controlledNightScheme,
  defaultNightScheme = 'dark',
  contextOnly = false,
  onColorModeChange,
  onDaySchemeChange,
  onNightSchemeChange,
  className,
  ...rest
}) => {
  const parent = React.useContext(ThemeContext)
  const [colorMode, setColorMode] = useControllableValue({
    value: controlledColorMode,
    defaultValue: parent?.colorMode ?? defaultColorMode,
    onChange: onColorModeChange,
  })
  const [dayScheme, setDayScheme] = useControllableValue({
    value: controlledDayScheme,
    defaultValue: parent?.dayScheme ?? defaultDayScheme,
    onChange: onDaySchemeChange,
  })
  const [nightScheme, setNightScheme] = useControllableValue({
    value: controlledNightScheme,
    defaultValue: parent?.nightScheme ?? defaultNightScheme,
    onChange: onNightSchemeChange,
  })
  const systemColorMode = React.useSyncExternalStore<'light' | 'dark'>(
    subscribeToSystemColorMode,
    getSystemColorMode,
    () => 'light',
  )
  const resolvedColorMode = colorMode === 'auto' ? systemColorMode : normalizeColorMode(colorMode)
  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({
      colorMode,
      resolvedColorMode,
      dayScheme,
      nightScheme,
      setColorMode,
      setDayScheme,
      setNightScheme,
    }),
    [colorMode, dayScheme, nightScheme, resolvedColorMode, setColorMode, setDayScheme, setNightScheme],
  )

  if (contextOnly) {
    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        {...rest}
        data-component="ThemeProvider"
        data-color-mode={colorMode === 'auto' ? 'auto' : resolvedColorMode}
        data-light-theme={dayScheme}
        data-dark-theme={nightScheme}
        className={cn('contents', className)}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

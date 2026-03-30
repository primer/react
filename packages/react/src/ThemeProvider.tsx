import React from 'react'
import defaultTheme from './theme'
import deepmerge from 'deepmerge'
import {useId} from './hooks'
import {useSyncedState} from './hooks/useSyncedState'

export const defaultColorMode = 'day'
const defaultDayScheme = 'light'
const defaultNightScheme = 'dark'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Theme = {[key: string]: any}
type ColorMode = 'day' | 'night' | 'light' | 'dark'
export type ColorModeWithAuto = ColorMode | 'auto'

export type ThemeProviderProps = {
  colorMode?: ColorModeWithAuto
  dayScheme?: string
  nightScheme?: string
  preventSSRMismatch?: boolean
}

const ThemeContext = React.createContext<{
  theme?: Theme
  colorScheme?: string
  colorMode?: ColorModeWithAuto
  resolvedColorMode?: ColorMode
  resolvedColorScheme?: string
  dayScheme?: string
  nightScheme?: string
  setColorMode: React.Dispatch<React.SetStateAction<ColorModeWithAuto>>
  setDayScheme: React.Dispatch<React.SetStateAction<string>>
  setNightScheme: React.Dispatch<React.SetStateAction<string>>
}>({
  setColorMode: () => null,
  setDayScheme: () => null,
  setNightScheme: () => null,
})

// inspired from __NEXT_DATA__, we use application/json to avoid CSRF policy with inline scripts
const serverHandoffCache = new Map<string, Record<string, unknown>>()
const emptyHandoff: Record<string, unknown> = {}
const getServerHandoff = (id: string) => {
  if (typeof document === 'undefined') return emptyHandoff

  const cached = serverHandoffCache.get(id)
  if (cached !== undefined) return cached

  try {
    const serverData = document.getElementById(`__PRIMER_DATA_${id}__`)?.textContent
    if (serverData) {
      const parsed = JSON.parse(serverData)
      serverHandoffCache.set(id, parsed)
      return parsed
    }
  } catch (_error) {
    // if document/element does not exist or JSON is invalid, suppress error
  }

  const empty = {}
  serverHandoffCache.set(id, empty)
  return empty
}

const emptySubscribe = () => () => {}

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

  const uniqueDataId = useId()

  const [colorMode, setColorMode] = useSyncedState(props.colorMode ?? fallbackColorMode ?? defaultColorMode)
  const [dayScheme, setDayScheme] = useSyncedState(props.dayScheme ?? fallbackDayScheme ?? defaultDayScheme)
  const [nightScheme, setNightScheme] = useSyncedState(props.nightScheme ?? fallbackNightScheme ?? defaultNightScheme)
  const systemColorMode = useSystemColorMode()
  const clientColorMode = resolveColorMode(colorMode, systemColorMode)
  // During SSR/hydration, use the server-rendered color mode from the handoff script tag
  // to avoid mismatches. After hydration, resolve from client state.
  const resolvedColorMode = React.useSyncExternalStore(
    emptySubscribe,
    () => clientColorMode,
    () => getServerHandoff(uniqueDataId).resolvedServerColorMode ?? clientColorMode,
  )
  const colorScheme = chooseColorScheme(resolvedColorMode, dayScheme, nightScheme)
  const {resolvedTheme, resolvedColorScheme} = React.useMemo(
    () => applyColorScheme(theme, colorScheme),
    [theme, colorScheme],
  )

  const contextValue = React.useMemo(
    () => ({
      theme: resolvedTheme,
      colorScheme,
      colorMode,
      resolvedColorMode,
      resolvedColorScheme,
      dayScheme,
      nightScheme,
      setColorMode,
      setDayScheme,
      setNightScheme,
    }),
    [
      resolvedTheme,
      colorScheme,
      colorMode,
      resolvedColorMode,
      resolvedColorScheme,
      dayScheme,
      nightScheme,
      setColorMode,
      setDayScheme,
      setNightScheme,
    ],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        data-color-mode={colorMode === 'auto' ? 'auto' : colorScheme.includes('dark') ? 'dark' : 'light'}
        data-light-theme={dayScheme}
        data-dark-theme={nightScheme}
      >
        {children}
        {props.preventSSRMismatch ? (
          <script
            type="application/json"
            id={`__PRIMER_DATA_${uniqueDataId}__`}
            dangerouslySetInnerHTML={{__html: JSON.stringify({resolvedServerColorMode: resolvedColorMode})}}
          />
        ) : null}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return React.useContext(ThemeContext)
}

export function useColorSchemeVar(values: Partial<Record<string, string>>, fallback: string) {
  const {colorScheme = ''} = useTheme()
  return values[colorScheme] ?? fallback
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

function applyColorScheme(
  theme: Theme,
  colorScheme: string,
): {resolvedTheme: Theme; resolvedColorScheme: string | undefined} {
  if (!theme.colorSchemes) {
    return {
      resolvedTheme: theme,
      resolvedColorScheme: undefined,
    }
  }

  if (!theme.colorSchemes[colorScheme]) {
    // eslint-disable-next-line no-console
    console.error(`\`${colorScheme}\` scheme not defined in \`theme.colorSchemes\``)

    // Apply the first defined color scheme
    const defaultColorScheme = Object.keys(theme.colorSchemes)[0]
    return {
      resolvedTheme: deepmerge(theme, theme.colorSchemes[defaultColorScheme]),
      resolvedColorScheme: defaultColorScheme,
    }
  }

  return {
    resolvedTheme: deepmerge(theme, theme.colorSchemes[colorScheme]),
    resolvedColorScheme: colorScheme,
  }
}

export default ThemeProvider

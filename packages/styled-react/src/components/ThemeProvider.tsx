import React from 'react'
import {ThemeProvider as SCThemeProvider} from 'styled-components'
import {theme as defaultTheme, useId, useSyncedState} from '@primer/react'
import deepmerge from 'deepmerge'

export const defaultColorMode = 'day'
const defaultDayScheme = 'light'
const defaultNightScheme = 'dark'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Theme = {[key: string]: any}
type ColorMode = 'day' | 'night' | 'light' | 'dark'
export type ColorModeWithAuto = ColorMode | 'auto'

export type ThemeProviderProps = {
  theme?: Theme
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
const getServerHandoff = (id: string) => {
  try {
    const serverData = document.getElementById(`__PRIMER_DATA_${id}__`)?.textContent
    if (serverData) return JSON.parse(serverData)
  } catch (_error) {
    // if document/element does not exist or JSON is invalid, supress error
  }
  return {}
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
  const theme = props.theme ?? fallbackTheme ?? defaultTheme

  const uniqueDataId = useId()
  // Lazy initializer reads DOM + parses JSON once instead of every render
  const [serverColorMode, setServerColorMode] = React.useState<ColorMode | undefined>(
    () => getServerHandoff(uniqueDataId).resolvedServerColorMode,
  )

  const [colorMode, setColorMode] = useSyncedState(props.colorMode ?? fallbackColorMode ?? defaultColorMode)
  const [dayScheme, setDayScheme] = useSyncedState(props.dayScheme ?? fallbackDayScheme ?? defaultDayScheme)
  const [nightScheme, setNightScheme] = useSyncedState(props.nightScheme ?? fallbackNightScheme ?? defaultNightScheme)
  const systemColorMode = useSystemColorMode()
  const resolvedColorMode = serverColorMode ?? resolveColorMode(colorMode, systemColorMode)
  const colorScheme = chooseColorScheme(resolvedColorMode, dayScheme, nightScheme)
  const {resolvedTheme, resolvedColorScheme} = React.useMemo(
    () => applyColorScheme(theme, colorScheme),
    [theme, colorScheme],
  )

  // After hydration, clear the server passthrough so client-side color mode takes over
  React.useEffect(
    function clearServerPassthrough() {
      if (serverColorMode !== undefined) {
        setServerColorMode(undefined)
      }
    },
    [serverColorMode],
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
      <SCThemeProvider theme={resolvedTheme}>
        {children}
        {props.preventSSRMismatch ? (
          <script
            type="application/json"
            id={`__PRIMER_DATA_${uniqueDataId}__`}
            dangerouslySetInnerHTML={{__html: JSON.stringify({resolvedServerColorMode: resolvedColorMode})}}
          />
        ) : null}
      </SCThemeProvider>
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

function useSystemColorMode() {
  const [systemColorMode, setSystemColorMode] = React.useState(getSystemColorMode)

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const media = window?.matchMedia?.('(prefers-color-scheme: dark)')

    function matchesMediaToColorMode(matches: boolean) {
      return matches ? 'night' : 'day'
    }

    function handleChange(event: MediaQueryListEvent) {
      const isNight = event.matches
      setSystemColorMode(matchesMediaToColorMode(isNight))
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (media) {
      // Only update if preference changed between useState init and effect
      const currentMode = matchesMediaToColorMode(media.matches)
      setSystemColorMode(prev => (prev === currentMode ? prev : currentMode))

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (media.addEventListener !== undefined) {
        media.addEventListener('change', handleChange)
        return function cleanup() {
          media.removeEventListener('change', handleChange)
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      else if (media.addListener !== undefined) {
        media.addListener(handleChange)
        return function cleanup() {
          media.removeListener(handleChange)
        }
      }
    }
  }, [])

  return systemColorMode
}

function getSystemColorMode(): ColorMode {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
    return 'night'
  }

  return 'day'
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

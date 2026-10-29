import {createContext, useContext} from 'react'
import {
  playgroundPalettes,
  type PlaygroundDensity,
  type PlaygroundSeriousness,
} from '../AppearancePlayground/AppearancePlayground.tokens'

interface AppearanceContextValue {
  scope: string
  density: PlaygroundDensity
  setDensity: (density: PlaygroundDensity) => void
  seriousness: PlaygroundSeriousness
  setSeriousness: (seriousness: PlaygroundSeriousness) => void
  theme: string
  setTheme: (theme: string) => void
  portalContext: {portalContainerName: string}
}

export const AppearanceContext = createContext<AppearanceContextValue | null>(null)

export function useAppearance() {
  const appearance = useContext(AppearanceContext)
  if (!appearance) throw new Error('Playground appearance controls require PlaygroundAppearanceProvider.')
  return appearance
}

export function usePlaygroundAppearanceScope() {
  const {scope, theme} = useAppearance()
  const palette = playgroundPalettes.find(value => value.id === theme)
  return {
    'data-playground-appearance': scope,
    'data-color-mode': palette?.mode,
    'data-light-theme': palette ? 'light' : undefined,
    'data-dark-theme': palette ? 'dark' : undefined,
    'data-playground-preset': palette?.preset,
  }
}

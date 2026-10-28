import {createContext, forwardRef, useCallback, useContext, useId, useMemo, useState} from 'react'
import type {HTMLAttributes, PropsWithChildren} from 'react'
import {clsx} from 'clsx'
import {ThemeProvider} from '../next/ThemeProvider'
import {PortalContext, registerPortalRoot} from '../Portal'
import {PlaygroundThemePicker} from './PlaygroundThemePicker'
import {
  densityVariables,
  paletteVariables,
  playgroundDensities,
  playgroundPalettes,
  type PlaygroundDensity,
} from './PlaygroundAppearance.tokens'
import classes from './PlaygroundAppearance.module.css'

interface AppearanceContextValue {
  scope: string
  density: PlaygroundDensity
  setDensity: (density: PlaygroundDensity) => void
  theme: string
  setTheme: (theme: string) => void
  portalContext: {portalContainerName: string}
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

function useAppearance() {
  const appearance = useContext(AppearanceContext)
  if (!appearance) throw new Error('Playground appearance controls require PlaygroundAppearanceProvider.')
  return appearance
}

export function PlaygroundAppearanceProvider({children}: PropsWithChildren) {
  const id = useId()
  const scope = `playground-${id}`
  const [density, setDensity] = useState<PlaygroundDensity>('default')
  const [theme, setTheme] = useState('primer')
  const portalContext = useMemo(() => ({portalContainerName: `${scope}-portals`}), [scope])
  const palette = playgroundPalettes.find(value => value.id === theme)
  const declarations = Object.entries({...densityVariables(density), ...paletteVariables(palette)})
    .map(([name, value]) => `${name}: ${value} !important;`)
    .join('\n')
  const selector = `[data-playground-appearance="${scope}"]`
  return (
    <AppearanceContext.Provider value={{scope, density, setDensity, theme, setTheme, portalContext}}>
      <style data-playground-appearance-style={scope}>{`:where(${selector}, ${selector} *) { ${declarations} }`}</style>
      {children}
    </AppearanceContext.Provider>
  )
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

export function PlaygroundAppearanceControls() {
  const {density, setDensity, theme, setTheme} = useAppearance()
  const id = useId()
  const densityIndex = playgroundDensities.findIndex(value => value.id === density)
  return (
    <section className={classes.Controls} aria-label="Preview appearance">
      <div className={classes.Control}>
        <label htmlFor={`${id}-density`}>
          Density
          <span className={classes.DensityValue}>{playgroundDensities[densityIndex].name}</span>
        </label>
        <input
          className={classes.DensitySlider}
          id={`${id}-density`}
          type="range"
          min={0}
          max={playgroundDensities.length - 1}
          step={1}
          value={densityIndex}
          list={`${id}-density-steps`}
          aria-label="Density"
          aria-valuetext={playgroundDensities[densityIndex].name}
          onChange={event => {
            const preset = playgroundDensities[event.currentTarget.valueAsNumber]
            if (!preset) throw new Error(`Unknown playground density step: ${event.currentTarget.value}`)
            setDensity(preset.id)
          }}
        />
        <datalist id={`${id}-density-steps`}>
          {playgroundDensities.map((preset, index) => (
            <option key={preset.id} value={index} label={preset.name} />
          ))}
        </datalist>
      </div>
      <PlaygroundThemePicker value={theme} onChange={setTheme} />
    </section>
  )
}

export const PlaygroundAppearanceSurface = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function PlaygroundAppearanceSurface({className, children, ...props}, ref) {
    const appearance = useAppearance()
    const attributes = usePlaygroundAppearanceScope()
    const palette = playgroundPalettes.find(value => value.id === appearance.theme)
    return (
      <ThemeProvider
        contextOnly
        colorMode={palette ? (palette.mode === 'dark' ? 'night' : 'day') : undefined}
        dayScheme={palette ? 'light' : undefined}
        nightScheme={palette ? 'dark' : undefined}
      >
        <PortalContext.Provider value={appearance.portalContext}>
          <div {...props} {...attributes} className={clsx(classes.Surface, className)} ref={ref}>
            {children}
          </div>
        </PortalContext.Provider>
      </ThemeProvider>
    )
  },
)

export function PlaygroundAppearancePortals(props: HTMLAttributes<HTMLDivElement>) {
  const {portalContext} = useAppearance()
  const register = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) registerPortalRoot(element, portalContext.portalContainerName)
    },
    [portalContext],
  )
  return <PlaygroundAppearanceSurface {...props} className={classes.Portals} ref={register} />
}

export function PlaygroundAppearance({children}: PropsWithChildren) {
  return (
    <PlaygroundAppearanceProvider>
      <div className={classes.Playground}>
        <PlaygroundAppearancePortals />
        <PlaygroundAppearanceControls />
        <PlaygroundAppearanceSurface>{children}</PlaygroundAppearanceSurface>
      </div>
    </PlaygroundAppearanceProvider>
  )
}

import {createContext, forwardRef, useContext, useId, useMemo, useState} from 'react'
import type {FC, HTMLAttributes, PropsWithChildren, ReactNode} from 'react'
import {clsx} from 'clsx'
import {ThemeProvider} from '../next/ThemeProvider'
import {PortalContext} from '../Portal'
import {useRegisteredPortalRoot} from '../internal/hooks/useRegisteredPortalRoot'
import {PlaygroundThemePicker} from './AppearancePlaygroundThemePicker'
import {
  densityVariables,
  paletteVariables,
  playgroundDensities,
  playgroundPalettes,
  playgroundSeriousnessProfiles,
  seriousnessVariables,
  type PlaygroundDensity,
  type PlaygroundSeriousness,
} from './AppearancePlayground.tokens'
import classes from './AppearancePlayground.module.css'

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
  const [seriousness, setSeriousness] = useState<PlaygroundSeriousness>('default')
  const [theme, setTheme] = useState('primer')
  const portalContext = useMemo(() => ({portalContainerName: `${scope}-portals`}), [scope])
  const palette = playgroundPalettes.find(value => value.id === theme)
  const updateSeriousness = (value: PlaygroundSeriousness) => {
    const preset = playgroundSeriousnessProfiles.find(profile => profile.id === value)
    if (!preset) throw new Error(`Unknown playground seriousness: ${value}`)
    setSeriousness(value)
    setDensity(preset.density)
  }
  const declarations = Object.entries({
    ...densityVariables(density),
    ...paletteVariables(palette),
    ...seriousnessVariables(seriousness),
  })
    .map(([name, value]) => `${name}: ${value} !important;`)
    .join('\n')
  const selector = `[data-playground-appearance="${scope}"]`
  return (
    <AppearanceContext.Provider
      value={{
        scope,
        density,
        setDensity,
        seriousness,
        setSeriousness: updateSeriousness,
        theme,
        setTheme,
        portalContext,
      }}
    >
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
  const {density, setDensity, seriousness, setSeriousness, theme, setTheme} = useAppearance()
  const id = useId()
  const densityIndex = playgroundDensities.findIndex(value => value.id === density)
  const seriousnessIndex = playgroundSeriousnessProfiles.findIndex(value => value.id === seriousness)
  return (
    <section className={classes.Controls} aria-label="Preview appearance" data-component="AppearancePlaygroundControls">
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
      <div className={clsx(classes.Control, classes.SeriousnessControl)}>
        <label htmlFor={`${id}-seriousness`}>
          Seriousness
          <span className={classes.DensityValue}>{playgroundSeriousnessProfiles[seriousnessIndex].name}</span>
        </label>
        <input
          className={classes.DensitySlider}
          id={`${id}-seriousness`}
          type="range"
          min={0}
          max={playgroundSeriousnessProfiles.length - 1}
          step={1}
          value={seriousnessIndex}
          list={`${id}-seriousness-steps`}
          aria-label="Seriousness"
          aria-valuetext={playgroundSeriousnessProfiles[seriousnessIndex].name}
          aria-describedby={`${id}-seriousness-description`}
          onChange={event => {
            const preset = playgroundSeriousnessProfiles[event.currentTarget.valueAsNumber]
            if (!preset) throw new Error(`Unknown playground seriousness step: ${event.currentTarget.value}`)
            setSeriousness(preset.id)
          }}
        />
        <datalist id={`${id}-seriousness-steps`}>
          {playgroundSeriousnessProfiles.map((preset, index) => (
            <option key={preset.id} value={index} label={preset.name} />
          ))}
        </datalist>
        <span id={`${id}-seriousness-description`} hidden>
          Visual styling only, not a security setting. Presets combine spacing, fonts, weights and corner radii. Density
          can override spacing afterward. Default restores the theme styling and Default density.
        </span>
      </div>
      <PlaygroundThemePicker className={classes.ThemeControl} value={theme} onChange={setTheme} />
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
          <div
            {...props}
            {...attributes}
            data-component="AppearancePlaygroundSurface"
            className={clsx(classes.Surface, className)}
            ref={ref}
          >
            {children}
          </div>
        </PortalContext.Provider>
      </ThemeProvider>
    )
  },
)

export function PlaygroundAppearancePortals(props: HTMLAttributes<HTMLDivElement>) {
  const {portalContext} = useAppearance()
  const register = useRegisteredPortalRoot(portalContext.portalContainerName)
  return <PlaygroundAppearanceSurface {...props} className={classes.Portals} ref={register} />
}

export interface AppearancePlaygroundProps extends HTMLAttributes<HTMLDivElement> {
  /** App content whose appearance should be customized. */
  children: ReactNode
}

/**
 * Demo-only appearance controls and a scoped preview of the wrapped app.
 * Requires the app's normal Primer theme provider and base styles.
 */
export const AppearancePlayground: FC<AppearancePlaygroundProps> = ({children, className, ...props}) => {
  return (
    <PlaygroundAppearanceProvider>
      <div {...props} data-component="AppearancePlayground" className={clsx(classes.Playground, className)}>
        <PlaygroundAppearancePortals />
        <PlaygroundAppearanceControls />
        <PlaygroundAppearanceSurface>{children}</PlaygroundAppearanceSurface>
      </div>
    </PlaygroundAppearanceProvider>
  )
}

import {forwardRef, useId, useMemo, useState} from 'react'
import type {FC, HTMLAttributes, PropsWithChildren, ReactNode} from 'react'
import {clsx} from 'clsx'
import {ThemeProvider} from '../next/ThemeProvider'
import {useTheme} from '../useTheme'
import {PortalContext} from '../Portal'
import {useRegisteredPortalRoot} from '../internal/hooks/useRegisteredPortalRoot'
import {AppearanceContext, useAppearance, usePlaygroundAppearanceScope} from '../internal/AppearancePlaygroundContext'
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

export function PlaygroundAppearanceProvider({children}: PropsWithChildren) {
  const {colorScheme} = useTheme()
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
    ...seriousnessVariables(seriousness, palette?.mode ?? (colorScheme?.startsWith('dark') ? 'dark' : 'light')),
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

interface PlaygroundAppearanceDialsProps {
  density: PlaygroundDensity
  seriousness: PlaygroundSeriousness
  onDensityChange: (density: PlaygroundDensity) => void
  onSeriousnessChange: (seriousness: PlaygroundSeriousness) => void
}

export function PlaygroundAppearanceDials({
  density,
  seriousness,
  onDensityChange,
  onSeriousnessChange,
}: PlaygroundAppearanceDialsProps) {
  const id = useId()
  const densityIndex = playgroundDensities.findIndex(value => value.id === density)
  const seriousnessIndex = playgroundSeriousnessProfiles.findIndex(value => value.id === seriousness)
  return (
    <>
      <div className={classes.Control} data-component="AppearancePlaygroundDials.Density">
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
            const preset = playgroundDensities.find((_, index) => index === event.currentTarget.valueAsNumber)
            if (!preset) throw new Error(`Unknown playground density step: ${event.currentTarget.value}`)
            onDensityChange(preset.id)
          }}
        />
        <datalist id={`${id}-density-steps`}>
          {playgroundDensities.map((preset, index) => (
            <option key={preset.id} value={index} label={preset.name} />
          ))}
        </datalist>
      </div>
      <div
        className={clsx(classes.Control, classes.SeriousnessControl)}
        data-component="AppearancePlaygroundDials.Seriousness"
      >
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
            const preset = playgroundSeriousnessProfiles.find((_, index) => index === event.currentTarget.valueAsNumber)
            if (!preset) throw new Error(`Unknown playground seriousness step: ${event.currentTarget.value}`)
            onSeriousnessChange(preset.id)
          }}
        />
        <datalist id={`${id}-seriousness-steps`}>
          {playgroundSeriousnessProfiles.map((preset, index) => (
            <option key={preset.id} value={index} label={preset.name} />
          ))}
        </datalist>
        <span id={`${id}-seriousness-description`} hidden>
          Visual styling only, not a security setting. Presets combine fonts, weights, corner radii and gentle density
          changes. Friendly social adds purple and pink; Bank security uses neutral colors and raised, square buttons.
          Density can override spacing afterward. Default restores the theme styling and Default density.
        </span>
      </div>
    </>
  )
}

export function PlaygroundAppearanceControls() {
  const {density, setDensity, seriousness, setSeriousness, theme, setTheme} = useAppearance()
  return (
    <section className={classes.Controls} aria-label="Preview appearance" data-component="AppearancePlaygroundControls">
      <PlaygroundAppearanceDials
        density={density}
        seriousness={seriousness}
        onDensityChange={setDensity}
        onSeriousnessChange={setSeriousness}
      />
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

import {useCallback, useId, useMemo, useRef, useState} from 'react'
import type {CSSProperties} from 'react'
import {clsx} from 'clsx'
import {ChevronDownIcon, PaintbrushIcon, SearchIcon} from '@primer/octicons-react'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {PortalContext} from '../Portal'
import {useRegisteredPortalRoot} from '../internal/hooks/useRegisteredPortalRoot'
import Label from '../Label'
import TextInput from '../TextInput'
import {useTheme} from '../useTheme'
import {playgroundPalettes} from './AppearancePlayground.tokens'
import classes from './AppearancePlaygroundThemePicker.module.css'

interface ThemeChoice {
  id: string
  name: string
  palette?: (typeof playgroundPalettes)[number]
}

interface PalettePreviewStyle extends CSSProperties {
  [name: `--palette-${string}`]: string
}

interface PlaygroundThemePickerProps {
  className?: string
  value: string
  onChange: (theme: string) => void
}

const themes: readonly ThemeChoice[] = [
  {id: 'primer', name: 'Primer'},
  ...playgroundPalettes.map(palette => ({id: palette.id, name: palette.name, palette})),
]

const themeGroups = [
  {id: 'light', name: 'Light themes'},
  {id: 'dark', name: 'Dark themes'},
  {id: 'other-companies', name: 'Other companies'},
] as const

function PalettePreview({palette}: Pick<ThemeChoice, 'palette'>) {
  const style: PalettePreviewStyle | undefined = palette
    ? {
        '--palette-background': palette.background,
        '--palette-surface': palette.surface,
        '--palette-foreground': palette.foreground,
        '--palette-muted': palette.muted,
        '--palette-accent': palette.accent,
        '--palette-success': palette.success,
        '--palette-danger': palette.danger,
        '--palette-attention': palette.attention,
        '--palette-done': palette.done,
      }
    : undefined
  return (
    <span className={classes.Preview} style={style} data-preset={palette?.preset} aria-hidden="true">
      <span className={classes.PreviewSidebar}>
        <span className={classes.PreviewDots}>
          <span />
          <span />
          <span />
        </span>
        <span className={classes.PreviewNavigation}>
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className={classes.PreviewSelection}>
          <span />
          <span />
        </span>
        <span className={classes.PreviewSidebarFooter} />
      </span>
      <span className={classes.PreviewMain}>
        <span className={classes.PreviewHeader}>
          <span />
          <span />
          <span />
        </span>
        <span className={classes.PreviewRows}>
          {[0, 1, 2, 3].map(row => (
            <span className={classes.PreviewRow} key={row}>
              <span />
              <span />
            </span>
          ))}
        </span>
      </span>
      <span className={classes.PreviewSpectrum} />
    </span>
  )
}

export function PlaygroundThemePicker({className, value, onChange}: PlaygroundThemePickerProps) {
  const {colorScheme} = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const closePicker = useCallback(() => setIsOpen(false), [])
  const id = useId()
  const portalContext = useMemo(() => ({portalContainerName: `${id}-theme-picker`}), [id])
  const registerPortal = useRegisteredPortalRoot(portalContext.portalContainerName)
  const selected = themes.find(theme => theme.id === value)
  if (!selected) throw new Error(`Unknown playground theme: ${value}`)
  const filtered = themes.filter(theme => theme.name.toLowerCase().includes(query.trim().toLowerCase()))
  const primerGroup = colorScheme?.startsWith('dark') ? 'dark' : 'light'
  const groupedThemes = themeGroups
    .map(group => ({
      ...group,
      themes: filtered.filter(theme => (theme.palette?.group ?? theme.palette?.mode ?? primerGroup) === group.id),
    }))
    .filter(group => group.themes.length > 0)

  function renderCard(theme: ThemeChoice) {
    const active = theme.id === value
    return (
      <button
        key={theme.id}
        type="button"
        className={classes.ThemeCard}
        aria-label={`Use ${theme.name} theme`}
        aria-pressed={active}
        onClick={() => onChange(theme.id)}
      >
        <PalettePreview palette={theme.palette} />
        <span className={classes.CardFooter}>
          <span className={classes.CardName}>{theme.name}</span>
          {active && <Label className={classes.Active}>Active</Label>}
        </span>
      </button>
    )
  }

  return (
    <div className={clsx(classes.Control, className)} data-component="AppearancePlaygroundThemePicker">
      <label htmlFor={`${id}-theme`}>Theme</label>
      <Button
        ref={triggerRef}
        id={`${id}-theme`}
        leadingVisual={PaintbrushIcon}
        trailingVisual={ChevronDownIcon}
        aria-label={`Choose theme: ${selected.name}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          setQuery('')
          setIsOpen(true)
        }}
      >
        <span className={classes.TriggerName}>{selected.name}</span>
      </Button>
      <div className={classes.Portal} ref={registerPortal} />
      {isOpen && (
        <PortalContext.Provider value={portalContext}>
          <Dialog
            title="Themes"
            position={{narrow: 'right', regular: 'right'}}
            width="480px"
            height="large"
            className={classes.Dialog}
            initialFocusRef={searchRef}
            returnFocusRef={triggerRef}
            onClose={closePicker}
          >
            <div className={classes.Picker}>
              <div className={classes.PickerHeader}>
                <div>
                  <h2>Palettes</h2>
                  <p>Pick a sourced palette for the app.</p>
                </div>
                <TextInput
                  ref={searchRef}
                  type="search"
                  aria-label="Search palettes"
                  placeholder={`Search ${themes.length} palettes...`}
                  leadingVisual={SearchIcon}
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  className={classes.Search}
                />
              </div>
              <p className={classes.ResultCount} role="status">
                {filtered.length} {filtered.length === 1 ? 'palette' : 'palettes'}
              </p>
              {filtered.length > 0 ? (
                groupedThemes.map(group => (
                  <section key={group.id} className={classes.PaletteSection} aria-labelledby={`${id}-${group.id}`}>
                    <h3 id={`${id}-${group.id}`}>{group.name}</h3>
                    <div className={classes.PaletteGrid}>{group.themes.map(renderCard)}</div>
                  </section>
                ))
              ) : (
                <div className={classes.Empty}>
                  <h3>No palettes found</h3>
                  <p>Try a different theme name.</p>
                </div>
              )}
            </div>
          </Dialog>
        </PortalContext.Provider>
      )}
    </div>
  )
}

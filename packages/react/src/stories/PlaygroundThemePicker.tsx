import {useCallback, useId, useRef, useState} from 'react'
import type {CSSProperties} from 'react'
import {ChevronDownIcon, PaintbrushIcon, SearchIcon} from '@primer/octicons-react'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import Label from '../Label'
import TextInput from '../TextInput'
import {playgroundPalettes} from './PlaygroundAppearance.tokens'
import classes from './PlaygroundThemePicker.module.css'

interface ThemeChoice {
  id: string
  name: string
  palette?: (typeof playgroundPalettes)[number]
}

interface PalettePreviewStyle extends CSSProperties {
  [name: `--palette-${string}`]: string
}

interface PlaygroundThemePickerProps {
  value: string
  onChange: (theme: string) => void
}

const themes: readonly ThemeChoice[] = [
  {id: 'primer', name: 'Primer'},
  ...playgroundPalettes.map(palette => ({id: palette.id, name: palette.name, palette})),
]

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

export function PlaygroundThemePicker({value, onChange}: PlaygroundThemePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState([value])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const closePicker = useCallback(() => setIsOpen(false), [])
  const id = useId()
  const selected = themes.find(theme => theme.id === value)
  if (!selected) throw new Error(`Unknown playground theme: ${value}`)
  const source = selected.palette?.source
  const sourceUrl = source
    ? 'repository' in source
      ? `https://github.com/${source.repository}/blob/${source.revision}/${source.path.split('/').map(encodeURIComponent).join('/')}`
      : source.url
    : undefined
  const filtered = themes.filter(theme => theme.name.toLowerCase().includes(query.trim().toLowerCase()))
  const recentThemes = recent.flatMap(themeId => filtered.filter(theme => theme.id === themeId))

  function chooseTheme(theme: ThemeChoice) {
    onChange(theme.id)
    setRecent(previous => [theme.id, ...previous.filter(themeId => themeId !== theme.id)].slice(0, 3))
  }

  function renderCard(theme: ThemeChoice) {
    const active = theme.id === value
    return (
      <button
        key={theme.id}
        type="button"
        className={classes.ThemeCard}
        aria-label={`Use ${theme.name} theme`}
        aria-pressed={active}
        title={theme.id === 'primer' ? 'Primer follows the current Storybook theme' : theme.name}
        onClick={() => chooseTheme(theme)}
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
    <div className={classes.Control}>
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
        <span className={classes.TriggerName} title={selected.name}>
          {selected.name}
        </span>
      </Button>
      {isOpen && (
        <Dialog
          title="Themes"
          position={{narrow: 'right', regular: 'right'}}
          width="768px"
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
              <div className={classes.Source} aria-label="Active theme source">
                {source ? (
                  <>
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                      {'repository' in source
                        ? `${source.repository} @ ${source.revision.slice(0, 7)}`
                        : `${source.title} · ${source.retrievedAt}`}
                    </a>
                    <span>{source.license}</span>
                    {source.notes ? <span>{source.notes}</span> : null}
                  </>
                ) : (
                  <span>Primer inherits the current Storybook theme.</span>
                )}
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
            {recent.length > 1 && recentThemes.length > 0 && (
              <section className={classes.PaletteSection} aria-labelledby={`${id}-recent`}>
                <h3 id={`${id}-recent`}>Recent</h3>
                <div className={classes.PaletteGrid}>{recentThemes.map(renderCard)}</div>
              </section>
            )}
            {filtered.length > 0 ? (
              <section className={classes.PaletteSection} aria-labelledby={`${id}-all`}>
                <h3 id={`${id}-all`}>All palettes</h3>
                <div className={classes.PaletteGrid}>{filtered.map(renderCard)}</div>
              </section>
            ) : (
              <div className={classes.Empty}>
                <h3>No palettes found</h3>
                <p>Try a different theme name.</p>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  )
}

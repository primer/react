import {useId, useState, type ReactNode} from 'react'
import {CodeIcon, CopyIcon, GearIcon, ScreenFullIcon, ScreenNormalIcon, SyncIcon} from '@primer/octicons-react'
import {Button, IconButton} from '../../Button'
import BaseStyles from '../../BaseStyles'
import Checkbox from '../../Checkbox'
import CheckboxGroup from '../../CheckboxGroup'
import FormControl from '../../FormControl'
import Heading from '../../Heading'
import Label from '../../Label'
import {SegmentedControl} from '../../SegmentedControl'
import Select from '../../Select'
import Text from '../../Text'
import {ThemeProvider} from '../../ThemeProvider'
import {useTheme} from '../../useTheme'
import {appearanceStops, getAppearance} from './appearance'
import {getExample} from './example'
import {defaultConfig, presets, type PlaygroundConfig} from './model'
import {SelectPanelDemo, type SelectPanelDemoProps} from './SelectPanelDemo'
import classes from './SelectPanelPlayground.module.css'

export interface SelectPanelPlaygroundProps {
  renderPreview?: (props: SelectPanelDemoProps) => ReactNode
  skinSource?: string
}

const views = [
  {id: 'composition', label: 'Composition', icon: GearIcon},
  {id: 'code', label: 'Code', icon: CodeIcon},
] as const

const presentationOptions = [
  {value: 'anchored', label: 'Anchored'},
  {value: 'modal', label: 'Modal'},
  {value: 'inline', label: 'Inline'},
] as const

const previewStateOptions = [
  {value: 'ready', label: 'Ready'},
  {value: 'loading', label: 'Loading'},
  {value: 'empty', label: 'Empty'},
  {value: 'error', label: 'Error'},
] as const

export function SelectPanelPlayground({renderPreview, skinSource}: SelectPanelPlaygroundProps) {
  const id = useId()
  const {colorMode} = useTheme()
  const [config, setConfig] = useState(defaultConfig)
  const [presetId, setPresetId] = useState('repositories')
  const [view, setView] = useState<(typeof views)[number]['id']>('composition')
  const [expanded, setExpanded] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [mobile, setMobile] = useState(false)
  const [sourceTab, setSourceTab] = useState<'react' | 'css'>('react')
  const [copyStatus, setCopyStatus] = useState('')
  const appearance = getAppearance(config.appearance)
  const source = sourceTab === 'css' && skinSource !== undefined ? skinSource : getExample(config)

  function customize(changes: Partial<PlaygroundConfig>) {
    setConfig(current => ({...current, ...changes}))
    setPresetId('custom')
    setResetKey(current => current + 1)
    setCopyStatus('')
  }

  function changeAppearance(position: number) {
    setConfig(current => ({...current, appearance: position}))
    setCopyStatus('')
  }

  async function copySource() {
    try {
      await navigator.clipboard.writeText(source)
      setCopyStatus(sourceTab === 'react' ? 'React example copied.' : 'CSS copied.')
    } catch {
      setCopyStatus('Clipboard unavailable. Select and copy the code below instead.')
    }
  }

  const previewProps = {config, resetKey}

  return (
    <ThemeProvider colorMode={colorMode ?? 'night'}>
      <BaseStyles>
        <main className={classes.Page}>
          <header className={classes.Header}>
            <div className={classes.Identity}>
              <Heading as="h1" className={classes.PageTitle}>
                SelectPanel
              </Heading>
              <Text className={classes.Muted}>Playground</Text>
              <Label>Primer</Label>
            </div>
            <div className={classes.RecipePicker}>
              <FormControl>
                <FormControl.Label visuallyHidden>Recipe</FormControl.Label>
                <Select
                  block
                  value={presetId}
                  onChange={event => {
                    const candidate = presets.find(value => value.id === event.target.value)
                    if (!candidate) return
                    setConfig({...candidate.config, appearance: config.appearance, anatomy: config.anatomy})
                    setPresetId(candidate.id)
                    setResetKey(current => current + 1)
                    setCopyStatus('')
                  }}
                >
                  {presetId === 'custom' ? (
                    <Select.Option value="custom" disabled>
                      Custom composition
                    </Select.Option>
                  ) : null}
                  {presets.map(candidate => (
                    <Select.Option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormControl>
            </div>
          </header>

          <div className={classes.Workspace} data-expanded={expanded} data-view={view}>
            <div className={classes.ViewSwitcher} role="group" aria-label="Playground views" hidden={expanded}>
              {views.map(candidate => (
                <IconButton
                  key={candidate.id}
                  icon={candidate.icon}
                  aria-label={candidate.label}
                  aria-pressed={view === candidate.id}
                  aria-controls={`${id}-inspector`}
                  variant={view === candidate.id ? 'default' : 'invisible'}
                  tooltipDirection="e"
                  onClick={() => {
                    setView(candidate.id)
                    setCopyStatus('')
                  }}
                />
              ))}
            </div>

            <aside
              className={classes.Inspector}
              id={`${id}-inspector`}
              aria-labelledby={`${id}-inspector-title`}
              hidden={expanded}
            >
              <div className={classes.PanelHeader}>
                <Heading as="h2" id={`${id}-inspector-title`} className={classes.PanelTitle}>
                  {views.find(candidate => candidate.id === view)?.label}
                </Heading>
                <Label>{view === 'code' ? 'Read-only' : 'Live controls'}</Label>
              </div>

              {view === 'composition' ? (
                <div className={classes.Controls}>
                  <FormControl>
                    <FormControl.Label>Appearance</FormControl.Label>
                    <Select
                      block
                      value={String(config.appearance)}
                      onChange={event => changeAppearance(Number(event.target.value))}
                    >
                      {appearanceStops.map((stop, index) => (
                        <Select.Option key={stop.name} value={String(index)}>
                          {stop.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormControl>
                  <CheckboxGroup>
                    <CheckboxGroup.Label>Structure</CheckboxGroup.Label>
                    {(
                      [
                        ['search', 'Search input'],
                        ['descriptions', 'Descriptions'],
                        ['grouped', 'Grouped options'],
                        ['actions', 'Item secondary actions'],
                      ] as const
                    ).map(([key, label]) => (
                      <FormControl key={key}>
                        <Checkbox
                          value={key}
                          checked={config[key]}
                          onChange={event => customize({[key]: event.target.checked})}
                        />
                        <FormControl.Label>{label}</FormControl.Label>
                      </FormControl>
                    ))}
                    {config.actions ? (
                      <CheckboxGroup.Caption>Secondary actions belong to their listbox item.</CheckboxGroup.Caption>
                    ) : null}
                  </CheckboxGroup>
                  <section className={classes.ControlSection} aria-labelledby={`${id}-behavior`}>
                    <Heading as="h3" id={`${id}-behavior`} className={classes.SectionTitle}>
                      Behavior
                    </Heading>
                    <FormControl>
                      <Checkbox
                        checked={config.multiple}
                        onChange={event => customize({multiple: event.target.checked})}
                      />
                      <FormControl.Label>Multiple selection</FormControl.Label>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Apply changes</FormControl.Label>
                      <Select
                        block
                        value={config.commitMode}
                        onChange={event =>
                          customize({commitMode: event.target.value === 'submit' ? 'submit' : 'immediate'})
                        }
                      >
                        <Select.Option value="immediate">Immediately</Select.Option>
                        <Select.Option value="submit">Save / Cancel</Select.Option>
                      </Select>
                      <FormControl.Caption>Filtering and draft selection are application-owned.</FormControl.Caption>
                    </FormControl>
                  </section>
                  <section className={classes.ControlSection} aria-labelledby={`${id}-presentation`}>
                    <Heading as="h3" id={`${id}-presentation`} className={classes.SectionTitle}>
                      Presentation
                    </Heading>
                    <div className={classes.SegmentedField}>
                      <Text as="p" size="medium" weight="semibold" id={`${id}-container`}>
                        Container
                      </Text>
                      <SegmentedControl
                        fullWidth
                        size="small"
                        aria-labelledby={`${id}-container`}
                        onChange={index => customize({presentation: presentationOptions[index].value})}
                      >
                        {presentationOptions.map(option => (
                          <SegmentedControl.Button key={option.value} selected={config.presentation === option.value}>
                            {option.label}
                          </SegmentedControl.Button>
                        ))}
                      </SegmentedControl>
                    </div>
                    <div className={classes.SegmentedField}>
                      <Text as="p" size="medium" weight="semibold" id={`${id}-preview-state`}>
                        Preview state
                      </Text>
                      <SegmentedControl
                        fullWidth
                        size="small"
                        aria-labelledby={`${id}-preview-state`}
                        onChange={index => customize({previewState: previewStateOptions[index].value})}
                      >
                        {previewStateOptions.map(option => (
                          <SegmentedControl.Button key={option.value} selected={config.previewState === option.value}>
                            {option.label}
                          </SegmentedControl.Button>
                        ))}
                      </SegmentedControl>
                    </div>
                  </section>
                </div>
              ) : null}

              {view === 'code' ? (
                <div className={classes.Source}>
                  <div className={classes.SourceToolbar}>
                    <SegmentedControl
                      size="small"
                      aria-label="Example source"
                      onChange={index => {
                        setSourceTab(index === 0 ? 'react' : 'css')
                        setCopyStatus('')
                      }}
                    >
                      <SegmentedControl.Button selected={sourceTab === 'react'}>React</SegmentedControl.Button>
                      {skinSource !== undefined ? (
                        <SegmentedControl.Button selected={sourceTab === 'css'}>CSS</SegmentedControl.Button>
                      ) : null}
                    </SegmentedControl>
                    <Button size="small" leadingVisual={CopyIcon} onClick={copySource}>
                      Copy {sourceTab === 'react' ? 'example' : 'CSS'}
                    </Button>
                  </div>
                  <div className={classes.SourceDescription}>
                    <Text as="p" size="small" className={classes.Muted}>
                      Generated from the controls, not an editable code runner. Use the React example inside your Primer
                      theme provider and save the CSS as <code>SelectPanelDemo.module.css</code>.
                    </Text>
                    <Text as="p" size="small" role="status" className={classes.CopyStatus}>
                      {copyStatus}
                    </Text>
                  </div>
                  <pre
                    className={classes.Code}
                    role="region"
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Read-only source must support keyboard scrolling and selection.
                    tabIndex={0}
                    aria-label={sourceTab === 'react' ? 'React example' : 'Picker CSS'}
                  >
                    <code>{source}</code>
                  </pre>
                </div>
              ) : null}
            </aside>

            <section className={classes.Preview} aria-labelledby={`${id}-preview`}>
              <div className={classes.PreviewToolbar}>
                <Heading as="h2" id={`${id}-preview`} className={classes.PanelTitle}>
                  Preview
                </Heading>
                <div className={classes.ToolbarActions}>
                  <Button
                    className={classes.AnatomyToggle}
                    size="small"
                    leadingVisual={CodeIcon}
                    aria-pressed={config.anatomy}
                    onClick={() => setConfig(current => ({...current, anatomy: !current.anatomy}))}
                  >
                    Show anatomy
                  </Button>
                  <SegmentedControl
                    size="small"
                    aria-label="Preview viewport"
                    onChange={index => setMobile(index === 1)}
                  >
                    <SegmentedControl.Button selected={!mobile}>Desktop</SegmentedControl.Button>
                    <SegmentedControl.Button selected={mobile}>Mobile</SegmentedControl.Button>
                  </SegmentedControl>
                  <IconButton
                    size="small"
                    icon={SyncIcon}
                    aria-label="Reset preview"
                    onClick={() => setResetKey(current => current + 1)}
                  />
                  <IconButton
                    size="small"
                    icon={expanded ? ScreenNormalIcon : ScreenFullIcon}
                    aria-label={expanded ? 'Restore workspace' : 'Expand preview'}
                    aria-expanded={expanded}
                    onClick={() => setExpanded(current => !current)}
                  />
                </div>
              </div>
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The desktop preview can overflow horizontally; keyboard users need to scroll this named region. */}
              <div className={classes.PreviewCanvas} role="region" aria-label="Interactive preview canvas" tabIndex={0}>
                <div className={classes.PreviewViewport} data-mobile={mobile}>
                  {renderPreview ? renderPreview(previewProps) : <SelectPanelDemo {...previewProps} />}
                </div>
              </div>
              <div className={classes.PreviewStatus}>
                <Text size="small" weight="semibold">
                  {appearance.label}
                </Text>
                <Text size="small" className={classes.Muted}>
                  {mobile ? 'Mobile viewport' : 'Desktop viewport · 800px minimum'}
                </Text>
              </div>
              <Text as="p" size="small" className={classes.PreviewHint}>
                {config.anatomy ? 'Anatomy is on. Hover or focus a piece to see its API name and composition. ' : ''}
                {config.actions
                  ? ' Cmd/Ctrl+Shift+U opens repository details directly; closing details returns to the item.'
                  : ' List navigation wraps.'}
                {!mobile ? ' Scroll the canvas horizontally when space is limited, or expand the preview.' : ''}
              </Text>
            </section>
          </div>
        </main>
      </BaseStyles>
    </ThemeProvider>
  )
}

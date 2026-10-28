/// <reference types="vite/client" />

import {Component, Fragment, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {ComponentType, ErrorInfo, ReactNode} from 'react'
import {composeStory} from '@storybook/react-vite'
import type {Meta, ReactRenderer, StoryObj} from '@storybook/react-vite'
import {isExportStory} from 'storybook/internal/csf'
import type {StoryAnnotationsOrFn} from 'storybook/internal/types'
import {Button, IconButton} from '../Button'
import {
  ChevronDownIcon,
  FileDirectoryIcon,
  FileIcon,
  GitBranchIcon,
  IssueOpenedIcon,
  PlusIcon,
  SyncIcon,
} from '@primer/octicons-react'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import TextInput from '../TextInput'
import Select from '../Select'
import {
  PlaygroundAppearanceControls,
  PlaygroundAppearancePortals,
  PlaygroundAppearanceProvider,
  PlaygroundAppearanceSurface,
  usePlaygroundAppearanceScope,
} from './PlaygroundAppearance'
import * as sideNavStories from './deprecated/SideNav.dev.stories'
import * as visuallyHiddenStories from '../VisuallyHidden/VisuallyHidden.dev.stories'
import {collectUsedVariables} from './ComponentGallery.tokens'
import type {GalleryVariable, VariableScan} from './ComponentGallery.tokens'
import tokenCatalog from './ComponentGallery.catalog.json'
import componentDependencies from './ComponentGallery.dependencies.json'
import './ComponentGallery.base-colors.css'
import classes from './ComponentGallery.stories.module.css'

const catalogByProperty = new Map(
  Object.entries(tokenCatalog.properties).map(([property, tokens]) => [property, new Set(tokens)]),
)

const storyComponentDependencies: Readonly<Record<string, readonly string[]>> = componentDependencies

interface StoryModule {
  default: Meta
  [name: string]: unknown
}

const discoveredModules = import.meta.glob<StoryModule>(
  [
    '../**/*.stories.tsx',
    '!./ComponentGallery.stories.tsx',
    '!../**/*.dev.stories.tsx',
    '!../**/*.examples.stories.tsx',
    '!../**/*.responsive.stories.tsx',
    '!../**/*.performance.stories.tsx',
    '!../**/*.playground.stories.tsx',
    '!../**/internal/**',
    '!../hooks/**',
    '!../Dialog/**',
    '!../ConfirmationDialog/**',
    '!../deprecated/DialogV1/**',
    '!../Portal/**',
    '!../BaseStyles*',
  ],
  {eager: true},
)

const modules: Record<string, StoryModule> = {
  ...discoveredModules,
  '../SideNav.stories.tsx': sideNavStories,
  '../VisuallyHidden.stories.tsx': visuallyHiddenStories,
}

interface GalleryExample {
  name: string
  Story: ComponentType
  id: string
}

interface GalleryEntry {
  title: string
  examples: GalleryExample[]
}

function ContextExample({renderList}: {renderList?: (list: ReactNode) => ReactNode}) {
  const [selected, setSelected] = useState('')

  const list = (
    <ActionList>
      <ActionList.Item onSelect={() => setSelected('Project file or folder...')}>
        <ActionList.LeadingVisual>
          <FileDirectoryIcon />
        </ActionList.LeadingVisual>
        Project file or folder...
        <ActionList.TrailingVisual>@</ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item onSelect={() => setSelected('Issue or pull request...')}>
        <ActionList.LeadingVisual>
          <IssueOpenedIcon />
        </ActionList.LeadingVisual>
        Issue or pull request...
        <ActionList.TrailingVisual>#</ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item onSelect={() => setSelected('Session...')}>
        <ActionList.LeadingVisual>
          <GitBranchIcon />
        </ActionList.LeadingVisual>
        Session...
        <ActionList.TrailingVisual>&amp;</ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Divider />
      <ActionList.Item onSelect={() => setSelected('Files...')}>
        <ActionList.LeadingVisual>
          <FileIcon />
        </ActionList.LeadingVisual>
        Files...
      </ActionList.Item>
      <ActionList.Item onSelect={() => setSelected('Folder...')}>
        <ActionList.LeadingVisual>
          <FileDirectoryIcon />
        </ActionList.LeadingVisual>
        Folder...
      </ActionList.Item>
    </ActionList>
  )

  return (
    <div>
      {renderList ? renderList(list) : list}
      <p className={classes.Count} role="status">
        {selected ? `Selected: ${selected}` : 'Add context to your session'}
      </p>
    </div>
  )
}

function ContextMenuExample() {
  return (
    <ContextExample
      renderList={list => (
        <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton icon={PlusIcon} aria-label="Add context" />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="auto">{list}</ActionMenu.Overlay>
        </ActionMenu>
      )}
    />
  )
}

function isStory(value: unknown): value is StoryAnnotationsOrFn<ReactRenderer> {
  return typeof value === 'function' || (typeof value === 'object' && value !== null && !Array.isArray(value))
}

function examplesFor(stories: StoryModule): GalleryExample[] {
  const sourceOrder = stories.__namedExportsOrder
  const names =
    Array.isArray(sourceOrder) && sourceOrder.every(name => typeof name === 'string')
      ? sourceOrder
      : Object.keys(stories)
  return names.flatMap(name => {
    const value = stories[name]
    if (
      name === 'default' ||
      name.startsWith('__') ||
      /Dialog|Portal|BaseStyles/i.test(name) ||
      !isExportStory(name, stories.default) ||
      !isStory(value)
    )
      return []
    const Story = composeStory(value, stories.default, {initialGlobals: {colorScheme: 'light', featureFlags: {}}}, name)
    return [{name: Story.storyName, Story, id: Story.id}]
  })
}

const entries: GalleryEntry[] = Object.entries(modules)
  .filter(([path]) => /\/[^/.]+\.stories\.tsx$/.test(path))
  .flatMap(([path, stories]) => {
    const title = stories.default.title?.replace(/\/Dev$/, '')
    if (!title) return []
    if (!title.includes('Components/')) return []
    if (/Dialog|Portal|BaseStyles/i.test(title)) return []
    const examples = examplesFor(stories)
    if (examples.length === 0) return []
    const primary = examples.find(example => example.name === 'Default') ?? examples[0]
    const features = modules[path.replace('.stories.tsx', '.features.stories.tsx')]
    const variants = features
      ? examplesFor(features).slice(0, 2)
      : examples.filter(example => example !== primary && example.name !== 'Playground').slice(0, 2)
    return [
      {
        title,
        examples:
          title === 'Components/ActionMenu'
            ? [
                primary,
                {
                  name: 'Add context',
                  Story: ContextMenuExample,
                  id: 'design-tools-component-gallery--context-menu',
                },
                ...variants.slice(0, 1),
              ]
            : title === 'Components/ActionList'
              ? [
                  primary,
                  ...variants.slice(0, 1),
                  {
                    name: 'Add context',
                    Story: ContextExample,
                    id: 'design-tools-component-gallery--context-list',
                  },
                ]
              : [primary, ...variants],
      },
    ]
  })
  .sort((a, b) => a.title.localeCompare(b.title))

class ExampleBoundary extends Component<{children: ReactNode; storyId: string}, {error: string | null}> {
  state: {error: string | null} = {error: null}

  static getDerivedStateFromError(error: Error) {
    return {error: error.message}
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(`Component gallery story failed: ${this.props.storyId}`, error, info)
  }

  render() {
    return this.state.error ? (
      <p role="alert">
        This story requires its own canvas: {this.state.error}.{' '}
        <a href={`/?path=/story/${this.props.storyId}`} target="_blank" rel="noreferrer">
          Open original story
        </a>
      </p>
    ) : (
      this.props.children
    )
  }
}

interface VariableEditorProps {
  preview: React.RefObject<HTMLDivElement>
  selectedSection: string | null
  onClearSelection: () => void
}

function VariableEditor({preview, selectedSection, onClearSelection}: VariableEditorProps) {
  const appearanceScope = usePlaygroundAppearanceScope()
  const [scan, setScan] = useState<VariableScan>({variables: [], warnings: []})
  const [query, setQuery] = useState('')
  const [onlyChanged, setOnlyChanged] = useState(false)
  const [activeVariable, setActiveVariable] = useState<string | null>(null)
  const [customVariables, setCustomVariables] = useState<Record<string, boolean>>({})
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const overrideStyle = useRef<HTMLStyleElement | null>(null)
  const componentDefaults = useRef<HTMLSpanElement>(null)
  const scanWarnings = scan.warnings.join('\n')
  const selectedEntry = entries.find(entry => entry.title === selectedSection)
  const selectedScope = useMemo(() => {
    if (!selectedEntry) return null
    const scope = new Set<string>()
    for (const example of selectedEntry.examples) {
      const dependencies = storyComponentDependencies[example.id]
      if (!dependencies) throw new Error(`Missing component gallery dependency snapshot for story: ${example.id}`)
      for (const dependency of dependencies) scope.add(dependency)
    }
    return scope
  }, [selectedEntry])

  useEffect(() => {
    if (scanWarnings) console.warn(`Component gallery CSS variable inspection:\n${scanWarnings}`)
  }, [scanWarnings])

  const refreshVariables = useCallback(() => {
    if (!preview.current || !selectedSection || !selectedScope || !componentDefaults.current) return
    const root = preview.current.querySelector<HTMLElement>(`[data-gallery-section="${CSS.escape(selectedSection)}"]`)
    if (!root) return
    const sheet = overrideStyle.current?.sheet
    if (sheet) sheet.disabled = true
    try {
      setScan(collectUsedVariables(root, {scope: selectedScope, element: componentDefaults.current}))
    } finally {
      if (sheet) sheet.disabled = false
    }
  }, [preview, selectedSection, selectedScope])

  useEffect(() => {
    const style = document.createElement('style')
    style.setAttribute('data-gallery-overrides', 'true')
    document.head.append(style)
    const rule =
      '[data-component-gallery-preview], [data-component-gallery-preview] *, [data-gallery-preview-portals], [data-gallery-preview-portals] *, [data-gallery-variable-resolver] {}'
    style.sheet?.insertRule(rule)
    style.sheet?.insertRule(rule, 1)
    overrideStyle.current = style
    return () => {
      style.remove()
      overrideStyle.current = null
    }
  }, [])

  useEffect(() => {
    const style = overrideDeclarations(1)
    return () => {
      style.cssText = ''
    }
  }, [activeVariable, selectedSection])

  useEffect(() => {
    if (!selectedSection) return
    // CSSOM is external state; read it after the composed stories have mounted.

    refreshVariables()
    // Include portaled menus without observing the editor's own state changes.

    const observer = new MutationObserver(mutations => {
      if (mutations.every(mutation => mutation.target instanceof Element && mutation.target.closest('aside'))) return
      window.clearTimeout(timeout)
      timeout = window.setTimeout(refreshVariables, 250)
    })
    let timeout: number
    observer.observe(document.body, {childList: true, subtree: true})
    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [refreshVariables, selectedSection])

  function overrideDeclarations(index: number) {
    const rule = overrideStyle.current?.sheet?.cssRules[index]
    if (!(rule instanceof CSSStyleRule)) throw new Error('The gallery override stylesheet is unavailable.')
    return rule.style
  }

  function clearPreview() {
    overrideDeclarations(1).cssText = ''
  }

  function previewVariable(name: string, value: string) {
    clearPreview()
    overrideDeclarations(1).setProperty(name, value, 'important')
  }

  function applyOverrides(next: Record<string, string>) {
    clearPreview()
    const style = overrideDeclarations(0)
    for (const property of Array.from(style)) style.removeProperty(property)
    const invalid: string[] = []
    for (const [name, value] of Object.entries(next)) {
      style.setProperty(name, value, 'important')
      if (!style.getPropertyValue(name)) invalid.push(name)
    }
    setOverrides(next)
    setError(invalid.length ? `Invalid CSS value for ${invalid.join(', ')}. These overrides were not applied.` : '')
  }

  function updateVariable(name: string, value: string) {
    const next = {...overrides}
    if (value.trim()) next[name] = value
    else delete next[name]
    applyOverrides(next)
  }

  function expressionFor(variable: GalleryVariable) {
    const reference = /^var\(\s*(--[\w-]+)\s*(?:,[^()]*)?\)$/.exec(variable.expression)
    return overrides[variable.name] ?? (reference ? `var(${reference[1]})` : variable.expression)
  }

  function referencedVariable(variable: GalleryVariable) {
    return /^var\(\s*(--[\w-]+)\s*(?:,[\s\S]*)?\)$/.exec(expressionFor(variable))?.[1]
  }

  function tokenSuggestions(variable: GalleryVariable) {
    const groups = variable.properties.map(property =>
      catalogByProperty.get(
        property === 'background' && CSS.supports('background-color', resolvedValue(variable))
          ? 'background-color'
          : property,
      ),
    )
    const first = groups[0]
    if (!first) return []
    return Array.from(first).filter(name => name !== variable.name && groups.every(group => group?.has(name)))
  }

  function isChanged(variable: GalleryVariable) {
    const reference = referencedVariable(variable)
    return Object.hasOwn(overrides, variable.name) || (reference !== undefined && Object.hasOwn(overrides, reference))
  }

  function resetVariable(variable: GalleryVariable) {
    const next = {...overrides}
    const reference = referencedVariable(variable)
    delete next[variable.name]
    if (reference) delete next[reference]
    applyOverrides(next)
  }

  const computedValues = new Map<Element, CSSStyleDeclaration>()
  function resolvedValue(variable: GalleryVariable, name = variable.name) {
    if (!variable.element.isConnected && name === variable.name) return variable.value
    let style = computedValues.get(variable.element)
    if (!style) {
      style = window.getComputedStyle(variable.element)
      computedValues.set(variable.element, style)
    }
    return style.getPropertyValue(name).trim()
  }

  function displayValue(variable: GalleryVariable, name = variable.name) {
    const value = resolvedValue(variable, name)
    const rem = /^([+-]?(?:\d+\.?\d*|\.\d+))rem$/i.exec(value)
    if (!rem) return value
    const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
    return `${Number(rem[1]) * rootFontSize}px`
  }

  function renderTokenDescription(variable: GalleryVariable, name = variable.name) {
    const raw = resolvedValue(variable, name)
    const pixels = displayValue(variable, name)
    return (
      <span className={classes.TokenDescription}>
        {raw !== pixels ? `${raw} / ${pixels}` : raw || 'Not set in current theme'}
        {CSS.supports('color', raw) && (
          <span className={classes.Swatch} style={{backgroundColor: raw}} aria-hidden="true" />
        )}
      </span>
    )
  }

  function renderTokenSuggestion(variable: GalleryVariable, name: string) {
    return (
      <ActionList.Item
        key={name}
        onMouseEnter={() => previewVariable(variable.name, `var(${name})`)}
        onFocus={() => previewVariable(variable.name, `var(${name})`)}
        onSelect={() => {
          updateVariable(variable.name, `var(${name})`)
          setActiveVariable(null)
          setCustomVariables(previous => ({...previous, [variable.name]: false}))
        }}
      >
        {name}
        <ActionList.Description variant="inline">{renderTokenDescription(variable, name)}</ActionList.Description>
      </ActionList.Item>
    )
  }

  function variableGroup(variable: GalleryVariable) {
    if (
      variable.properties.some(property =>
        /^(?:font(?:-|$)|line-height$|letter-spacing$|word-spacing$|text-(?:align|decoration|indent|transform)(?:-|$)|white-space$)/.test(
          property,
        ),
      )
    ) {
      return 'Typography'
    }
    if (
      /margin|padding|gap/i.test(variable.name) ||
      (variable.properties.length > 0 &&
        variable.properties.every(property => /^(?:(?:margin|padding)(?:-|$)|(?:row-|column-)?gap$)/.test(property)))
    ) {
      return 'Spacing'
    }
    if (
      /color/i.test(variable.name) ||
      variable.properties.some(property => /(?:^|-)color$|^(?:background|fill|stroke)$/.test(property))
    ) {
      return 'Colors'
    }
    return 'Rest'
  }

  function variableTarget(variable: GalleryVariable) {
    const target = variable.name.replace(/^--\w+--/, '').split('-')[0]
    const property = target.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    if (CSS.supports(property, 'initial') || /^(?:fgColor|bgColor|iconColor|size)$/.test(target)) return 'General'
    const title = target.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  const variables = selectedScope
    ? scan.variables.filter(
        variable =>
          selectedScope.has(/^--([A-Z]\w*)--/.exec(variable.name)?.[1] ?? '') &&
          `${variable.name} ${variableTarget(variable)} ${expressionFor(variable)} ${resolvedValue(variable)} ${displayValue(variable)}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (!onlyChanged || isChanged(variable)),
      )
    : []
  const components = selectedScope
    ? Array.from(selectedScope, component => {
        const scopedVariables = variables.filter(variable => variable.name.startsWith(`--${component}--`))
        return {
          name: component,
          groups: ['Typography', 'Spacing', 'Colors', 'Rest']
            .map(title => {
              const targets = new Map<string, GalleryVariable[]>()
              for (const variable of scopedVariables.filter(value => variableGroup(value) === title)) {
                const target = variableTarget(variable)
                const entries = targets.get(target) ?? []
                entries.push(variable)
                targets.set(target, entries)
              }
              return {
                title,
                targets: Array.from(targets, ([target, values]) => ({title: target, variables: values})).sort((a, b) =>
                  a.title === 'General' ? -1 : b.title === 'General' ? 1 : a.title.localeCompare(b.title),
                ),
              }
            })
            .filter(group => group.targets.length > 0),
        }
      }).filter(component => component.groups.length > 0)
    : []

  return (
    <aside className={classes.Editor} aria-label="CSS variable editor">
      <span ref={componentDefaults} {...appearanceScope} data-gallery-variable-resolver="" hidden aria-hidden="true" />
      <div className={classes.EditorHeader}>
        <h2>CSS variables</h2>
        <div className={classes.SelectionScope}>
          <p aria-live="polite">
            {selectedSection
              ? `Showing variables for ${selectedSection}`
              : 'Select a component to inspect its variables.'}
          </p>
          {selectedSection && (
            <Button size="small" onClick={onClearSelection}>
              Clear selection
            </Button>
          )}
        </div>
        <TextInput
          aria-label="Search CSS variables"
          placeholder="Search variables or values"
          value={query}
          onChange={event => setQuery(event.target.value)}
          block
        />
        <label className={classes.ChangedFilter}>
          <input type="checkbox" checked={onlyChanged} onChange={event => setOnlyChanged(event.target.checked)} />
          Changed only ({Object.keys(overrides).length})
        </label>
        {error && <p role="alert">{error}</p>}
      </div>
      <div className={classes.Variables}>
        {components.map(component => (
          <section
            className={classes.ComponentVariables}
            key={component.name}
            aria-label={`${component.name} component variables`}
          >
            <details>
              <summary>
                <h3>{component.name}</h3>
                <ChevronDownIcon className={classes.DisclosureIcon} aria-hidden="true" />
              </summary>
              {component.groups.map(group => (
                <section
                  className={classes.VariableGroup}
                  key={group.title}
                  aria-label={`${component.name} ${group.title} variables`}
                >
                  <details>
                    <summary>
                      <h4>{group.title}</h4>
                      <ChevronDownIcon className={classes.DisclosureIcon} aria-hidden="true" />
                    </summary>
                    {group.targets.map(target => {
                      const rows = target.variables.map(variable => {
                        const isCustom = customVariables[variable.name] ?? false
                        const suggestions = tokenSuggestions(variable)
                        const baseColors = CSS.supports('color', resolvedValue(variable)) ? tokenCatalog.baseColors : []
                        return (
                          <div className={classes.Variable} key={variable.name}>
                            <div className={classes.VariableHeading}>
                              <label
                                htmlFor={isCustom ? `gallery-${variable.name}` : `gallery-expression-${variable.name}`}
                              >
                                <code>{variable.name}</code>
                              </label>
                              {isChanged(variable) && (
                                <IconButton
                                  size="small"
                                  variant="invisible"
                                  icon={SyncIcon}
                                  aria-label={`Reset ${variable.name}`}
                                  onClick={() => resetVariable(variable)}
                                />
                              )}
                            </div>
                            <div className={classes.ExpressionField}>
                              <ActionMenu
                                open={activeVariable === variable.name}
                                onOpenChange={open => {
                                  clearPreview()
                                  setActiveVariable(open ? variable.name : null)
                                }}
                              >
                                <ActionMenu.Button
                                  id={`gallery-expression-${variable.name}`}
                                  aria-label={`Expression for ${variable.name}`}
                                  title={
                                    suggestions.length || baseColors.length
                                      ? `Used by ${variable.properties.join(', ')}`
                                      : `No catalog suggestions for ${variable.properties.join(', ') || 'unidentified CSS properties'}; choose Custom to enter a value.`
                                  }
                                  size="small"
                                  variant="invisible"
                                  alignContent="start"
                                  className={classes.ExpressionButton}
                                >
                                  <span className={classes.TokenName}>
                                    {isCustom
                                      ? 'Custom'
                                      : (referencedVariable(variable) ??
                                        (expressionFor(variable) || 'Choose a variable'))}
                                  </span>
                                </ActionMenu.Button>
                                <ActionMenu.Overlay
                                  width="auto"
                                  className={classes.TokenMenu}
                                  onMouseLeave={clearPreview}
                                  onBlur={event => {
                                    if (!event.currentTarget.contains(event.relatedTarget)) clearPreview()
                                  }}
                                >
                                  <ActionList selectionVariant="single">
                                    <ActionList.Item
                                      selected={!isCustom}
                                      onMouseEnter={clearPreview}
                                      onFocus={clearPreview}
                                      onSelect={() => {
                                        clearPreview()
                                        setActiveVariable(null)
                                        setCustomVariables(previous => ({...previous, [variable.name]: false}))
                                      }}
                                    >
                                      {referencedVariable(variable) ?? expressionFor(variable)}
                                      <ActionList.Description variant="inline">
                                        {renderTokenDescription(variable)}
                                      </ActionList.Description>
                                    </ActionList.Item>
                                    {activeVariable === variable.name && (
                                      <>
                                        {suggestions
                                          .filter(name => `var(${name})` !== expressionFor(variable))
                                          .map(name => renderTokenSuggestion(variable, name))}
                                        {baseColors.length > 0 && (
                                          <>
                                            <ActionList.Divider />
                                            <ActionList.Group>
                                              <ActionList.GroupHeading>Base colours</ActionList.GroupHeading>
                                              {baseColors
                                                .filter(name => `var(${name})` !== expressionFor(variable))
                                                .map(name => renderTokenSuggestion(variable, name))}
                                            </ActionList.Group>
                                          </>
                                        )}
                                      </>
                                    )}
                                    <ActionList.Divider />
                                    <ActionList.Item
                                      selected={isCustom}
                                      onMouseEnter={clearPreview}
                                      onFocus={clearPreview}
                                      onSelect={() => {
                                        clearPreview()
                                        setActiveVariable(null)
                                        setCustomVariables(previous => ({...previous, [variable.name]: true}))
                                      }}
                                    >
                                      Custom
                                    </ActionList.Item>
                                  </ActionList>
                                </ActionMenu.Overlay>
                              </ActionMenu>
                            </div>
                            {isCustom && (
                              <div className={classes.VariableValue}>
                                {CSS.supports('color', resolvedValue(variable)) && (
                                  <span
                                    className={classes.Swatch}
                                    style={{backgroundColor: resolvedValue(variable)}}
                                    aria-hidden="true"
                                  />
                                )}
                                <div className={classes.ValueField}>
                                  <label htmlFor={`gallery-${variable.name}`}>Custom value</label>
                                  <input
                                    id={`gallery-${variable.name}`}
                                    aria-label={`Value for ${variable.name}`}
                                    value={displayValue(variable)}
                                    title="Standalone rem values are displayed in px using the current root font size."
                                    placeholder="Not set in current theme"
                                    onChange={event =>
                                      updateVariable(referencedVariable(variable) ?? variable.name, event.target.value)
                                    }
                                    spellCheck={false}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })
                      if (target.title === 'General' || group.targets.length === 1) {
                        return <Fragment key={target.title}>{rows}</Fragment>
                      }
                      return (
                        <section
                          className={classes.VariableTarget}
                          key={target.title}
                          aria-label={`${component.name} ${group.title} ${target.title} variables`}
                        >
                          <details>
                            <summary>
                              <h5>{target.title}</h5>
                              <ChevronDownIcon className={classes.DisclosureIcon} aria-hidden="true" />
                            </summary>
                            {rows}
                          </details>
                        </section>
                      )
                    })}
                  </details>
                </section>
              ))}
            </details>
          </section>
        ))}
        {selectedSection && !variables.length && <p>No matching component variables.</p>}
      </div>
    </aside>
  )
}

function ComponentGalleryContent() {
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)
  const preview = useRef<HTMLDivElement>(null)
  const filtered = useMemo(
    () =>
      entries.filter(
        entry =>
          entry.title.toLowerCase().includes(query.toLowerCase()) &&
          (scope === 'all' ||
            (scope === 'stable' ? entry.title.startsWith('Components/') : entry.title.startsWith(`${scope}/`))),
      ),
    [query, scope],
  )
  const selectedSection = filtered.some(entry => entry.title === selected) ? selected : null

  return (
    <div className={classes.Page}>
      <PlaygroundAppearancePortals data-gallery-preview-portals="" />
      <main className={classes.Main}>
        <header className={classes.Header}>
          <h1>Primitive playground</h1>
          <PlaygroundAppearanceControls />
          <div className={classes.Filters}>
            <TextInput
              aria-label="Search components"
              placeholder="Search components"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
            <Select aria-label="Component scope" value={scope} onChange={event => setScope(event.target.value)}>
              <Select.Option value="all">All components</Select.Option>
              <Select.Option value="stable">Stable</Select.Option>
              <Select.Option value="Experimental">Experimental</Select.Option>
              <Select.Option value="Deprecated">Deprecated</Select.Option>
              <Select.Option value="Private">Private</Select.Option>
            </Select>
            <span aria-live="polite">
              {filtered.length} / {entries.length} components
            </span>
          </div>
        </header>
        <PlaygroundAppearanceSurface className={classes.Grid} ref={preview} data-component-gallery-preview="">
          {filtered.map(entry => (
            <section
              className={classes.Card}
              key={entry.title}
              aria-label={entry.title}
              data-gallery-section={entry.title}
              data-selected={entry.title === selectedSection}
              onClickCapture={() => setSelected(entry.title)}
              onFocusCapture={() => setSelected(entry.title)}
            >
              <header className={classes.CardHeader}>
                <h2>
                  <button
                    className={classes.CardSelect}
                    type="button"
                    aria-label={`Inspect CSS variables for ${entry.title}`}
                    aria-pressed={entry.title === selectedSection}
                    onClick={() => setSelected(entry.title)}
                  >
                    <span>{entry.title.split('/').at(-1)}</span>
                  </button>
                </h2>
              </header>
              {entry.examples.map(({Story, name, id}) => (
                <div className={classes.Example} key={id}>
                  <a className={classes.ExampleLabel} href={`/?path=/story/${id}`} target="_blank" rel="noreferrer">
                    {name}
                  </a>
                  <div className={classes.Canvas}>
                    <ExampleBoundary storyId={id}>
                      <Story />
                    </ExampleBoundary>
                  </div>
                </div>
              ))}
            </section>
          ))}
          {!filtered.length && <p>No components match your search.</p>}
        </PlaygroundAppearanceSurface>
      </main>
      <VariableEditor preview={preview} selectedSection={selectedSection} onClearSelection={() => setSelected(null)} />
    </div>
  )
}

function ComponentGallery() {
  return (
    <PlaygroundAppearanceProvider>
      <ComponentGalleryContent />
    </PlaygroundAppearanceProvider>
  )
}

const meta = {
  title: 'Design tools/Component gallery',
  component: ComponentGallery,
  parameters: {
    layout: 'fullscreen',
    controls: {disable: true},
    docs: {
      description: {
        component:
          'The theme picker is a compact two-column side sheet with a transparent backdrop so theme changes remain visible on the preview. ' +
          'Navigation is an exception to the density tier clamp: tabs match the overflow button height, and the extra-large container grows to include the shifted top and bottom spacing. ' +
          'Shopify Polaris, Linear (Dark) and Stripe presets additionally adapt public brand token values through scoped CSS variables only. PlaygroundAppearance.brands.json records source versions, per-role color provenance and adaptation notes. Shopify uses the older MIT-licensed Polaris Tokens 4.0.0 baseline. Linear combines public dark app surfaces and typography with its website palette; it is not an official app theme. Linear and Stripe name their published font families with local fallbacks; no brand fonts or component stylesheets are downloaded. Stripe combines public website tokens with Appearance API guidance, not an official Dashboard theme. Brand presets preserve the density-controlled spacing scale. ' +
          'Dependencies are snapshotted per rendered story ID, following only its export, referenced helpers, args, applicable metadata, and runtime component source files. A namespace is included only when its CSS is reached; shared CSS and context-only imports do not expand into an entire component graph. Type-only imports, unused exports, play functions, documentation-only subcomponents, and unrelated companion stories do not contribute. The inspector unions only the examples actually rendered in the selected card, including the separate Add context list/menu examples. Story IDs distinguish current, experimental, and deprecated components even when their display names match. ' +
          'The density slider updates the preview live across five steps: Very compact, Compact, Default, Spacious, and Very spacious. These shift the base spacing scale and control size, padding, and gap tiers by -2, -1, 0, 1, and 2 steps, clamping the smallest and largest tiers. Functional stack padding and gap tokens follow the shifted base scale, including the vertical padding of issue rows. ActionList icons retain a 16px minimum and their visual slots retain a 20px minimum so compact spacing does not shrink pictograms or misalign them with text. Default restores the original primitives. ' +
          'Theme presets snapshot actual color values from the supplied VS Code theme repositories, with commit-pinned source files and original color-role provenance in PlaygroundAppearance.sources.json. Inherited definitions are resolved; duplicate no-italics palettes are omitted. These are independent Primer adaptations, not imported VS Code theme implementations. Tints and contrast-safe text are derived locally. Windows 95 additionally applies its original palette, square corners, raised/sunken primitive shadows, and the bundled OFL-licensed W95FA font. Primer inherits the Storybook theme. Appearance changes apply to preview components, their portals, and the hidden variable resolver; the editor and appearance controls remain unchanged. Manual variable overrides take precedence over appearance presets. ' +
          'The theme button opens a searchable palette side sheet with miniature previews and an Active indicator. Palettes appear once, ordered as Light themes, Dark themes, and Other companies, which includes brand presets, Glass UI, and Windows/Mac-inspired presets. Primer follows the current Storybook color mode. Search hides empty groups. Selecting a card applies it immediately while keeping the picker open. ' +
          'ActionList and ActionMenu share an Add context example with icons, shortcuts, and a divider. ' +
          'Variables are grouped into Typography, Spacing, Colors, and Rest; empty groups are hidden. ' +
          'Categories with multiple targets are further grouped by the target prefix in the component alias, such as Item, Description, or Leading visual. Component-wide properties and categories with only one target show variables directly, without an extra target group. All disclosure groups start folded. ' +
          'Colour menus append all 98 Primer base colours after the property-filtered functional suggestions. Base palette definitions are snapshotted from @primer/primitives for all 14 colour themes and preserve the original theme selectors; only base colours are loaded, without replacing functional tokens. Base colours are naturally sorted by family and shade, with resolved values and swatches, and are omitted from non-colour menus. Hovering or focusing a suggested token previews it across the component grid without changing the saved selection. Selecting commits it; leaving or dismissing the menu restores the saved value. The sidebar and its menus are unaffected by overrides. ' +
          'A live grid composed from component default stories and up to two feature stories, excluding dialogs, Portal, BaseStyles, and ThemeProvider. Select a component card or focus its heading to inspect that section and its owned menus. Component-scoped variables from the selected component and its transitive dependencies are grouped by component and then category. Nested primitive dependencies remain hidden. Clear selection hides all variables and stops scanning and mutation observation. Variable selection is shown by default. Choose Custom inside a variable menu to reveal its custom value input; choose a token to return to variable selection. Entering custom mode does not change existing overrides. Variable ActionMenus use a local snapshot of the Primer primitives VS Code extension property-to-token catalog, with each token’s raw value shown in an inline description and a color swatch when applicable. Standalone rem values show both units as rem / px using the current root font size; custom value fields show px. Functional suggestions must be recommended for every CSS property consuming the variable, including through aliases. Color-valued variables consumed by background use the background-color catalog; image and gradient values do not. Menus without matching catalog suggestions still offer Custom and the current value. Selecting a variable updates the var() reference without a fallback. Editing a simple var() reference value updates its referenced token; editing a literal or compound expression value replaces that token with a literal. Search and Changed only further filter the current scope. Overrides apply across the preview grid and its portals, survive section changes, and are removed when leaving the story. Changed tokens show a reset icon beside their name. Scan warnings are logged to the browser console. Use the Storybook theme toolbar to compare color schemes. Play functions are not run automatically.',
      },
    },
  },
} satisfies Meta<typeof ComponentGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ContextMenu: Story = {
  render: () => <ContextMenuExample />,
}

export const ContextList: Story = {
  render: () => <ContextExample />,
}

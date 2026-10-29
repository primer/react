import {Component, useCallback, useEffect, useRef, useState} from 'react'
import type {PropsWithChildren} from 'react'
import {createRoot} from 'react-dom/client'
import {XIcon} from '@primer/octicons-react'
import BaseStyles from '../../packages/react/src/BaseStyles'
import {ThemeProvider} from '../../packages/react/src/next/ThemeProvider'
import {Button, IconButton} from '../../packages/react/src/Button'
import Checkbox from '../../packages/react/src/Checkbox'
import TextInput from '../../packages/react/src/TextInput'
import {PlaygroundThemePickerContent} from '../../packages/react/src/AppearancePlayground/AppearancePlaygroundThemePicker'
import {PlaygroundAppearanceDials} from '../../packages/react/src/AppearancePlayground/AppearancePlayground'
import {playgroundSeriousnessProfiles} from '../../packages/react/src/AppearancePlayground/AppearancePlayground.tokens'
import {appearanceVariables, defaultState, validateOverride} from './shared.js'
import catalog from './catalog.json'
import './panel.source.css'

type PreviewState = ReturnType<typeof defaultState>

interface PageInfo {
  origin: string
  documentId: string
  hostMode: 'light' | 'dark'
  primerDetected: boolean
  truncated: boolean
  variables: {name: string; value: string}[]
  state: PreviewState
}

interface Replies {
  inspect: PageInfo
  reset: PageInfo
  apply: {appliedVariables: number}
  'close-controls': {closed: boolean}
}

interface ExtensionEvent<Args extends unknown[]> {
  addListener: (listener: (...args: Args) => void) => void
  removeListener: (listener: (...args: Args) => void) => void
}

declare const chrome: {
  runtime: {
    sendMessage: <T extends keyof Replies>(message: {
      type: T
      tabId: number
      documentId?: string
      state?: PreviewState
    }) => Promise<{ok: true; result: Replies[T]} | {ok: false; error: string; code?: string} | undefined>
  }
  storage: {
    onChanged: ExtensionEvent<[{activation?: {newValue?: {tabId: number}}}, string]>
  }
  tabs: {
    onUpdated: ExtensionEvent<[number, {status?: string}]>
    onRemoved: ExtensionEvent<[number]>
  }
}

const requestedTabId = new URLSearchParams(location.search).get('tabId')
const tabId = requestedTabId === null ? NaN : Number(requestedTabId)

async function request<T extends keyof Replies>(
  type: T,
  documentId?: string,
  state?: PreviewState,
): Promise<Replies[T]> {
  const reply = await chrome.runtime.sendMessage({type, tabId, documentId, state})
  if (!reply?.ok) {
    throw Object.assign(new Error(reply?.error || 'The extension worker did not respond.'), {code: reply?.code})
  }
  return reply.result
}

function message(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function Panel() {
  const [state, setState] = useState(defaultState)
  const [page, setPage] = useState<PageInfo | null>(null)
  const [revision, setRevision] = useState(0)
  const [site, setSite] = useState('Connecting...')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [variableSearch, setVariableSearch] = useState('')
  const [variableName, setVariableName] = useState('')
  const [variableValue, setVariableValue] = useState('')
  const generation = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const connect = useCallback(async () => {
    const version = ++generation.current
    clearTimeout(timer.current)
    setPage(null)
    setRevision(0)
    setError('')
    setNotice('Connecting...')
    try {
      if (!Number.isSafeInteger(tabId) || tabId < 0) {
        throw new Error('Open the controls using the extension icon on a website tab.')
      }
      const result = await request('inspect')
      if (version !== generation.current) return
      setPage(result)
      setState(result.state)
      setSite(result.origin)
      setNotice(
        result.primerDetected
          ? `${result.variables.length}${result.truncated ? '+' : ''} CSS variables found. ${result.state.enabled ? 'Preview enabled.' : 'Enable preview to try changes.'}`
          : 'Primer tokens were not detected. Preview may have little or no effect.',
      )
    } catch (failure) {
      if (version !== generation.current) return
      const unsupported = failure instanceof Error && 'code' in failure && failure.code === 'unsupported-page'
      setSite(unsupported ? 'Unsupported page' : 'Not connected')
      setNotice(unsupported ? message(failure) : 'Changes were not confirmed. Reconnect or reset before continuing.')
      if (!unsupported) setError(message(failure))
    }
  }, [])

  useEffect(() => {
    void connect()
    const activated = (changes: {activation?: {newValue?: {tabId: number}}}, area: string) => {
      if (area === 'session' && changes.activation?.newValue?.tabId === tabId) void connect()
    }
    const updated = (id: number, change: {status?: string}) => {
      if (id !== tabId) return
      if (change.status === 'loading') {
        ++generation.current
        clearTimeout(timer.current)
        setPage(null)
        setNotice('Page is navigating. Preview does not carry over to a new document.')
      }
      if (change.status === 'complete') void connect()
    }
    const removed = (id: number) => {
      if (id !== tabId) return
      ++generation.current
      clearTimeout(timer.current)
      setPage(null)
      setSite('Tab closed')
      setNotice('Open another website and click the extension icon.')
    }
    chrome.storage.onChanged.addListener(activated)
    chrome.tabs.onUpdated.addListener(updated)
    chrome.tabs.onRemoved.addListener(removed)
    return () => {
      ++generation.current
      clearTimeout(timer.current)
      chrome.storage.onChanged.removeListener(activated)
      chrome.tabs.onUpdated.removeListener(updated)
      chrome.tabs.onRemoved.removeListener(removed)
    }
  }, [connect])

  useEffect(() => {
    if (!page || revision === 0) return
    let active = true
    const version = generation.current
    timer.current = setTimeout(async () => {
      setError('')
      setNotice('Applying...')
      try {
        const result = await request('apply', page.documentId, state)
        if (!active || version !== generation.current) return
        setNotice(
          state.enabled
            ? `Preview enabled: ${result.appliedVariables} variable overrides.`
            : 'Preview paused. Website styles are restored.',
        )
      } catch (failure) {
        if (active && version === generation.current) {
          setError(message(failure))
          setNotice('Changes were not confirmed. Reconnect or reset before continuing.')
        }
      }
    }, 120)
    return () => {
      active = false
      clearTimeout(timer.current)
    }
  }, [page, revision, state])

  function change(update: (current: PreviewState) => PreviewState) {
    setState(update)
    setRevision(current => current + 1)
  }

  const close = useCallback(async () => {
    clearTimeout(timer.current)
    try {
      if (page && revision > 0) await request('apply', page.documentId, state)
      await request('close-controls', page?.documentId)
    } catch (failure) {
      setError(message(failure))
    }
  }, [page, revision, state])

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') void close()
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [close])

  async function reset() {
    const version = ++generation.current
    clearTimeout(timer.current)
    setRevision(0)
    setError('')
    try {
      const result = await request('reset', page?.documentId)
      if (version !== generation.current) return
      setPage(result)
      setState(result.state)
      setNotice('Preview removed. Original page styles restored.')
    } catch (failure) {
      if (version === generation.current) setError(message(failure))
    }
  }

  const variables =
    page?.variables.filter(variable => variable.name.toLowerCase().includes(variableSearch.trim().toLowerCase())) ?? []

  return (
    <aside className="sidebar" aria-label="Appearance controls">
      <header className="sidebar-header">
        <h1>Themes</h1>
        <IconButton
          id="close-controls"
          icon={XIcon}
          variant="invisible"
          aria-label="Close appearance controls"
          onClick={() => void close()}
        />
      </header>
      <div className="sidebar-body">
        <p id="site">{site}</p>
        <p id="error" role="alert" hidden={!error}>
          {error}
        </p>
        <p id="notice" role="status">
          {notice}
        </p>
        <form id="controls" onSubmit={event => event.preventDefault()}>
          <fieldset id="settings" disabled={!page}>
            <PlaygroundThemePickerContent
              value={state.theme}
              onChange={theme => change(current => ({...current, theme}))}
            >
              <div className="sidebar-settings">
                <label className="toggle">
                  <Checkbox
                    id="enabled"
                    checked={state.enabled}
                    onChange={event => change(current => ({...current, enabled: event.target.checked}))}
                  />
                  Preview on this tab
                </label>
                <div className="dials" role="group" aria-label="Density and Seriousness">
                  <PlaygroundAppearanceDials
                    density={state.density}
                    seriousness={state.seriousness}
                    onDensityChange={density => change(current => ({...current, density}))}
                    onSeriousnessChange={seriousness => {
                      const profile = playgroundSeriousnessProfiles.find(value => value.id === seriousness)
                      if (!profile) throw new Error(`Unknown seriousness: ${seriousness}`)
                      change(current => ({...current, seriousness, density: profile.density}))
                    }}
                  />
                </div>
                <details>
                  <summary>
                    CSS-variable overrides <span id="override-count">({Object.keys(state.overrides).length})</span>
                  </summary>
                  <div className="variable-fields">
                    <label htmlFor="variable-search">Find a page variable</label>
                    <TextInput
                      id="variable-search"
                      type="search"
                      value={variableSearch}
                      onChange={event => setVariableSearch(event.target.value)}
                    />
                    <label htmlFor="variables">Variables found on this page</label>
                    <select
                      id="variables"
                      size={6}
                      onChange={event => {
                        const variable = page?.variables.find(value => value.name === event.target.value)
                        if (!variable || !page) {
                          setError('That variable is no longer available. Refresh variables and try again.')
                          return
                        }
                        setVariableName(variable.name)
                        setVariableValue(
                          appearanceVariables(state, catalog, page.hostMode).variables[variable.name] ?? variable.value,
                        )
                      }}
                    >
                      {variables.map(variable => (
                        <option key={variable.name} value={variable.name}>
                          {variable.name}: {variable.value}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="variable-name">Variable name</label>
                    <TextInput
                      id="variable-name"
                      value={variableName}
                      spellCheck={false}
                      onChange={event => setVariableName(event.target.value)}
                      placeholder="--borderRadius-medium"
                    />
                    <label htmlFor="variable-value">CSS value</label>
                    <TextInput
                      id="variable-value"
                      value={variableValue}
                      spellCheck={false}
                      onChange={event => setVariableValue(event.target.value)}
                      placeholder="12px or var(--base-size-8)"
                    />
                    <div className="buttons">
                      <Button
                        id="set-variable"
                        onClick={() => {
                          try {
                            const name = variableName.trim()
                            const value = variableValue.trim()
                            validateOverride(name, value)
                            change(current => ({...current, overrides: {...current.overrides, [name]: value}}))
                          } catch (failure) {
                            setError(message(failure))
                          }
                        }}
                      >
                        Set override
                      </Button>
                      <Button
                        id="remove-variable"
                        onClick={() =>
                          change(current => {
                            const overrides = {...current.overrides}
                            delete overrides[variableName.trim()]
                            return {...current, overrides}
                          })
                        }
                      >
                        Remove override
                      </Button>
                    </div>
                    <ul id="overrides">
                      {Object.entries(state.overrides).map(([name, value]) => (
                        <li key={name}>
                          {name}: {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </div>
            </PlaygroundThemePickerContent>
          </fieldset>
        </form>
      </div>
      <footer className="sidebar-footer">
        <Button id="reset" disabled={!page} onClick={() => void reset()}>
          Reset page
        </Button>
        <Button id="refresh" onClick={() => void connect()}>
          Refresh variables
        </Button>
      </footer>
    </aside>
  )
}

class PanelErrorBoundary extends Component<PropsWithChildren, {error: Error | null}> {
  state: {error: Error | null} = {error: null}
  static getDerivedStateFromError(error: Error) {
    return {error}
  }
  render() {
    return this.state.error ? (
      <p role="alert">
        Could not render appearance controls: {this.state.error.message}. Reload the extension to retry.
      </p>
    ) : (
      this.props.children
    )
  }
}

const root = document.getElementById('root')
if (!root) throw new Error('The appearance controls root is missing.')
createRoot(root).render(
  <PanelErrorBoundary>
    <ThemeProvider colorMode="day" dayScheme="light">
      <BaseStyles>
        <Panel />
      </BaseStyles>
    </ThemeProvider>
  </PanelErrorBoundary>,
)

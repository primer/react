import React from 'react'
import {createPortal} from 'react-dom'
import {createRoot} from 'react-dom/client'
import {BaseStyles} from '../src/BaseStyles'
import {Breadcrumbs} from '../src/components/Breadcrumbs'

interface CommandContextValue {
  handlers: React.RefObject<Map<string, () => void>>
  emptySuggestionsVersion: number
  portalTarget: HTMLElement
}

const CommandContext = React.createContext<CommandContextValue | null>(null)

export function RepositoryPicker() {
  const context = React.useContext(CommandContext)
  if (!context) throw new Error('RepositoryPicker requires CommandContext')
  const {handlers, emptySuggestionsVersion, portalTarget} = context
  const id = React.useId()
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const observedVersion = query === '' ? emptySuggestionsVersion : -1

  React.useEffect(() => {
    const registered = handlers.current
    registered.set(id, () => setOpen(true))
    document.documentElement.setAttribute('data-command-count', String(registered.size))
    document.documentElement.setAttribute('data-last-command', id)
    document.documentElement.setAttribute('data-last-command-version', String(observedVersion))
    return () => {
      registered.delete(id)
      document.documentElement.setAttribute('data-command-count', String(registered.size))
    }
  }, [handlers, id, observedVersion])

  const close = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <>
      <Breadcrumbs.Item href="#repository">repository</Breadcrumbs.Item>
      <button
        ref={buttonRef}
        aria-label="Choose repository"
        aria-expanded={open}
        data-instance={id}
        onClick={() => setOpen(previous => !previous)}
        type="button"
      >
        <span aria-hidden="true">Choose</span>
      </button>
      {open
        ? createPortal(
            <div aria-label="Repository picker" role="dialog">
              <input
                aria-label="Search repositories"
                autoFocus
                value={query}
                onChange={event => setQuery(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Escape') close()
                }}
              />
            </div>,
            portalTarget,
          )
        : null}
    </>
  )
}

export function Example({ancestorPicker, portalTarget}: {ancestorPicker: boolean; portalTarget: HTMLElement}) {
  const handlers = React.useRef(new Map<string, () => void>())
  const [emptySuggestionsVersion, setEmptySuggestionsVersion] = React.useState(0)

  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'r') {
        event.preventDefault()
        Array.from(handlers.current.values()).at(-1)?.()
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  const picker = <RepositoryPicker key="picker" />
  const link = (
    <Breadcrumbs.Item key="link" href="#owner">
      Owner
    </Breadcrumbs.Item>
  )

  return (
    <CommandContext.Provider value={{handlers, emptySuggestionsVersion, portalTarget}}>
      <BaseStyles>
        <div style={{width: 240}}>
          <Breadcrumbs overflow="menu">{ancestorPicker ? [picker, link] : [link, picker]}</Breadcrumbs>
        </div>
        <button type="button" onClick={() => setEmptySuggestionsVersion(version => version + 1)}>
          Resolve older suggestions
        </button>
        <output data-testid="suggestions-version">{emptySuggestionsVersion}</output>
      </BaseStyles>
    </CommandContext.Provider>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Expected #root for the breadcrumb shortcut fixture')
  const ancestorPicker = new URLSearchParams(window.location.search).has('ancestor')
  createRoot(root).render(<Example ancestorPicker={ancestorPicker} portalTarget={document.body} />)
}

mountExample()

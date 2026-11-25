import {Fragment, useCallback, useEffect, useRef, useState} from 'react'
import type {ReactNode} from 'react'
import {ThemeProvider} from '../../ThemeProvider'
import {useTheme} from '../../useTheme'
import theme from '../../theme'
import {PortalContext, registerPortalRoot} from '../../Portal'
import BaseStyles from '../../BaseStyles'
import {Button} from '../../Button'
import {defaultConfig, isPlaygroundConfig} from './model'
import type {PlaygroundConfig} from './model'
import {getStorybookPreviewUrl, SELECT_PANEL_PLAYGROUND_STORY_ID} from './previewUrl'

export const SELECT_PANEL_PLAYGROUND_UPDATE = '@primer/react/select-panel-playground:update'
export const SELECT_PANEL_PLAYGROUND_READY = '@primer/react/select-panel-playground:ready'
export const SELECT_PANEL_PLAYGROUND_TIMEOUT = 15_000
export interface IsolatedPreviewProps<Config> {
  config: Config
  resetKey: number
}

export type StorybookPreviewProps = IsolatedPreviewProps<PlaygroundConfig>

export interface PreviewDefinition<Config> {
  storyId: string
  portalName: string
  initialConfig: Config
  isConfig: (value: unknown) => value is Config
  presentationOnly?: boolean
  title?: string
}

const playgroundDefinition: PreviewDefinition<PlaygroundConfig> = {
  storyId: SELECT_PANEL_PLAYGROUND_STORY_ID,
  portalName: 'select-panel-playground-preview',
  initialConfig: defaultConfig,
  isConfig: isPlaygroundConfig,
}

interface PreviewMessage<Config> extends IsolatedPreviewProps<Config> {
  type: typeof SELECT_PANEL_PLAYGROUND_UPDATE | typeof SELECT_PANEL_PLAYGROUND_READY
  colorScheme: string
}

interface IsolatedPreviewSurfaceProps<Config> {
  definition: PreviewDefinition<Config>
  renderPreview: (props: IsolatedPreviewProps<Config>) => ReactNode
}

function isPreviewState<Config>(
  value: unknown,
  definition: PreviewDefinition<Config>,
): value is IsolatedPreviewProps<Config> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'config' in value &&
    definition.isConfig(value.config) &&
    'resetKey' in value &&
    typeof value.resetKey === 'number' &&
    Number.isSafeInteger(value.resetKey) &&
    value.resetKey >= 0
  )
}

function isPreviewMessage<Config>(
  value: unknown,
  type: PreviewMessage<Config>['type'],
  definition: PreviewDefinition<Config>,
): value is PreviewMessage<Config> {
  return (
    isPreviewState(value, definition) &&
    'type' in value &&
    value.type === type &&
    'colorScheme' in value &&
    typeof value.colorScheme === 'string' &&
    Object.hasOwn(theme.colorSchemes, value.colorScheme)
  )
}

function sendConfig<Config>(
  frame: HTMLIFrameElement,
  props: IsolatedPreviewProps<Config> & {colorScheme: string},
  origin: string,
  definition: PreviewDefinition<Config>,
) {
  const message = {type: SELECT_PANEL_PLAYGROUND_UPDATE, ...props}
  if (isPreviewMessage(message, SELECT_PANEL_PLAYGROUND_UPDATE, definition)) {
    frame.contentWindow?.postMessage(message, origin)
  }
}

export function StorybookPreview(props: StorybookPreviewProps) {
  return <IsolatedPreview {...props} definition={playgroundDefinition} />
}

export function IsolatedPreview<Config>({
  config,
  resetKey,
  definition,
  onReady,
}: IsolatedPreviewProps<Config> & {definition: PreviewDefinition<Config>; onReady?: () => void}) {
  const {resolvedColorScheme = 'light'} = useTheme()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const latestProps = useRef({config, resetKey, colorScheme: resolvedColorScheme})
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    latestProps.current = {config, resetKey, colorScheme: resolvedColorScheme}
    if (frameRef.current) {
      sendConfig(frameRef.current, latestProps.current, window.location.origin, definition)
    }
  }, [config, resetKey, resolvedColorScheme, definition])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const origin = window.location.origin
    const timer = window.setTimeout(() => setStatus('error'), SELECT_PANEL_PLAYGROUND_TIMEOUT)

    function onMessage(event: MessageEvent<unknown>) {
      if (
        event.origin !== origin ||
        !frame?.contentWindow ||
        event.source !== frame.contentWindow ||
        !isPreviewMessage(event.data, SELECT_PANEL_PLAYGROUND_READY, definition)
      ) {
        return
      }
      window.clearTimeout(timer)
      setStatus('ready')
      onReady?.()
      sendConfig(frame, latestProps.current, origin, definition)
    }

    function onLoad() {
      if (frame) sendConfig(frame, latestProps.current, origin, definition)
    }

    function onError() {
      window.clearTimeout(timer)
      setStatus('error')
    }

    window.addEventListener('message', onMessage)
    frame.inert = definition.presentationOnly ?? false
    frame.addEventListener('load', onLoad)
    frame.addEventListener('error', onError)
    // Only mounting and an explicit retry navigate. Configuration updates stay in place.
    frame.src = getStorybookPreviewUrl(window.location.href, definition.storyId)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('message', onMessage)
      frame.removeEventListener('load', onLoad)
      frame.removeEventListener('error', onError)
    }
  }, [attempt, definition, onReady])

  return (
    <div style={{position: 'relative', width: '100%', height: 'var(--select-panel-playground-preview-height, 660px)'}}>
      {/* eslint-disable-next-line @eslint-react/dom/no-missing-iframe-sandbox -- Trusted Storybook code needs scripts and same-origin messaging; allowing both would negate a sandbox. */}
      <iframe
        key={attempt}
        ref={frameRef}
        title={definition.title ?? 'Interactive SelectPanel preview'}
        tabIndex={definition.presentationOnly ? -1 : undefined}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 0,
          visibility: status === 'ready' ? 'visible' : 'hidden',
        }}
      />
      {status !== 'ready' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeContent: 'center',
            textAlign: 'center',
            gap: 12,
          }}
        >
          {status === 'loading' ? (
            <p role="status">Loading interactive preview…</p>
          ) : (
            <>
              <p role="alert">The interactive preview could not load.</p>
              <Button
                onClick={() => {
                  setStatus('loading')
                  setAttempt(previous => previous + 1)
                }}
              >
                Retry preview
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function StorybookPreviewSurface({
  renderPreview,
}: Omit<IsolatedPreviewSurfaceProps<PlaygroundConfig>, 'definition'>) {
  return <IsolatedPreviewSurface definition={playgroundDefinition} renderPreview={renderPreview} />
}

export function IsolatedPreviewSurface<Config>({renderPreview, definition}: IsolatedPreviewSurfaceProps<Config>) {
  const {resolvedColorScheme = 'light'} = useTheme()
  const [props, setProps] = useState<IsolatedPreviewProps<Config> & {colorScheme?: string}>({
    config: definition.initialConfig,
    resetKey: 0,
  })
  const [portalReady, setPortalReady] = useState(false)
  const registerPreviewPortal = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) {
        element.inert = definition.presentationOnly ?? false
        registerPortalRoot(element, definition.portalName)
        setPortalReady(true)
      }
    },
    [definition.portalName, definition.presentationOnly],
  )

  useEffect(() => {
    const origin = window.location.origin
    const parent = window.parent

    function onMessage(event: MessageEvent<unknown>) {
      if (
        parent === window ||
        event.origin !== origin ||
        event.source !== parent ||
        !isPreviewMessage(event.data, SELECT_PANEL_PLAYGROUND_UPDATE, definition)
      ) {
        return
      }
      setProps({config: event.data.config, resetKey: event.data.resetKey, colorScheme: event.data.colorScheme})
    }

    window.addEventListener('message', onMessage)
    if (parent !== window) {
      parent.postMessage(
        {
          type: SELECT_PANEL_PLAYGROUND_READY,
          config: definition.initialConfig,
          resetKey: 0,
          colorScheme: resolvedColorScheme,
        },
        origin,
      )
    }
    return () => window.removeEventListener('message', onMessage)
  }, [resolvedColorScheme, definition])

  return (
    <ThemeProvider dayScheme={props.colorScheme} nightScheme={props.colorScheme}>
      <BaseStyles>
        <div ref={registerPreviewPortal} style={{position: 'absolute', top: 0, left: 0, width: '100%'}} />
        {portalReady ? (
          <PortalContext.Provider value={{portalContainerName: definition.portalName}}>
            <Fragment key={props.resetKey}>{renderPreview(props)}</Fragment>
          </PortalContext.Provider>
        ) : null}
      </BaseStyles>
    </ThemeProvider>
  )
}

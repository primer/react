import {act, cleanup, render, screen} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Portal} from '../../Portal/Portal'
import {
  SELECT_PANEL_PLAYGROUND_READY,
  SELECT_PANEL_PLAYGROUND_UPDATE,
  IsolatedPreview,
  IsolatedPreviewSurface,
} from './StorybookPreview'
import {isShowcaseConfig, SHOWCASE_DURATION} from './showcase'
import {getStorybookPreviewUrl} from './previewUrl'

const showcaseDefinition = {
  storyId: 'components-selectpanel-showcase--preview-surface',
  portalName: 'select-panel-showcase-test',
  initialConfig: {elapsedMs: 0},
  isConfig: isShowcaseConfig,
  presentationOnly: true,
}

const readyMessage = {
  type: SELECT_PANEL_PLAYGROUND_READY,
  config: showcaseDefinition.initialConfig,
  resetKey: 0,
  colorScheme: 'light',
}
const updateMessage = {...readyMessage, type: SELECT_PANEL_PLAYGROUND_UPDATE}

function dispatchMessage(data: unknown, source: MessageEventSource | null, origin = window.location.origin) {
  act(() => {
    window.dispatchEvent(new MessageEvent('message', {data, source, origin}))
  })
}

function getFrame() {
  return screen.getByTitle<HTMLIFrameElement>('Interactive SelectPanel preview')
}

beforeEach(() => {
  // Transport tests use the blank same-origin frame, without fetching another Storybook.
  vi.spyOn(HTMLIFrameElement.prototype, 'src', 'set').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('isolated showcase transport', () => {
  it('accepts a sibling showcase route without changing the default playground route', () => {
    const url = new URL(getStorybookPreviewUrl('https://example.com/iframe.html', showcaseDefinition.storyId))
    expect(url.searchParams.get('id')).toBe(showcaseDefinition.storyId)
  })

  it('validates the custom timeline state, makes the frame inert and updates without navigating', () => {
    const onReady = vi.fn()
    const srcSetter = vi.spyOn(HTMLIFrameElement.prototype, 'src', 'set')
    const {rerender} = render(
      <IsolatedPreview definition={showcaseDefinition} config={{elapsedMs: 20_000}} resetKey={0} onReady={onReady} />,
    )
    const frame = getFrame()
    const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage').mockImplementation(() => {})
    expect(frame.inert).toBe(true)
    dispatchMessage({...readyMessage, config: {elapsedMs: SHOWCASE_DURATION + 1}}, frame.contentWindow)
    expect(onReady).not.toHaveBeenCalled()
    dispatchMessage({...readyMessage, config: {elapsedMs: 0}}, frame.contentWindow)
    expect(onReady).toHaveBeenCalledOnce()
    expect(postMessage).toHaveBeenLastCalledWith(
      {...updateMessage, config: {elapsedMs: 20_000}},
      window.location.origin,
    )
    rerender(
      <IsolatedPreview definition={showcaseDefinition} config={{elapsedMs: 21_500}} resetKey={0} onReady={onReady} />,
    )
    expect(postMessage).toHaveBeenLastCalledWith(
      {...updateMessage, config: {elapsedMs: 21_500}},
      window.location.origin,
    )
    expect(getFrame()).toBe(frame)
    expect(srcSetter).toHaveBeenCalledOnce()
  })

  it('accepts only validated showcase updates from its parent', () => {
    render(
      <IsolatedPreviewSurface
        definition={showcaseDefinition}
        renderPreview={({config}) => (
          <>
            <output aria-label="Film time">{config.elapsedMs}</output>
            <Portal>
              <button type="button">Film-only action</button>
            </Portal>
          </>
        )}
      />,
    )
    expect(screen.getByText('Film-only action').closest('[inert]')).toHaveProperty('inert', true)
    dispatchMessage({...updateMessage, config: {elapsedMs: 24_500}}, window.parent)
    expect(screen.getByLabelText('Film time')).toHaveTextContent('24500')
    dispatchMessage({...updateMessage, config: {elapsedMs: SHOWCASE_DURATION + 1}}, window.parent)
    dispatchMessage({...updateMessage, config: {elapsedMs: 0}}, window.parent, 'https://other.example')
    expect(screen.getByLabelText('Film time')).toHaveTextContent('24500')
  })
})

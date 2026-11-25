import {act, cleanup, fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {ThemeProvider} from '../../ThemeProvider'
import {useTheme} from '../../useTheme'
import BaseStyles from '../../BaseStyles'
import {Portal} from '../../Portal/Portal'
import {defaultConfig} from './model'
import {
  SELECT_PANEL_PLAYGROUND_READY,
  SELECT_PANEL_PLAYGROUND_TIMEOUT,
  SELECT_PANEL_PLAYGROUND_UPDATE,
  StorybookPreview,
  StorybookPreviewSurface,
} from './StorybookPreview'
import type {StorybookPreviewProps} from './StorybookPreview'
import {getStorybookPreviewUrl} from './previewUrl'

function Demo({config, resetKey}: StorybookPreviewProps) {
  const {resolvedColorScheme} = useTheme()
  return (
    <div>
      <input aria-label="Search repositories" />
      <output aria-label="Appearance">{config.appearance}</output>
      <output aria-label="Reset count">{resetKey}</output>
      <output aria-label="Theme">{resolvedColorScheme}</output>
    </div>
  )
}

function dispatchMessage(data: unknown, source: MessageEventSource | null, origin = window.location.origin) {
  act(() => {
    window.dispatchEvent(new MessageEvent('message', {data, source, origin}))
  })
}

function getFrame() {
  return screen.getByTitle<HTMLIFrameElement>('Interactive SelectPanel preview')
}

const readyMessage = {type: SELECT_PANEL_PLAYGROUND_READY, config: defaultConfig, resetKey: 0, colorScheme: 'light'}
const updateMessage = {
  type: SELECT_PANEL_PLAYGROUND_UPDATE,
  config: {...defaultConfig, appearance: 2},
  resetKey: 0,
  colorScheme: 'light',
}

const invalidStates = [
  null,
  {},
  {config: null, resetKey: 0},
  {config: {...defaultConfig, appearance: 9}, resetKey: 0},
  {config: {...defaultConfig, search: 'true'}, resetKey: 0},
  {config: defaultConfig, resetKey: -1},
  {config: defaultConfig, resetKey: 0.5},
  {config: defaultConfig, resetKey: '1'},
  {config: defaultConfig, resetKey: Number.POSITIVE_INFINITY},
  {config: defaultConfig, resetKey: 0, colorScheme: 'unknown'},
  {config: defaultConfig, resetKey: 0, colorScheme: 'constructor'},
  {config: defaultConfig, resetKey: 0, colorScheme: null},
]

beforeEach(() => {
  // Transport tests use the blank same-origin frame, without fetching another Storybook.
  vi.spyOn(HTMLIFrameElement.prototype, 'src', 'set').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('Storybook preview URL', () => {
  it.each([
    'https://example.com/iframe.html?id=another-story',
    'https://example.com/index.html?path=/story/another-story',
    'https://example.com/?path=/story/another-story',
    'https://example.com/components/storybook/iframe.html?id=another-story#hash',
    'https://example.com/components/storybook/',
  ])('resolves a sibling iframe for %s', baseUrl => {
    const url = new URL(getStorybookPreviewUrl(baseUrl))
    expect(url.origin).toBe(new URL(baseUrl).origin)
    expect(url.pathname).toBe(new URL('iframe.html', baseUrl).pathname)
    expect(url.searchParams.get('id')).toBe('components-selectpanel-playground--preview-surface')
    expect(url.searchParams.get('viewMode')).toBe('story')
    expect(url.searchParams.has('path')).toBe(false)
    expect(url.hash).toBe('')
  })
})

describe('Storybook preview sender', () => {
  it('fills a workspace-provided height without navigating or replacing the frame', () => {
    const srcSetter = vi.spyOn(HTMLIFrameElement.prototype, 'src', 'set')
    const {container} = render(<StorybookPreview config={defaultConfig} resetKey={0} />)
    container.style.height = '440px'
    container.style.setProperty('--select-panel-playground-preview-height', '100%')
    const frame = getFrame()
    expect(frame.getBoundingClientRect().height).toBe(440)

    container.style.height = '600px'
    expect(getFrame()).toBe(frame)
    expect(frame.getBoundingClientRect().height).toBe(600)
    expect(srcSetter).toHaveBeenCalledTimes(1)
  })

  it('sends the latest configuration on load, ready, and updates without navigating', () => {
    const srcSetter = vi.spyOn(HTMLIFrameElement.prototype, 'src', 'set')
    const {rerender} = render(<StorybookPreview config={defaultConfig} resetKey={0} />)
    const frame = getFrame()
    const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage').mockImplementation(() => {})

    fireEvent.load(frame)
    expect(postMessage).toHaveBeenLastCalledWith(
      {type: SELECT_PANEL_PLAYGROUND_UPDATE, config: defaultConfig, resetKey: 0, colorScheme: 'light'},
      window.location.origin,
    )
    dispatchMessage(readyMessage, frame.contentWindow)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(frame).toBeVisible()

    const config = {...defaultConfig, appearance: 3}
    rerender(<StorybookPreview config={config} resetKey={0} />)
    expect(postMessage).toHaveBeenLastCalledWith(
      {type: SELECT_PANEL_PLAYGROUND_UPDATE, config, resetKey: 0, colorScheme: 'light'},
      window.location.origin,
    )
    rerender(<StorybookPreview config={config} resetKey={1} />)
    expect(postMessage).toHaveBeenLastCalledWith(
      {type: SELECT_PANEL_PLAYGROUND_UPDATE, config, resetKey: 1, colorScheme: 'light'},
      window.location.origin,
    )
    expect(getFrame()).toBe(frame)
    expect(srcSetter).toHaveBeenCalledTimes(1)
  })

  it('forwards theme changes without navigating or resetting the preview', () => {
    const srcSetter = vi.spyOn(HTMLIFrameElement.prototype, 'src', 'set')
    const {rerender} = render(
      <ThemeProvider dayScheme="light">
        <StorybookPreview config={defaultConfig} resetKey={0} />
      </ThemeProvider>,
    )
    const frame = getFrame()
    const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage').mockImplementation(() => {})
    rerender(
      <ThemeProvider dayScheme="dark_dimmed">
        <StorybookPreview config={defaultConfig} resetKey={0} />
      </ThemeProvider>,
    )
    expect(postMessage).toHaveBeenLastCalledWith(
      {type: SELECT_PANEL_PLAYGROUND_UPDATE, config: defaultConfig, resetKey: 0, colorScheme: 'dark_dimmed'},
      window.location.origin,
    )
    expect(getFrame()).toBe(frame)
    expect(srcSetter).toHaveBeenCalledTimes(1)
  })

  it('rejects ready messages from another origin, another window, or the wrong protocol', () => {
    render(<StorybookPreview config={defaultConfig} resetKey={0} />)
    const frame = getFrame()
    const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage').mockImplementation(() => {})

    dispatchMessage(readyMessage, frame.contentWindow, 'https://other.example')
    dispatchMessage(readyMessage, window)
    dispatchMessage(readyMessage, null)
    dispatchMessage(updateMessage, frame.contentWindow)

    expect(postMessage).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('Loading interactive preview')
  })

  it.each(invalidStates)('rejects a malformed ready message: %j', state => {
    render(<StorybookPreview config={defaultConfig} resetKey={0} />)
    const frame = getFrame()
    const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage').mockImplementation(() => {})

    dispatchMessage({type: SELECT_PANEL_PLAYGROUND_READY, colorScheme: 'light', ...state}, frame.contentWindow)

    expect(postMessage).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('does not transmit invalid outgoing configuration or reset keys', () => {
    const {rerender} = render(<StorybookPreview config={defaultConfig} resetKey={0} />)
    const frame = getFrame()
    const postMessage = vi.spyOn(frame.contentWindow!, 'postMessage').mockImplementation(() => {})

    rerender(<StorybookPreview config={{...defaultConfig, appearance: 99}} resetKey={0} />)
    fireEvent.load(frame)
    rerender(<StorybookPreview config={defaultConfig} resetKey={-1} />)
    dispatchMessage(readyMessage, frame.contentWindow)

    expect(postMessage).not.toHaveBeenCalled()
  })

  it('shows an explicit timeout and retries with a new frame and handshake', () => {
    vi.useFakeTimers()
    render(<StorybookPreview config={defaultConfig} resetKey={0} />)
    const firstFrame = getFrame()
    const firstSource = firstFrame.contentWindow

    act(() => vi.advanceTimersByTime(SELECT_PANEL_PLAYGROUND_TIMEOUT))
    expect(screen.getByRole('alert')).toHaveTextContent('could not load')
    fireEvent.click(screen.getByRole('button', {name: 'Retry preview'}))
    const retryFrame = getFrame()
    expect(retryFrame).not.toBe(firstFrame)
    expect(screen.getByRole('status')).toBeInTheDocument()

    dispatchMessage(readyMessage, firstSource)
    expect(screen.getByRole('status')).toBeInTheDocument()
    dispatchMessage(readyMessage, retryFrame.contentWindow)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(SELECT_PANEL_PLAYGROUND_TIMEOUT))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a frame load error immediately', () => {
    render(<StorybookPreview config={defaultConfig} resetKey={0} />)
    fireEvent.error(getFrame())
    expect(screen.getByRole('alert')).toHaveTextContent('could not load')
    expect(screen.getByRole('button', {name: 'Retry preview'})).toBeInTheDocument()
  })

  it('removes its listeners and timeout on unmount', () => {
    vi.useFakeTimers()
    const {unmount} = render(<StorybookPreview config={defaultConfig} resetKey={0} />)
    const frame = getFrame()
    const source = frame.contentWindow
    const postMessage = vi.spyOn(source!, 'postMessage').mockImplementation(() => {})
    unmount()

    dispatchMessage(readyMessage, source)
    fireEvent.load(frame)
    expect(postMessage).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('Storybook preview receiver', () => {
  it('renders valid defaults and sets up its listener before announcing readiness', () => {
    const postMessage = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: updateMessage,
          source: window.parent,
          origin: window.location.origin,
        }),
      )
    })
    render(<StorybookPreviewSurface renderPreview={props => <Demo {...props} />} />)

    expect(postMessage).toHaveBeenCalledWith(readyMessage, window.location.origin)
    expect(screen.getByLabelText('Appearance')).toHaveTextContent('2')
  })

  it('renders the default configuration without any parent update', () => {
    render(<StorybookPreviewSurface renderPreview={props => <Demo {...props} />} />)
    expect(screen.getByLabelText('Appearance')).toHaveTextContent(`${defaultConfig.appearance}`)
    expect(screen.getByLabelText('Reset count')).toHaveTextContent('0')
  })

  it('themes portaled content independently of the Storybook host', () => {
    render(
      <ThemeProvider dayScheme="light">
        <BaseStyles>
          <StorybookPreviewSurface
            renderPreview={() => (
              <Portal>
                <span>Portaled preview</span>
              </Portal>
            )}
          />
        </BaseStyles>
      </ThemeProvider>,
    )
    const content = screen.getByText('Portaled preview')
    const lightColor = getComputedStyle(content).color

    dispatchMessage({...updateMessage, colorScheme: 'dark_dimmed'}, window.parent)

    expect(screen.getByText('Portaled preview')).toBe(content)
    expect(content.closest('[data-color-mode]')).toHaveAttribute('data-dark-theme', 'dark_dimmed')
    expect(getComputedStyle(content).color).not.toBe(lightColor)
  })

  it('ignores updates from another origin, another window, or the wrong protocol', () => {
    render(<StorybookPreviewSurface renderPreview={props => <Demo {...props} />} />)

    dispatchMessage(updateMessage, window.parent, 'https://other.example')
    dispatchMessage(updateMessage, null)
    dispatchMessage(updateMessage, window)
    dispatchMessage({...updateMessage, type: SELECT_PANEL_PLAYGROUND_READY}, window.parent)

    expect(screen.getByLabelText('Appearance')).toHaveTextContent('0')
  })

  it.each(invalidStates)('rejects a malformed configuration message: %j', state => {
    render(<StorybookPreviewSurface renderPreview={props => <Demo {...props} />} />)
    dispatchMessage({type: SELECT_PANEL_PLAYGROUND_UPDATE, colorScheme: 'light', ...state}, window.parent)
    expect(screen.getByLabelText('Appearance')).toHaveTextContent('0')
    expect(screen.getByLabelText('Reset count')).toHaveTextContent('0')
  })

  it('preserves input, focus, and selection on appearance updates; only resetKey remounts', async () => {
    const user = userEvent.setup()
    render(<StorybookPreviewSurface renderPreview={props => <Demo {...props} />} />)
    const input = screen.getByRole<HTMLInputElement>('textbox', {name: 'Search repositories'})
    await user.type(input, 'copilot')
    input.setSelectionRange(1, 4)

    dispatchMessage(updateMessage, window.parent)

    expect(screen.getByRole('textbox', {name: 'Search repositories'})).toBe(input)
    expect(input).toHaveValue('copilot')
    expect(input).toHaveFocus()
    expect(input.selectionStart).toBe(1)
    expect(input.selectionEnd).toBe(4)
    expect(screen.getByLabelText('Appearance')).toHaveTextContent('2')

    dispatchMessage({...updateMessage, colorScheme: 'dark_dimmed'}, window.parent)
    expect(screen.getByLabelText('Theme')).toHaveTextContent('dark_dimmed')
    expect(screen.getByRole('textbox', {name: 'Search repositories'})).toBe(input)
    expect(input).toHaveValue('copilot')
    expect(input).toHaveFocus()
    expect(input.selectionStart).toBe(1)
    expect(input.selectionEnd).toBe(4)

    dispatchMessage({...updateMessage, resetKey: 1}, window.parent)
    expect(screen.getByRole('textbox', {name: 'Search repositories'})).not.toBe(input)
    expect(screen.getByRole('textbox', {name: 'Search repositories'})).toHaveValue('')
    expect(screen.getByLabelText('Reset count')).toHaveTextContent('1')
  })

  it('removes the receiver listener on unmount', () => {
    const renderPreview = vi.fn((props: StorybookPreviewProps) => <Demo {...props} />)
    const {unmount} = render(<StorybookPreviewSurface renderPreview={renderPreview} />)
    unmount()
    renderPreview.mockClear()
    dispatchMessage(updateMessage, window.parent)
    expect(renderPreview).not.toHaveBeenCalled()
  })
})

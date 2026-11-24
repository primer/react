import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {SearchIcon} from '@primer/octicons-react'
import {getLiveRegion} from '../live-region/__tests__/test-helpers'
import {SelectPanel} from './SelectPanel'

const {Loading: SelectPanelLoading, Message: SelectPanelMessage} = SelectPanel

describe('SelectPanel status parts', () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement('live-region'))
  })

  afterEach(() => {
    getLiveRegion().remove()
  })

  it.each(['empty', 'warning', 'error'] as const)('announces a full %s message politely when shown', variant => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <SelectPanelMessage ref={ref} variant={variant} title="Nothing to display" data-testid="message">
        Try a different query.
      </SelectPanelMessage>,
    )

    expect(ref.current).toBe(screen.getByTestId('message'))
    expect(ref.current).toHaveAttribute('data-size', 'full')
    expect(getLiveRegion().getMessage('polite')).toContain('Nothing to display')
    expect(getLiveRegion().getMessage('polite')).toContain('Try a different query.')
    expect(getLiveRegion().getMessage('assertive')).toBe('')
  })

  it('supports a compact inline message without a title', () => {
    render(
      <SelectPanelMessage size="inline" variant="warning" className="custom-message" data-testid="message">
        Some results could not be loaded.
      </SelectPanelMessage>,
    )

    expect(screen.getByTestId('message')).toHaveAttribute('data-size', 'inline')
    expect(screen.getByTestId('message')).toHaveClass('custom-message')
    expect(getLiveRegion().getMessage('polite')).toBe('Some results could not be loaded.')
  })

  it('retains the custom icon and action API without including actions in announcements', async () => {
    const user = userEvent.setup()
    function Message() {
      const [attempts, setAttempts] = React.useState(0)
      return (
        <SelectPanelMessage
          variant="error"
          title="Search failed"
          icon={SearchIcon}
          action={
            <button type="button" onClick={() => setAttempts(attempts + 1)}>
              Retry request ({attempts})
            </button>
          }
          data-testid="message"
        >
          Please try again.
        </SelectPanelMessage>
      )
    }
    render(<Message />)
    const message = getLiveRegion().getMessage('polite')

    expect(screen.getByTestId('message').querySelector('.octicon-search')).not.toBeNull()
    expect(message).toContain('Search failed')
    expect(message).toContain('Please try again.')
    expect(message).not.toContain('Retry request')
    await user.click(screen.getByRole('button', {name: 'Retry request (0)'}))
    expect(screen.getByRole('button', {name: 'Retry request (1)'})).toBeInTheDocument()
    expect(getLiveRegion().getMessage('polite')).toBe(message)
  })

  it('announces changed message content', async () => {
    const {rerender} = render(
      <SelectPanelMessage variant="empty" title="No matches">
        Try another query.
      </SelectPanelMessage>,
    )
    rerender(
      <SelectPanelMessage variant="error" title="Search unavailable">
        Try again later.
      </SelectPanelMessage>,
    )

    await waitFor(() => expect(getLiveRegion().getMessage('polite')).toContain('Search unavailable'))
    expect(getLiveRegion().getMessage('polite')).toContain('Try again later.')
  })

  it.each(['full', 'inline'] as const)('announces loading in the %s layout without duplicate spinner text', size => {
    const ref = React.createRef<HTMLDivElement>()
    render(<SelectPanelLoading size={size} ref={ref} className="custom-loading" data-testid="loading" />)

    expect(ref.current).toBe(screen.getByTestId('loading'))
    expect(ref.current).toHaveAttribute('data-size', size)
    expect(ref.current).toHaveClass('custom-loading')
    expect(ref.current).toHaveTextContent('Loading items...')
    expect(getLiveRegion().getMessage('polite')).toBe('Loading items...')
  })

  it('defaults loading to full size and supports a custom loading message', () => {
    render(<SelectPanelLoading data-testid="loading">Fetching labels...</SelectPanelLoading>)

    expect(screen.getByTestId('loading')).toHaveAttribute('data-size', 'full')
    expect(getLiveRegion().getMessage('polite')).toBe('Fetching labels...')
  })

  it('does not announce hidden status parts', () => {
    render(
      <>
        <SelectPanelLoading hidden />
        <SelectPanelMessage hidden variant="empty" title="No matches">
          Try another query.
        </SelectPanelMessage>
      </>,
    )

    expect(getLiveRegion().getMessage('polite')).toBe('')
  })

  it('announces loading when a hidden loading part becomes visible', () => {
    const {rerender} = render(<SelectPanelLoading hidden />)
    expect(getLiveRegion().getMessage('polite')).toBe('')

    rerender(<SelectPanelLoading />)

    expect(getLiveRegion().getMessage('polite')).toBe('Loading items...')
  })

  it('announces a message when a hidden message part becomes visible', () => {
    const {rerender} = render(
      <SelectPanelMessage hidden variant="empty" title="No matches">
        Try another query.
      </SelectPanelMessage>,
    )
    expect(getLiveRegion().getMessage('polite')).toBe('')

    rerender(
      <SelectPanelMessage variant="empty" title="No matches">
        Try another query.
      </SelectPanelMessage>,
    )

    expect(getLiveRegion().getMessage('polite')).toContain('No matches')
    expect(getLiveRegion().getMessage('polite')).toContain('Try another query.')
  })
})

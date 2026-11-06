import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {run} from 'axe-core'
import {describe, expect, it} from 'vitest'
import {Before} from './Before'
import {Primer} from './Primer'
import {Raw} from './Raw'
import {parseTrigger} from './useInlineEditor'

describe.each([
  ['A: current API with raw input workaround', Before],
  ['B: improved Primer parts', Primer],
  ['C: raw Base UI', Raw],
] as const)('%s', (_, Editor) => {
  it('accepts Enter, preserves surrounding text, caret, focus, and ARIA references', async () => {
    const user = userEvent.setup()
    render(<Editor />)
    const input = screen.getByLabelText<HTMLTextAreaElement>('Comment editor')
    expect(input.tagName).toBe('TEXTAREA')
    await user.type(input, 'Hello @mo suffix')
    input.setSelectionRange(9, 9)
    fireEvent.click(input)
    await screen.findByRole('option', {name: 'mona'})
    await waitFor(() => {
      const activeId = input.getAttribute('aria-activedescendant')
      expect(activeId && document.getElementById(activeId)).toHaveTextContent('mona')
    })
    const listId = input.getAttribute('aria-controls')
    expect(listId && document.getElementById(listId)).toHaveAttribute('role', 'listbox')
    await user.keyboard('{Enter}')
    expect(input).toHaveValue('Hello @mona  suffix')
    expect(input.selectionStart).toBe(12)
    expect(input).toHaveFocus()
    expect(input).not.toHaveAttribute('aria-expanded', 'true')
  })

  it('navigates with arrows, accepts Tab, dismisses Escape without clearing, and retains newlines', async () => {
    const user = userEvent.setup()
    render(<Editor />)
    const input = screen.getByLabelText<HTMLTextAreaElement>('Comment editor')
    await user.type(input, '@')
    await screen.findByRole('option', {name: 'mona'})
    await user.keyboard('{ArrowDown}{Tab}')
    expect(input).toHaveValue('@hubot ')
    expect(input).toHaveFocus()
    await user.type(input, '#12')
    await screen.findByRole('option', {name: '123'})
    await user.keyboard('{Escape}')
    expect(input).not.toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(input).toHaveValue('@hubot #12')
    await user.keyboard('{Enter}')
    expect(input).toHaveValue('@hubot #12\n')
  })

  it('inserts emoji by pointer and suppresses suggestions during composition', async () => {
    const user = userEvent.setup()
    render(<Editor />)
    const input = screen.getByLabelText('Comment editor')
    await user.type(input, ':sm')
    fireEvent.compositionStart(input)
    await waitFor(() => expect(input).not.toHaveAttribute('aria-expanded', 'true'))
    fireEvent.compositionEnd(input)
    await user.click(await screen.findByRole('option', {name: 'smile'}))
    expect(input).toHaveValue(':smile: ')
    expect(input).toHaveFocus()
  })

  it('allows Shift+Tab out and does not reopen on an empty result or range selection', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Previous</button>
        <Editor />
      </>,
    )
    const input = screen.getByLabelText<HTMLTextAreaElement>('Comment editor')
    await user.type(input, '@zz')
    expect(input).not.toHaveAttribute('aria-expanded', 'true')
    await user.clear(input)
    await user.type(input, '@mo')
    input.setSelectionRange(0, 3)
    fireEvent.select(input)
    await waitFor(() => expect(input).not.toHaveAttribute('aria-expanded', 'true'))
    input.setSelectionRange(3, 3)
    fireEvent.click(input)
    await screen.findByRole('option', {name: 'mona'})
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(screen.getByRole('button', {name: 'Previous'})).toHaveFocus()
    expect(input).toHaveValue('@mo')
  })

  it('passes axe WCAG checks and records the shared textarea-role best-practice warning', async () => {
    const user = userEvent.setup()
    render(
      <main>
        <Editor />
      </main>,
    )
    await user.type(screen.getByLabelText('Comment editor'), '@mo')
    await screen.findByRole('option', {name: 'mona'})
    // jsdom cannot check pixel contrast; the browser suite covers rendered geometry separately.
    const result = await run(document.body, {
      runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']},
      rules: {'color-contrast': {enabled: false}},
    })
    expect(result.violations).toEqual([])
    const roleResult = await run(document.body, {runOnly: ['aria-allowed-role']})
    expect(roleResult.violations.map(violation => violation.id)).toEqual(['aria-allowed-role'])
  })
})

describe.each([
  ['Primer', Primer],
  ['Raw Base UI', Raw],
] as const)('%s slash command', (_, Editor) => {
  it('runs a command, removes only the command query, and keeps focus', async () => {
    const user = userEvent.setup()
    render(<Editor slash />)
    const input = screen.getByLabelText('Command editor')
    await user.type(input, 'Please /cl')
    await screen.findByRole('option', {name: 'close'})
    await user.keyboard('{Enter}')
    expect(input).toHaveValue('Please ')
    expect(screen.getByLabelText('Last command')).toHaveTextContent('close')
    expect(input).toHaveFocus()
  })
})

it('parses trigger boundaries and refuses emails, range selections, and the other editor mode', () => {
  expect(parseTrigger('a@mo', 4, 4, false)).toBeNull()
  expect(parseTrigger('@mo', 0, 3, false)).toBeNull()
  expect(parseTrigger('/cl', 3, 3, false)).toBeNull()
  expect(parseTrigger('@mo', 3, 3, true)).toBeNull()
  expect(parseTrigger('Hello\n@mo suffix', 9, 9, false)).toEqual({trigger: '@', query: 'mo', start: 6, end: 9})
})

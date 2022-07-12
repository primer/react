import React, {useLayoutEffect, useState} from 'react'
import {fireEvent, render, within, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InlineAutocomplete, {ShowSuggestionsEvent, Suggestions, Trigger} from '../InlineAutocomplete'
import FormControl from '../FormControl'
import {ActionList} from '../ActionList'
import Textarea from '../Textarea'
import ThemeProvider from '../ThemeProvider'

const label = 'Inline Autocomplete'

const users = ['monalisa', 'github', 'primer']

const emojis = ['heart', 'smile', '+1']

const issues = [
  ['1', 'add emoji feature'],
  ['2', 'fails to save'],
  ['3', 'updates too slowly']
] as const

const triggers: Trigger[] = [
  {triggerChar: '@'},
  {triggerChar: ':', keepTriggerCharOnCommit: false},
  {triggerChar: '#', multiWord: true}
]

const UncontrolledInlineAutocomplete = ({loading = false}: {loading?: boolean}) => {
  const [suggestions, setSuggestions] = useState<Suggestions>([])

  const showUserSuggestions = (query: string) => {
    const matchingUsers = users.filter(user => user.includes(query))
    setSuggestions(matchingUsers)
  }

  const showEmojiSuggestions = (query: string) => {
    setSuggestions(
      emojis
        .filter(emoji => emoji.includes(query))
        .map(emoji => ({
          key: emoji,
          value: `:${emoji}:`,
          render: props => <ActionList.Item {...props}>{emoji}</ActionList.Item>
        }))
    )
  }

  const showIssueSuggestions = (query: string) => {
    if (loading) {
      setSuggestions('loading')
      return
    }

    setSuggestions(
      issues
        .filter(([_, title]) => title.includes(query))
        .map(([id, title]) => ({
          key: id,
          value: id,
          render: props => <ActionList.Item {...props}>{title}</ActionList.Item>
        }))
    )
  }

  const onShowSuggestions = (event: ShowSuggestionsEvent) => {
    switch (event.trigger.triggerChar) {
      case ':':
        showEmojiSuggestions(event.query)
        break
      case '@':
        showUserSuggestions(event.query)
        break
      case '#':
        showIssueSuggestions(event.query)
        break
    }
  }

  useLayoutEffect(() => {
    // combobox-nav attempts to filter out 'hidden' options by checking if the option has an
    // offsetHeight or width > 0. In JSDom, all elements have offsetHeight = offsetWidth = 0,
    // so we need to override at least one to make the class recognize that any options exist.
    for (const option of document.querySelectorAll('[role=option]'))
      Object.defineProperty(option, 'offsetHeight', {
        get: () => 1
      })
  })

  return (
    <ThemeProvider>
      <FormControl>
        <FormControl.Label>{label}</FormControl.Label>
        <InlineAutocomplete
          suggestions={suggestions}
          onShowSuggestions={onShowSuggestions}
          onHideSuggestions={() => setSuggestions([])}
          triggers={triggers}
        >
          <Textarea />
        </InlineAutocomplete>
      </FormControl>
      <button>Button</button> {/* gives us another focuseable element to tab to */}
      <div id="__primerPortalRoot__" />
    </ThemeProvider>
  )
}

const type = (input: HTMLElement, text: string) => {
  // The `act` call _shouldn't_ be necessary, but it doesn't work without it - we don't see any
  // events after the first `setSuggestions` call. Maybe this is a bug with user-event v13? It
  // doesn't seem to happen in v14+.
  // Extracted the workaround into a function to make it easy to swap out later.
  act(() => userEvent.type(input, text))
}

describe('InlineAutocomplete', () => {
  it('forwards label ID to input', () => {
    const {queryByLabelText} = render(<UncontrolledInlineAutocomplete />)

    expect(queryByLabelText(label)).toBeInTheDocument()
  })

  it('does not show suggestions initially', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    expect(queryByRole('listbox')).not.toBeInTheDocument()
    expect(getByLabelText(label)).not.toHaveAttribute('aria-expanded', 'true')
  })

  it('does not show suggestions when typing and not triggered', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    type(getByLabelText(label), 'hello world')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows suggestions when triggered', () => {
    const {getByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')

    expect(getByRole('listbox')).toBeVisible()
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('does not apply ARIA attributes when no suggestions are available', () => {
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello')

    expect(input).not.toHaveAttribute('role')
    expect(input).not.toHaveAttribute('aria-expanded')
    expect(input).not.toHaveAttribute('aria-controls')
    expect(input).not.toHaveAttribute('aria-autocomplete')
    expect(input).not.toHaveAttribute('aria-haspopup')
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('updates ARIA attributes when list is opened', () => {
    const {getByLabelText, getByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')

    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input).toHaveAttribute('role', 'combobox')
    expect(input).toHaveAttribute('aria-controls')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-haspopup', 'listbox')

    // initially no activedescendant to avoid interrupting typing
    expect(input).not.toHaveAttribute('aria-activedescendant')

    // first item should be aria-selected
    expect(within(getByRole('listbox')).queryAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('updates suggestions upon typing more characters', () => {
    const {getByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input1 = getByLabelText(label)
    type(input1, 'hello @pr')
    const list = getByRole('listbox')
    expect(within(list).queryAllByRole('option')).toHaveLength(1)
  })

  it('hides suggestions on Escape', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    userEvent.keyboard('{Escape}')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when no results match', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    userEvent.keyboard('xyz')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when there is a space immediately after the trigger', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'see #')
    expect(queryByRole('listbox')).toBeVisible()
    userEvent.keyboard(' ')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when the input is clicked', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    userEvent.click(input)

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when the page is clicked', () => {
    const {queryByRole, getByLabelText, container} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    userEvent.click(container)

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when input is blurred', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')
    // eslint-disable-next-line github/no-blur
    fireEvent.blur(input)

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when trigger character is deleted', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    userEvent.keyboard('{Backspace}')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it.each(['{Enter}', ' '])('for single-word triggers: hides suggestions when "%s" pressed', key => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')

    expect(queryByRole('listbox')).toBeVisible()
    userEvent.keyboard(key)
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it.each(['.', '{Enter}'])('for multi-word triggers: hides suggestions when "%s" pressed', key => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'see #')

    expect(queryByRole('listbox')).toBeVisible()
    userEvent.keyboard(key)
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('allows space in query for multi-word triggers', () => {
    const {getByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'see #fails to')

    expect(within(getByRole('listbox')).queryAllByRole('option')).toHaveLength(1)
  })

  it('applies the first suggestion on Enter key press', () => {
    const {getByLabelText, getByRole, queryByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, `hello @`)

    const list = getByRole('listbox')
    expect(input).not.toHaveAttribute('aria-activedescendant')
    expect(within(list).queryAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')

    userEvent.keyboard('{Enter}')

    expect(input).toHaveValue('hello @monalisa ')
    expect(input).toHaveFocus()
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('selects a suggestion with arrow keys', () => {
    const {getByLabelText, getByRole, queryByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')

    userEvent.keyboard('{ArrowDown}')

    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-1'))
    expect(within(getByRole('listbox')).queryAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')

    userEvent.keyboard('{Enter}')

    expect(input).toHaveValue('hello @github ')
    expect(input).toHaveFocus()
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('applies a suggestion when clicked', () => {
    const {getByLabelText, getByRole, queryByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, `hello @`)

    const option = within(getByRole('listbox')).queryAllByRole('option')[2]
    userEvent.click(option)

    expect(input).toHaveValue('hello @primer ')
    expect(input).toHaveFocus()
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('applies the value of the suggestion when different from the display text', () => {
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'please see #updates')
    userEvent.keyboard('{Enter}')

    expect(input).toHaveValue('please see #3 ')
  })

  it('deletes the trigger character when `keepTriggerCharOnCommit` is false', () => {
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'Hello! :sm')
    userEvent.keyboard('{Enter}')

    // if the trigger character was not deleted, the value would be "Hello! ::smile:"
    expect(input).toHaveValue('Hello! :smile: ')
  })

  it('shows a loading indicator and allows tabbing away when loading', () => {
    const {getByLabelText, getByRole, queryByText} = render(<UncontrolledInlineAutocomplete loading />)

    const input = getByLabelText(label)
    type(input, 'please see #')

    const list = getByRole('listbox')
    expect(within(list).queryAllByRole('option')).toHaveLength(0)
    expect(queryByText('Loading autocomplete suggestions…')).toBeInTheDocument()

    userEvent.tab()

    expect(input).not.toHaveFocus()
  })

  it('queries based on the last trigger character found', () => {
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'Hello! #test :')
    userEvent.keyboard('{Enter}')

    expect(input).toHaveValue('Hello! #test :heart: ')
  })

  it('reads out an accessible message when the suggestions become available and change', () => {
    const {queryByText, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    type(input, 'hello @')

    const statusMessage = queryByText(
      '3 autocomplete suggestions available. The first is "monalisa"; press Enter or Tab to insert it.'
    )!
    expect(statusMessage).toBeInTheDocument()
    expect(statusMessage).toHaveAttribute('aria-live', 'assertive')

    userEvent.keyboard('gith')
    expect(statusMessage).toHaveTextContent(
      '1 autocomplete suggestion available: "github". Press Enter or Tab to insert it.'
    )
  })
})

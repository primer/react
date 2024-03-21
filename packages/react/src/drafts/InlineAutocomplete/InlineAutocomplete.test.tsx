import React, {useState} from 'react'
import {fireEvent, render, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ShowSuggestionsEvent, Suggestions, Trigger} from '.'
import InlineAutocomplete from '.'
import FormControl from '../../FormControl'
import {ActionList} from '../../ActionList'
import Textarea from '../../Textarea'
import ThemeProvider from '../../ThemeProvider'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'

const label = 'Inline Autocomplete'

const users = ['monalisa', 'github', 'primer']

const emojis = ['heart', 'smile', '+1']

const issues = [
  ['1', 'add emoji feature'],
  ['2', 'fails to save'],
  ['3', 'updates too slowly'],
] as const

const triggers: Trigger[] = [
  {triggerChar: '@'},
  {triggerChar: ':', keepTriggerCharOnCommit: false},
  {triggerChar: '#', multiWord: true},
]

const UncontrolledInlineAutocomplete = ({
  loading = false,
  tabInsertsSuggestions,
}: {
  loading?: boolean
  tabInsertsSuggestions?: boolean
}) => {
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
          render: props => <ActionList.Item {...props}>{emoji}</ActionList.Item>,
        })),
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
          render: props => <ActionList.Item {...props}>{title}</ActionList.Item>,
        })),
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

  useIsomorphicLayoutEffect(() => {
    // combobox-nav attempts to filter out 'hidden' options by checking if the option has an
    // offsetHeight or width > 0. In JSDom, all elements have offsetHeight = offsetWidth = 0,
    // so we need to override at least one to make the class recognize that any options exist.
    for (const option of document.querySelectorAll('[role=option]'))
      Object.defineProperty(option, 'offsetHeight', {
        value: 1,
        writable: true,
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
          tabInsertsSuggestions={tabInsertsSuggestions}
        >
          <Textarea />
        </InlineAutocomplete>
      </FormControl>
      <button>Button</button> {/* gives us another focuseable element to tab to */}
      <div id="__primerPortalRoot__" />
    </ThemeProvider>
  )
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

  it('does not show suggestions when typing and not triggered', async () => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    await user.type(getByLabelText(label), 'hello world')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows suggestions when triggered', async () => {
    const user = userEvent.setup()
    const {getByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')

    expect(getByRole('listbox')).toBeVisible()
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('does not apply ARIA attributes when no suggestions are available', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello')

    expect(input).not.toHaveAttribute('role')
    expect(input).not.toHaveAttribute('aria-expanded')
    expect(input).not.toHaveAttribute('aria-controls')
    expect(input).not.toHaveAttribute('aria-autocomplete')
    expect(input).not.toHaveAttribute('aria-haspopup')
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('updates ARIA attributes when list is opened', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')

    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input).toHaveAttribute('role', 'combobox')
    expect(input).toHaveAttribute('aria-controls')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-haspopup', 'listbox')

    // initially no activedescendant to avoid interrupting typing
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('updates suggestions upon typing more characters', async () => {
    const user = userEvent.setup()
    const {getByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input1 = getByLabelText(label)
    await user.type(input1, 'hello @pr')
    const list = getByRole('listbox')
    expect(within(list).queryAllByRole('option')).toHaveLength(1)
  })

  it('hides suggestions on Escape', async () => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    await user.keyboard('{Escape}')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when no results match', async () => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    await user.keyboard('xyz')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when there is a space immediately after the trigger', async () => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'see #')
    expect(queryByRole('listbox')).toBeVisible()
    await user.keyboard(' ')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when the input is clicked', async () => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    await user.click(input)

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when the page is clicked', async () => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText, container} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    await user.click(container)

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when input is blurred', async () => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')
    // eslint-disable-next-line github/no-blur
    fireEvent.blur(input)

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides suggestions when trigger character is deleted', async () => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')
    expect(queryByRole('listbox')).toBeVisible()
    await user.keyboard('{Backspace}')

    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it.each(['{Enter}', ' '])('for single-word triggers: hides suggestions when "%s" pressed', async key => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')

    expect(queryByRole('listbox')).toBeVisible()
    await user.keyboard(key)
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it.each(['.', '{Enter}'])('for multi-word triggers: hides suggestions when "%s" pressed', async key => {
    const user = userEvent.setup()
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'see #')

    expect(queryByRole('listbox')).toBeVisible()
    await user.keyboard(key)
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('allows space in query for multi-word triggers', async () => {
    const user = userEvent.setup()
    const {getByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'see #fails to')

    expect(within(getByRole('listbox')).queryAllByRole('option')).toHaveLength(1)
  })

  it('applies the first suggestion on Enter key press', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByRole, queryByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, `hello @`)

    const list = getByRole('listbox')
    expect(input).not.toHaveAttribute('aria-activedescendant')
    expect(within(list).queryAllByRole('option')[0]).toHaveAttribute('data-combobox-option-default')

    await user.keyboard('{Enter}')

    expect(input).toHaveValue('hello @monalisa ')
    expect(input).toHaveFocus()
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('does not apply using Tab when not enabled', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, `hello @`)

    await user.keyboard('{Tab}')

    expect(input).toHaveValue('hello @')
    expect(input).not.toHaveFocus()
  })

  it('applies using Tab when enabled', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete tabInsertsSuggestions />)

    const input = getByLabelText(label)
    await user.type(input, `hello @`)

    await user.keyboard('{Tab}')

    expect(input).toHaveValue('hello @monalisa ')
  })

  it('selects a suggestion with arrow keys', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByRole, queryByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')

    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')

    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-activedescendant', 'github')
    expect(within(getByRole('listbox')).queryAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Enter}')

    expect(input).toHaveValue('hello @github ')
    expect(input).toHaveFocus()
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('applies a suggestion when clicked', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByRole, queryByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, `hello @`)

    const option = within(getByRole('listbox')).queryAllByRole('option')[2]
    await user.click(option)

    expect(input).toHaveValue('hello @primer ')
    expect(input).toHaveFocus()
    expect(queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('applies the value of the suggestion when different from the display text', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'please see #updates')
    await user.keyboard('{Enter}')

    expect(input).toHaveValue('please see #3 ')
  })

  it('deletes the trigger character when `keepTriggerCharOnCommit` is false', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'Hello! :sm')
    await user.keyboard('{Enter}')

    // if the trigger character was not deleted, the value would be "Hello! ::smile:"
    expect(input).toHaveValue('Hello! :smile: ')
  })

  it('shows a loading indicator and allows tabbing away when loading', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByRole, queryByText} = render(<UncontrolledInlineAutocomplete loading />)

    const input = getByLabelText(label)
    await user.type(input, 'please see #')

    const list = getByRole('listbox')
    expect(within(list).queryAllByRole('option')).toHaveLength(0)
    expect(queryByText('Loading autocomplete suggestions…')).toBeInTheDocument()

    await user.tab()

    expect(input).not.toHaveFocus()
  })

  it('queries based on the last trigger character found', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'Hello! #test :')
    await user.keyboard('{Enter}')

    expect(input).toHaveValue('Hello! #test :heart: ')
  })

  it('reads out an accessible message when the suggestions become available and change', async () => {
    const user = userEvent.setup()
    const {queryByText, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')

    const statusMessage = queryByText(
      '3 autocomplete suggestions available; "monalisa" is highlighted. Press Enter to insert.',
    )
    expect(statusMessage).toBeInTheDocument()
    expect(statusMessage).toHaveAttribute('aria-live', 'assertive')

    await user.keyboard('gith')
    expect(statusMessage).toHaveTextContent(
      '1 autocomplete suggestion available; "github" is highlighted. Press Enter to insert.',
    )
  })

  it('accessible message includes "Tab" when tab insertion is enabled', async () => {
    const user = userEvent.setup()
    const {queryByText, getByLabelText} = render(<UncontrolledInlineAutocomplete tabInsertsSuggestions />)

    const input = getByLabelText(label)
    await user.type(input, 'hello @')

    const statusMessage = queryByText(
      '3 autocomplete suggestions available; "monalisa" is highlighted. Press Enter or Tab to insert.',
    )
    expect(statusMessage).toBeInTheDocument()
  })
})

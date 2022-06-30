import React, {useState} from 'react'
import {fireEvent, render, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InlineAutocomplete, {ShowSuggestionsEvent, Suggestions, Trigger} from '../InlineAutocomplete'
import FormControl from '../FormControl'
import {ActionList} from '../ActionList'
import Textarea from '../Textarea'

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
    setSuggestions(users.filter(user => user.includes(query)))
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

  return (
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

  it('does not show suggestions when typing and not triggered', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    userEvent.type(getByLabelText(label), 'hello world')

    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it('shows suggestions when triggered', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @')

    expect(queryByRole('listbox')).toBeVisible()
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('updates suggestions upon typing', () => {
    const {getByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @')

    const list = getByRole('listbox')
    const items = () => within(list).queryAllByRole('option')

    expect(items()).toHaveLength(3)

    userEvent.type(input, 'mona')
    expect(items()).toHaveLength(1)
  })

  it('hides suggestions on Escape', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @')
    userEvent.keyboard('{Escape}')

    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it('hides suggestions when no results match', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @xyz')

    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it('hides suggestions when there is a space immediately after the trigger', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'see # ')

    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it('hides suggestions when the input is clicked', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @')
    userEvent.click(input)

    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it('hides suggestions when the page is clicked', () => {
    const {queryByRole, getByLabelText, container} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @')
    userEvent.click(container)

    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it('hides suggestions when input is blurred', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @')
    fireEvent.blur(input)

    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it('hides suggestions when trigger character is deleted', () => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @')
    userEvent.keyboard('{Backspace}')

    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it.each(['{Enter}', ' '])('for single-word triggers: hides suggestions when "%s" pressed', key => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello @')

    expect(queryByRole('listbox')).toBeVisible()
    userEvent.keyboard(key)
    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it.each(['.', '{Enter}'])('for multi-word triggers: hides suggestions when "%s" pressed', key => {
    const {queryByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'see #')

    expect(queryByRole('listbox')).toBeVisible()
    userEvent.keyboard(key)
    expect(queryByRole('listbox')).not.toBeVisible()
  })

  it('allows space in query for multi-word triggers', () => {
    const {queryByRole, getByRole, getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'hello #fails to')

    expect(queryByRole('listbox')).toBeVisible()
    expect(within(getByRole('listbox')).queryAllByRole('option')).toHaveLength(1)
  })

  it.each(['{Enter}', '{Tab}'])('applies the first suggestion on "%s" keypress without losing focus', key => {
    const {getByLabelText, getByRole, findByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, `hello @`)

    const list = getByRole('listbox')
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-0'))
    expect(within(list).queryAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
    expect(within(list).queryAllByRole('option')[1]).toHaveAttribute('aria-selected', 'false')

    userEvent.keyboard(key)

    expect(input).toHaveValue('hello @monalisa')
    expect(input).toHaveFocus()
    expect(findByRole('listbox')).not.toBeVisible()
  })

  it('selects a suggestion with arrow keys', () => {
    const {getByLabelText, getByRole, findByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, `hello @`)
    userEvent.keyboard('{ArrowDown}')

    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-1'))
    expect(within(getByRole('listbox')).queryAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')

    userEvent.keyboard('{Enter}')

    expect(input).toHaveValue('hello @github ')
    expect(input).toHaveFocus()
    expect(findByRole('listbox')).not.toBeVisible()
  })

  it('applies a suggestion when clicked', () => {
    const {getByLabelText, getByRole, findByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, `hello @`)

    const option = within(getByRole('listbox')).queryAllByRole('option')[2]
    userEvent.click(option)

    expect(input).toHaveValue('hello @primer ')
    expect(input).toHaveFocus()
    expect(findByRole('listbox')).not.toBeVisible()
  })

  it('applies the value of the suggestion when different from the display text', () => {
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'please see #updates')
    userEvent.keyboard('{Enter}')

    expect(input).toHaveValue('please see #3 ')
  })

  it('replaces the trigger character when `keepTriggerCharOnCommit` is false', () => {
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'Hello! :sm')
    userEvent.keyboard('{Enter}')

    expect(input).toHaveValue('Hello! :smile: ')
  })

  it('shows a loading indicator and allows tabbing away when loading', () => {
    const {getByLabelText, getByRole} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'please see #')

    const list = getByRole('listbox')
    expect(within(list).queryAllByRole('option')).toHaveLength(0)

    userEvent.keyboard('{Tab}')

    expect(input).not.toHaveFocus()
  })

  it('queries based on the last trigger character', () => {
    const {getByLabelText} = render(<UncontrolledInlineAutocomplete />)

    const input = getByLabelText(label)
    userEvent.type(input, 'Hello! @:')
    userEvent.keyboard('{Enter}')

    expect(input).toHaveValue('Hello! @:heart: ')
  })
})

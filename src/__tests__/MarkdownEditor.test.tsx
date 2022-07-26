import {fireEvent, render as _render, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, {useState} from 'react'
import MarkdownEditor, {MarkdownEditorProps} from '../MarkdownEditor'

type UncontrolledEditorProps = Omit<MarkdownEditorProps, 'value' | 'onChange' | 'onRenderPreview' | 'children'> &
  Partial<Pick<MarkdownEditorProps, 'onChange' | 'onRenderPreview' | 'children'>>

const UncontrolledEditor = (props: UncontrolledEditorProps) => {
  const [value, setValue] = useState('')

  const handleChange = (v: string) => {
    props.onChange?.(v)
    setValue(v)
  }

  return (
    <MarkdownEditor onRenderPreview={async () => 'Preview'} {...props} value={value} onChange={handleChange}>
      {props.children ?? <MarkdownEditor.Label>Test Editor</MarkdownEditor.Label>}
    </MarkdownEditor>
  )
}

const render = (ui: React.ReactElement) => {
  document.documentElement.innerHTML = ''
  const result = _render(ui)

  const getInput = () => result.getByRole('textbox') as HTMLTextAreaElement

  const getToolbar = () => result.getByRole('toolbar')

  const getToolbarButton = (label: string) => within(getToolbar()).getByLabelText(label)

  return {...result, getInput, getToolbar, getToolbarButton}
}

describe('MarkdownEditor', () => {
  beforeEach(() => {
    jest.mock('@primer/behaviors/utils', () => ({
      // for all tests, default to Non-Mac (Ctrl) keybindings
      isMacOS: jest.fn().mockReturnValue(false)
    }))
  })

  describe.each<
    [description: string, result: string, shortcut?: [key: string, shift: boolean], caretPosition?: number]
  >([
    ['Add header text', 'text### '],
    ['Bold', 'text****', ['b', false], 6],
    ['Italic', 'text__', ['i', false], 5],
    ['Insert a quote', 'text\n\n> ', ['.', true]],
    ['Insert code', 'text``', ['e', false], 5],
    ['Add a link', 'text[](url)', ['k', false], 5],
    ['Add a bulleted list', '- text', ['8', false]],
    ['Add a numbered list', '1. text', ['7', true]],
    ['Add a task list', 'text\n\n- [ ] ', ['l', true]],
    ['Mention a user or team (@)', 'text @'],
    ['Reference an issue, pull request, or discussion (#)', 'text #']
  ])('formatting (%s)', (description, result, shortcut, caretPosition = result.length) => {
    it('works using toolbar button', () => {
      const {getInput, getToolbarButton} = render(<UncontrolledEditor />)
      const input = getInput()

      const label = `${description}${
        shortcut ? ` (Ctrl${shortcut[1] ? ' + Shift' : ''} + ${shortcut[0].toUpperCase()})` : ''
      }`

      userEvent.type(input, 'text')
      userEvent.click(getToolbarButton(label))

      expect(input).toHaveValue(result)
      expect(input).toHaveFocus()
      expect(input.selectionStart).toBe(caretPosition)
    })

    it('works using keyboard shortcut', () => {
      if (!shortcut) return
      const [key, shift] = shortcut

      const {getInput} = render(<UncontrolledEditor />)
      const input = getInput()

      userEvent.type(input, `text{ctrl}${shift ? '{shift}' : ''}${key}`)

      expect(input).toHaveValue(result)
      expect(input).toHaveFocus()
      expect(input.selectionStart).toBe(caretPosition)
    })
  })

  it('calls onPrimaryAction on ctrl+enter', () => {
    const onPrimaryAction = jest.fn()
    const {getInput} = render(<UncontrolledEditor onPrimaryAction={onPrimaryAction} />)

    userEvent.type(getInput(), `{ctrl}{enter}`)
    expect(onPrimaryAction).toBeCalled()
  })

  it('renders custom toolbar buttons', () => {
    const {getToolbarButton} = render(
      <UncontrolledEditor>
        <MarkdownEditor.ToolbarButton aria-label="Test Button" />
      </UncontrolledEditor>
    )

    expect(() => getToolbarButton('Test Button')).not.toThrow()
  })

  it('maintains focus on input by default when custom toolbar buttons are clicked', () => {
    const onClick = jest.fn()
    const {getInput, getToolbarButton} = render(
      <UncontrolledEditor>
        <MarkdownEditor.ToolbarButton aria-label="Test Button" onClick={onClick} />
      </UncontrolledEditor>
    )

    const input = getInput()
    userEvent.type(input, 'text')
    userEvent.click(getToolbarButton('Test Button'))

    expect(input).toHaveFocus()
    expect(onClick).toHaveBeenCalled()
  })

  describe('toolbar keyboard navigation', () => {
    it('navigates between buttons using arrow keys / home & end', () => {
      const {getToolbarButton, getToolbar} = render(<UncontrolledEditor />)

      const boldButton = getToolbarButton('Bold (Ctrl + B)')
      const italicButton = getToolbarButton('Italic (Ctrl + I)')

      boldButton.focus()
      userEvent.keyboard('{ArrowRight}')
      expect(italicButton).toHaveFocus()
      userEvent.keyboard('{ArrowLeft}')
      expect(boldButton).toHaveFocus()

      const toolbar = getToolbar()
      const buttons = within(toolbar).getAllByRole('button')

      userEvent.keyboard('{Home}')
      expect(buttons[0]).toHaveFocus()
      userEvent.keyboard('{End}')
      expect(buttons[buttons.length - 1]).toHaveFocus()
    })

    it('allows skipping past toolbar with Tab', () => {
      const {getToolbar, getInput} = render(<UncontrolledEditor />)

      const toolbar = getToolbar()
      const buttons = within(toolbar).getAllByRole('button')

      buttons[0].focus()
      userEvent.keyboard('{tab}')

      expect(getInput()).toHaveFocus()

      userEvent.keyboard('{shift}{tab}')

      expect(buttons[buttons.length - 1]).toHaveFocus()
    })

    it('includes custom buttons', () => {
      const {getToolbarButton} = render(
        <UncontrolledEditor>
          <MarkdownEditor.ToolbarButton aria-label="Test Button A" />
          <MarkdownEditor.ToolbarButton aria-label="Test Button B" />
        </UncontrolledEditor>
      )

      const a = getToolbarButton('Test Button A')
      const b = getToolbarButton('Test Button B')

      a.focus()
      userEvent.keyboard('{ArrowRight}')
      expect(b).toHaveFocus()
    })
  })

  describe('list editing', () => {
    const resultOfTypingInEditor = (text: string) => {
      const {getInput} = render(<UncontrolledEditor />)
      userEvent.type(getInput(), text)
      return getInput().value
    }

    it('allows creating newlines like normal when there is no list', () => {
      expect(resultOfTypingInEditor('dogs{enter}cats')).toBe('dogs\ncats')
    })

    it.each(['*', '-'])('creates new list item on newline when editing a simple list', delimeter => {
      expect(resultOfTypingInEditor(`${delimeter} dogs{enter}cats`)).toBe(`${delimeter} dogs\n${delimeter} cats`)
    })

    it('increments number when editing ordered list', () => {
      expect(resultOfTypingInEditor(`1. dogs{enter}cats`)).toBe(`1. dogs\n2. cats`)
    })

    it.each([
      ['*', '*'],
      ['-', '-'],
      ['1.', '2.']
    ])('adds task items when editing task lists', (firstDelimeter, secondDelimeter) => {
      expect(resultOfTypingInEditor(`${firstDelimeter} {[} {]} task one{enter}task two`)).toBe(
        `${firstDelimeter} [ ] task one\n${secondDelimeter} [ ] task two`
      )
    })

    it('adds empty task item even if current task item is checked', () => {
      expect(resultOfTypingInEditor(`- {[}x{]} task one{enter}task two`)).toBe(`- [x] task one\n- [ ] task two`)
    })

    it('preserves leading whitespace when adding items', () => {
      expect(resultOfTypingInEditor(`    - dogs{enter}cats`)).toBe(`    - dogs\n    - cats`)
    })

    it('preserves text following caret if caret is not at end of line', () => {
      const input = render(<UncontrolledEditor />).getInput()
      userEvent.type(input, '- dogscats')
      userEvent.type(input, '{enter}', {initialSelectionStart: 6})
      expect(input.value).toBe(`- dogs\n- cats`)
      expect(input.selectionStart).toBe(9)
    })

    it('deletes highlighted text', () => {
      const input = render(<UncontrolledEditor />).getInput()
      userEvent.type(input, '- dogsbirdscats')
      userEvent.type(input, '{enter}', {initialSelectionStart: 6, initialSelectionEnd: 11})
      expect(input.value).toBe(`- dogs\n- cats`)
    })

    it('deletes empty item on enter', () => {
      expect(resultOfTypingInEditor('- dogs{enter}{enter}')).toBe('- dogs\n')
    })

    it('adds new items in the middle of a list', () => {
      const input = render(<UncontrolledEditor />).getInput()
      userEvent.type(input, '- dogs{enter}cats')
      userEvent.type(input, '{enter}birds', {initialSelectionStart: 6})
      expect(input.value).toBe(`- dogs\n- birds\n- cats`)
    })

    it('increments following list items if there are any', () => {
      const input = render(<UncontrolledEditor />).getInput()
      userEvent.type(input, '1. dogs{enter}cats')
      userEvent.type(input, '{enter}birds', {initialSelectionStart: 7})
      expect(input.value).toBe(`1. dogs\n2. birds\n3. cats`)
    })

    it('does not increment following list items if a number is skipped', () => {
      const input = render(<UncontrolledEditor />).getInput()
      userEvent.type(input, '1. dogs{enter}{enter}3. cats')
      userEvent.type(input, '{enter}birds', {initialSelectionStart: 7})
      expect(input.value).toBe(`1. dogs\n2. birds\n3. cats`)
    })

    it('increments multiple consecutive following list items', () => {
      const input = render(<UncontrolledEditor />).getInput()
      userEvent.type(input, '1. dogs{enter}birds{enter}cats')
      userEvent.type(input, '{enter}horses', {initialSelectionStart: 7})
      expect(input.value).toBe(`1. dogs\n2. horses\n3. birds\n4. cats`)
    })

    it('does not add a list item on shift+enter', () => {
      const input = render(<UncontrolledEditor />).getInput()
      userEvent.type(input, '- dogs{shift>}{enter}{/shift}cats')
      expect(input.value).toBe('- dogs\ncats')
    })

    it('does not add another list item while composing input', () => {
      const input = render(<UncontrolledEditor />).getInput()

      userEvent.type(input, '- list item, composition: ')
      fireEvent.compositionStart(input)
      userEvent.type(input, 'やあ{enter}')
      fireEvent.compositionEnd(input)
      userEvent.type(input, '! this is more text{enter}')
      userEvent.type(input, 'this is the next list item')

      expect(input.value).toBe('- list item, composition: やあ! this is more text\n- this is the next list item')
    })
  })
})

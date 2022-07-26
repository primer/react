import {DiffAddedIcon} from '@primer/octicons-react'
import {fireEvent, render as _render, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, {useRef, useState} from 'react'
import MarkdownEditor, {MarkdownEditorProps} from '../MarkdownEditor'
import ThemeProvider from '../ThemeProvider'

type UncontrolledEditorProps = Omit<MarkdownEditorProps, 'value' | 'onChange' | 'onRenderPreview' | 'children'> &
  Partial<Pick<MarkdownEditorProps, 'onChange' | 'onRenderPreview' | 'children'>>

const UncontrolledEditor = (props: UncontrolledEditorProps) => {
  const [value, setValue] = useState('')
  const input = useRef<HTMLTextAreaElement>(null)

  const handleChange = (v: string) => {
    props.onChange?.(v)
    if (input.current) input.current.value = v
    setValue(v)
  }

  const onRenderPreview = async () => 'Preview'

  return (
    <ThemeProvider>
      <MarkdownEditor ref={input} onRenderPreview={onRenderPreview} {...props} value={value} onChange={handleChange}>
        <MarkdownEditor.Label>Test Editor</MarkdownEditor.Label>

        {props.children}
      </MarkdownEditor>
    </ThemeProvider>
  )
}

const render = async (ui: React.ReactElement) => {
  const result = _render(ui)
  const user = userEvent.setup()

  const getInput = () => result.getByRole('textbox') as HTMLTextAreaElement

  const getToolbar = () => result.getByRole('toolbar')

  const getFooter = () => result.getByRole('footer')

  const getToolbarButton = (label: string) => within(getToolbar()).getByLabelText(label)

  const queryForUploadButton = () =>
    result.queryByText('Add files') || result.queryByText('Paste, drop, or click to add files')

  // Wait for the double render caused by slots to complete
  await waitFor(() => result.getByText('Test Editor'))

  return {...result, getInput, getToolbar, getToolbarButton, user, queryForUploadButton, getFooter}
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
    it('works using toolbar button', async () => {
      const {getInput, getToolbarButton, user} = await render(<UncontrolledEditor />)
      const input = getInput()

      const label = `${description}${
        shortcut ? ` (Ctrl${shortcut[1] ? ' + Shift' : ''} + ${shortcut[0].toUpperCase()})` : ''
      }`

      await user.type(input, 'text')
      await user.click(getToolbarButton(label))

      expect(input).toHaveValue(result)
      expect(input).toHaveFocus()
      expect(input.selectionStart).toBe(caretPosition)
    })

    it('works using keyboard shortcut', async () => {
      if (!shortcut) return
      const [key, shift] = shortcut

      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()

      await user.type(input, `text{Control>}${shift ? '{Shift>}' : ''}${key}${shift ? '{/Shift}' : ''}{/Control}`)

      expect(input).toHaveValue(result)
      expect(input).toHaveFocus()
      expect(input.selectionStart).toBe(caretPosition)
    })
  })

  it('calls onPrimaryAction on ctrl+enter', async () => {
    const onPrimaryAction = jest.fn()
    const {getInput, user} = await render(<UncontrolledEditor onPrimaryAction={onPrimaryAction} />)

    await user.type(getInput(), `{Control>}{Enter}{/Control}`)
    expect(onPrimaryAction).toBeCalled()
  })

  it('renders custom toolbar buttons', async () => {
    const {getToolbarButton} = await render(
      <UncontrolledEditor>
        <MarkdownEditor.Toolbar>
          <MarkdownEditor.ToolbarButton icon={DiffAddedIcon} aria-label="Test Button" />
        </MarkdownEditor.Toolbar>
      </UncontrolledEditor>
    )

    expect(() => getToolbarButton('Test Button')).not.toThrow()
  })

  it('maintains focus on input by default when custom toolbar buttons are clicked', async () => {
    const onClick = jest.fn()
    const {getInput, getToolbarButton, user} = await render(
      <UncontrolledEditor>
        <MarkdownEditor.Toolbar>
          <MarkdownEditor.ToolbarButton icon={DiffAddedIcon} aria-label="Test Button" onClick={onClick} />
        </MarkdownEditor.Toolbar>
      </UncontrolledEditor>
    )

    const input = getInput()
    await user.type(input, 'text')
    await user.click(getToolbarButton('Test Button'))

    expect(input).toHaveFocus()
    expect(onClick).toHaveBeenCalled()
  })

  describe('toolbar keyboard navigation', () => {
    it('navigates between buttons using arrow keys / home & end', async () => {
      const {getToolbarButton, getToolbar, user} = await render(<UncontrolledEditor />)

      const boldButton = getToolbarButton('Bold (Ctrl + B)')
      const italicButton = getToolbarButton('Italic (Ctrl + I)')

      boldButton.focus()
      await user.keyboard('{ArrowRight}')
      expect(italicButton).toHaveFocus()
      await user.keyboard('{ArrowLeft}')
      expect(boldButton).toHaveFocus()

      const toolbar = getToolbar()
      const buttons = within(toolbar).getAllByRole('button')

      await user.keyboard('{Home}')
      expect(buttons[0]).toHaveFocus()
      await user.keyboard('{End}')
      expect(buttons[buttons.length - 1]).toHaveFocus()
    })

    it('allows skipping past toolbar with Tab', async () => {
      const {getToolbar, getInput, user} = await render(<UncontrolledEditor />)

      const toolbar = getToolbar()
      const buttons = within(toolbar).getAllByRole('button')

      buttons[0].focus()
      await user.tab()

      expect(getInput()).toHaveFocus()

      await user.tab({shift: true})

      expect(buttons[buttons.length - 1]).toHaveFocus()
    })

    it('includes custom buttons', async () => {
      const {getToolbarButton, user} = await render(
        <UncontrolledEditor>
          <MarkdownEditor.Toolbar>
            <MarkdownEditor.ToolbarButton aria-label="Test Button A" icon={DiffAddedIcon} />
            <MarkdownEditor.ToolbarButton aria-label="Test Button B" icon={DiffAddedIcon} />
            <MarkdownEditor.DefaultToolbarButtons />
          </MarkdownEditor.Toolbar>
        </UncontrolledEditor>
      )

      const a = getToolbarButton('Test Button A')
      const b = getToolbarButton('Test Button B')

      b.focus()
      await user.keyboard('{ArrowLeft}')
      expect(a).toHaveFocus()
    })
  })

  describe('list editing', () => {
    const resultOfTypingInEditor = async (text: string) => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      await user.type(getInput(), text)
      return getInput().value
    }

    it('allows creating newlines like normal when there is no list', async () => {
      expect(await resultOfTypingInEditor('dogs{Enter}cats')).toBe('dogs\ncats')
    })

    it.each(['*', '-'])('creates new list item on newline when editing a simple list', async delimeter => {
      expect(await resultOfTypingInEditor(`${delimeter} dogs{Enter}cats`)).toBe(`${delimeter} dogs\n${delimeter} cats`)
    })

    it('increments number when editing ordered list', async () => {
      expect(await resultOfTypingInEditor(`1. dogs{Enter}cats`)).toBe(`1. dogs\n2. cats`)
    })

    it.each([
      ['*', '*'],
      ['-', '-'],
      ['1.', '2.']
    ])('adds task items when editing task lists', async (firstDelimeter, secondDelimeter) => {
      expect(await resultOfTypingInEditor(`${firstDelimeter} {[} {]} task one{Enter}task two`)).toBe(
        `${firstDelimeter} [ ] task one\n${secondDelimeter} [ ] task two`
      )
    })

    it('adds empty task item even if current task item is checked', async () => {
      expect(await resultOfTypingInEditor(`- {[}x{]} task one{Enter}task two`)).toBe(`- [x] task one\n- [ ] task two`)
    })

    it('preserves leading whitespace when adding items', async () => {
      expect(await resultOfTypingInEditor(`    - dogs{Enter}cats`)).toBe(`    - dogs\n    - cats`)
    })

    it('preserves text following caret if caret is not at end of line', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '- dogscats')
      await user.type(input, '{Enter}', {initialSelectionStart: 6})
      expect(input.value).toBe(`- dogs\n- cats`)
      expect(input.selectionStart).toBe(9)
    })

    it('deletes highlighted text', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '- dogsbirdscats')
      await user.type(input, '{Enter}', {initialSelectionStart: 6, initialSelectionEnd: 11})
      expect(input.value).toBe(`- dogs\n- cats`)
    })

    it('deletes empty item on enter', async () => {
      expect(await resultOfTypingInEditor('- dogs{Enter}{Enter}')).toBe('- dogs\n')
    })

    // The following are skipped because userEvent is only typing one character before moving
    // the caret to the end of the input and continuing typing. If we can figure out how to fix
    // that, we can re-enable these.

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('adds new items in the middle of a list', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '- dogs{Enter}cats')
      await user.type(input, '{Enter}birds', {initialSelectionStart: 6})
      expect(input.value).toBe(`- dogs\n- birds\n- cats`)
    })

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('increments following list items if there are any', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '1. dogs{Enter}cats')
      await user.type(input, '{Enter}birds', {initialSelectionStart: 7})
      expect(input.value).toBe(`1. dogs\n2. birds\n3. cats`)
    })

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('does not increment following list items if a number is skipped', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '1. dogs{Enter}{Enter}3. cats')
      await user.type(input, '{Enter}birds', {initialSelectionStart: 7})
      expect(input.value).toBe(`1. dogs\n2. birds\n3. cats`)
    })

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('increments multiple consecutive following list items', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '1. dogs{Enter}birds{Enter}cats')
      await user.type(input, '{Enter}horses', {initialSelectionStart: 7})
      expect(input.value).toBe(`1. dogs\n2. horses\n3. birds\n4. cats`)
    })

    it('does not add a list item on shift+enter', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '- dogs{Shift>}{Enter}{/Shift}cats')
      expect(input.value).toBe('- dogs\ncats')
    })

    it('does not add another list item while composing input', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()

      await user.type(input, '- list item, composition: ')
      fireEvent.compositionStart(input)
      await user.keyboard('やあ')
      // jsdom doesn't know about composing. We don't want to *type* enter here, we just want to simulate key down/up
      fireEvent.keyDown(input, {key: 'Enter'})
      fireEvent.keyUp(input, {key: 'Enter'})
      fireEvent.compositionEnd(input)
      await user.keyboard('! this is more text{Enter}this is the next list item')

      expect(input.value).toBe('- list item, composition: やあ! this is more text\n- this is the next list item')
    })
  })

  describe('indenting', () => {
    it('indents selected text on Tab', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, 'hello\n  world\nhello')
      await user.type(input, '{Tab}', {initialSelectionStart: 3, initialSelectionEnd: 14})
      expect(input.value).toBe(`  hello\n    world\n  hello`)
    })

    it('dedents space-indented text on Shift+Tab', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '  hello\n    world\n  hello')
      await user.type(input, '{Shift>}{Tab}{/Shift}', {initialSelectionStart: 3, initialSelectionEnd: 22})
      expect(input.value).toBe(`hello\n  world\nhello`)
    })

    it('dedents tab-indented text on Shift+Tab', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '\thello\n\t\tworld\n\thello')
      await user.type(input, '{Shift>}{Tab}{/Shift}', {initialSelectionStart: 3, initialSelectionEnd: 22})
      expect(input.value).toBe(`hello\n\tworld\nhello`)
    })

    it('does not indent if no text is selected', async () => {
      const {getInput, user} = await render(<UncontrolledEditor />)
      const input = getInput()
      await user.type(input, '  hello\n    world\n  hello{Tab}')
      expect(input.value).toBe(`  hello\n    world\n  hello`)
      expect(input).not.toHaveFocus()
    })
  })

  describe('file attachment', () => {
    const imageFile = (name: string) => new File(['foo'], `${name}.png`, {type: 'image/png'})

    const mockUrl = (file: File) => `https://example.com/${encodeURIComponent(file.name)}`

    const mockUploadFile = async (file: File) => ({file, url: mockUrl(file)})

    describe('upload button', () => {
      it('is not rendered by default', async () => {
        const {queryForUploadButton} = await render(<UncontrolledEditor />)
        expect(queryForUploadButton()).not.toBeInTheDocument()
      })

      it('is rendered when a file upload handler is provided', async () => {
        const {queryForUploadButton} = await render(<UncontrolledEditor onUploadFile={mockUploadFile} />)
        expect(queryForUploadButton()).toBeInTheDocument()
      })

      it('is hidden in preview mode', async () => {
        const {queryForUploadButton} = await render(<UncontrolledEditor viewMode="preview" />)
        expect(queryForUploadButton()).not.toBeInTheDocument()
      })

      it('shows drop message on drag over', async () => {
        const {queryForUploadButton, getInput} = await render(<UncontrolledEditor onUploadFile={mockUploadFile} />)
        const input = getInput()
        const button = queryForUploadButton()

        fireEvent.dragEnter(input, {dataTransfer: {items: [{kind: 'file'}]}})
        expect(button).toHaveTextContent('Drop to add files')
        fireEvent.dragLeave(input)
        expect(button).not.toHaveTextContent('Drop to add files')
      })

      // Can't test clicking it and selecting a file because there's not a real file select dialog we can interact with
    })

    describe.each<['drop' | 'paste', string]>([
      ['drop', 'dataTransfer'],
      ['paste', 'clipboardData']
    ])('selecting files by %s', (method, dataKey) => {
      const expectFilesToBeAdded = async (onChangeMock: jest.Mock, ...files: Array<File>) => {
        for (const file of files) {
          await waitFor(() =>
            expect(onChangeMock).toHaveBeenCalledWith(expect.stringContaining(`Uploading "${file.name}"...`))
          )
        }

        for (const file of files) {
          await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(expect.stringContaining(mockUrl(file))))
        }
      }

      // eslint-disable-next-line jest/expect-expect
      it('can add a single file', async () => {
        const onChange = jest.fn()
        const {getInput} = await render(<UncontrolledEditor onUploadFile={mockUploadFile} onChange={onChange} />)
        const input = getInput()

        const file = imageFile('example')
        fireEvent[method](input, {[dataKey]: {files: [file], types: ['Files']}})

        await expectFilesToBeAdded(onChange, file)
      })

      // eslint-disable-next-line jest/expect-expect
      it('can add multiple files', async () => {
        const onChange = jest.fn()
        const {getInput} = await render(<UncontrolledEditor onUploadFile={mockUploadFile} onChange={onChange} />)
        const input = getInput()

        const fileA = imageFile('a')
        const fileB = imageFile('b')
        fireEvent[method](input, {[dataKey]: {files: [fileA, fileB], types: ['Files']}})

        await expectFilesToBeAdded(onChange, fileA, fileB)
      })

      it('rejects disallows file types while accepting allowed ones', async () => {
        const onChange = jest.fn()
        const {getInput, getFooter} = await render(
          <UncontrolledEditor onUploadFile={mockUploadFile} onChange={onChange} acceptedFileTypes={['image/*']} />
        )
        const input = getInput()

        const fileA = new File(['foo'], 'a.app', {type: 'application/app'})
        const fileB = imageFile('b')
        fireEvent[method](input, {[dataKey]: {files: [fileA, fileB], types: ['Files']}})

        await expectFilesToBeAdded(onChange, fileB)

        expect(getFooter()).toHaveTextContent(expect.stringContaining('File type not allowed: .app'))
      })
    })
  })
})

import {DiffAddedIcon} from '@primer/octicons-react'
import {fireEvent, render as _render, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, {forwardRef, useState} from 'react'
import MarkdownEditor, {
  Emoji,
  MarkdownEditorHandle,
  MarkdownEditorProps,
  Mentionable,
  Reference
} from '../MarkdownEditor'
import ThemeProvider from '../ThemeProvider'

type UncontrolledEditorProps = Omit<MarkdownEditorProps, 'value' | 'onChange' | 'onRenderPreview' | 'children'> &
  Partial<Pick<MarkdownEditorProps, 'onChange' | 'onRenderPreview' | 'children'>> & {
    hideLabel?: boolean
  }

const UncontrolledEditor = forwardRef<MarkdownEditorHandle, UncontrolledEditorProps>((props, forwardedRef) => {
  const [value, setValue] = useState('')

  const handleChange = (v: string) => {
    props.onChange?.(v)
    setValue(v)
  }

  const onRenderPreview = async () => 'Preview'

  return (
    <ThemeProvider>
      <MarkdownEditor
        ref={forwardedRef}
        onRenderPreview={onRenderPreview}
        {...props}
        value={value}
        onChange={handleChange}
      >
        <MarkdownEditor.Label visuallyHidden={props.hideLabel}>Test Editor</MarkdownEditor.Label>

        {props.children}
      </MarkdownEditor>
    </ThemeProvider>
  )
})

const render = async (ui: React.ReactElement) => {
  const result = _render(ui)
  const user = userEvent.setup()

  const getInput = () => result.getByRole('textbox') as HTMLTextAreaElement

  const getToolbar = () => result.getByRole('toolbar')

  const getFooter = () => result.getByRole('contentinfo')

  const getToolbarButton = (label: string) => within(getToolbar()).getByRole('button', {name: label})

  const getActionButton = (label: string) => within(getFooter()).getByRole('button', {name: label})

  const getViewSwitch = () => {
    const button = result.queryByRole('button', {name: 'Preview'}) || result.queryByRole('button', {name: 'Edit'})
    if (!button) throw new Error('View switch button not found')
    return button
  }

  const queryForPreview = () =>
    result.queryByRole('heading', {name: 'Rendered Markdown Preview'})?.parentElement ?? null

  const getPreview = () => result.getByRole('heading', {name: 'Rendered Markdown Preview'}).parentElement!

  const getEditorContainer = () => result.getByRole('group')

  const queryForUploadButton = () =>
    result.queryByRole('button', {name: 'Add files'}) ||
    result.queryByRole('button', {name: 'Paste, drop, or click to add files'})

  const queryForSuggestionsList = () => result.queryByRole('listbox')

  const getSuggestionsList = () => result.getByRole('listbox')

  const getAllSuggestions = () => within(getSuggestionsList()).queryAllByRole('option')

  // Wait for the double render caused by slots to complete
  await waitFor(() => result.getByText('Test Editor'))

  return {
    ...result,
    getInput,
    getToolbar,
    getToolbarButton,
    user,
    queryForUploadButton,
    getFooter,
    getViewSwitch,
    getPreview,
    queryForPreview,
    getActionButton,
    getEditorContainer,
    queryForSuggestionsList,
    getAllSuggestions
  }
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

  it('forwards imperative handle ref', async () => {
    const ref: React.RefObject<MarkdownEditorHandle> = {current: null}
    const {getInput} = await render(<UncontrolledEditor ref={ref} />)

    ref.current?.focus()
    expect(getInput()).toHaveFocus()
  })

  it('enables the textarea by default', async () => {
    const {getInput} = await render(<UncontrolledEditor />)
    expect(getInput()).not.toBeDisabled()
  })

  it('disables the textarea when disabled', async () => {
    const {getInput} = await render(<UncontrolledEditor disabled />)
    expect(getInput()).toBeDisabled()
  })

  it('aria-disables the container when disabled', async () => {
    const {getEditorContainer} = await render(<UncontrolledEditor disabled />)
    expect(getEditorContainer()).not.toBeDisabled()
    expect(getEditorContainer()).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not require the textarea by default', async () => {
    const {getInput} = await render(<UncontrolledEditor />)
    expect(getInput()).not.toHaveAttribute('required')
  })

  it('requires the textarea when required', async () => {
    const {getInput} = await render(<UncontrolledEditor required />)
    expect(getInput()).toHaveAttribute('required')
  })

  it('does not render a placeholder by default', async () => {
    const {getInput} = await render(<UncontrolledEditor />)
    expect(getInput()).not.toHaveAttribute('plceholder')
  })

  it('renders the placeholder', async () => {
    const {getInput} = await render(<UncontrolledEditor placeholder="Test placeholder" />)
    expect(getInput()).toHaveAttribute('placeholder', 'Test placeholder')
  })

  it('sets the textarea name when provided', async () => {
    const {getInput} = await render(<UncontrolledEditor name="Name" />)
    expect(getInput()).toHaveAttribute('name', 'Name')
  })

  describe('action buttons', () => {
    it('renders custom action buttons', async () => {
      const {getActionButton} = await render(
        <UncontrolledEditor>
          <MarkdownEditor.Actions>
            <MarkdownEditor.ActionButton>Example</MarkdownEditor.ActionButton>
          </MarkdownEditor.Actions>
        </UncontrolledEditor>
      )
      expect(getActionButton('Example')).toBeInTheDocument()
    })

    it('disables custom action buttons when the editor is disabled (unless explicitly overridden)', async () => {
      const {getActionButton} = await render(
        <UncontrolledEditor disabled>
          <MarkdownEditor.Actions>
            <MarkdownEditor.ActionButton>A</MarkdownEditor.ActionButton>
            <MarkdownEditor.ActionButton disabled={false}>B</MarkdownEditor.ActionButton>
          </MarkdownEditor.Actions>
        </UncontrolledEditor>
      )

      expect(getActionButton('A')).toBeDisabled()
      expect(getActionButton('B')).not.toBeDisabled()
    })

    it('forwards action button refs', async () => {
      const ref: React.RefObject<HTMLButtonElement> = {current: null}
      await render(
        <UncontrolledEditor>
          <MarkdownEditor.Actions>
            <MarkdownEditor.ActionButton ref={ref}>Example</MarkdownEditor.ActionButton>
          </MarkdownEditor.Actions>
        </UncontrolledEditor>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('toolbar', () => {
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

    it('forwards custom toolbar button refs', async () => {
      const ref: React.RefObject<HTMLButtonElement> = {current: null}
      await render(
        <UncontrolledEditor>
          <MarkdownEditor.Toolbar>
            <MarkdownEditor.ToolbarButton ref={ref} icon={DiffAddedIcon} aria-label="Test Button" />
          </MarkdownEditor.Toolbar>
        </UncontrolledEditor>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
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

    it('disables buttons when editor is disabled (unless explicitly overridden)', async () => {
      const {getToolbarButton} = await render(
        <UncontrolledEditor disabled>
          <MarkdownEditor.Toolbar>
            <MarkdownEditor.ToolbarButton aria-label="Test Button A" icon={DiffAddedIcon} />
            <MarkdownEditor.ToolbarButton aria-label="Test Button B" icon={DiffAddedIcon} disabled={false} />
            <MarkdownEditor.DefaultToolbarButtons />
          </MarkdownEditor.Toolbar>
        </UncontrolledEditor>
      )

      const a = getToolbarButton('Test Button A')
      const b = getToolbarButton('Test Button B')
      const bold = getToolbarButton('Bold (Ctrl + B)')

      expect(a).toBeDisabled()
      expect(b).not.toBeDisabled()
      expect(bold).toBeDisabled()
    })

    describe('keyboard navigation', () => {
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

      it('is disabled when editor is disabled', async () => {
        const {queryForUploadButton} = await render(<UncontrolledEditor onUploadFile={mockUploadFile} disabled />)
        expect(queryForUploadButton()).toBeDisabled()
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

        expect(getFooter()).toHaveTextContent('File type not allowed: .app')
      })

      it('inserts "failed to upload" note on failure', async () => {
        const onChange = jest.fn()
        const {getInput} = await render(
          <UncontrolledEditor
            onUploadFile={async () => {
              throw new Error()
            }}
            onChange={onChange}
            acceptedFileTypes={['image/*']}
          />
        )

        const input = getInput()

        const file = imageFile('example')
        fireEvent[method](input, {[dataKey]: {files: [file], types: ['Files']}})

        await waitFor(() =>
          expect(onChange).toHaveBeenCalledWith(expect.stringContaining(`Failed to upload "${file.name}"`))
        )
      })
    })
  })

  describe('preview', () => {
    it('renders the preview when the editor is in preview mode', async () => {
      const {queryForPreview} = await render(<UncontrolledEditor viewMode="preview" />)
      expect(queryForPreview()).toBeInTheDocument()
    })

    it('does not render the preview when the editor is in edit mode', async () => {
      const {queryForPreview} = await render(<UncontrolledEditor viewMode="edit" />)
      expect(queryForPreview()).not.toBeInTheDocument()
    })

    it('automatically handles view modes when view mode is uncontrolled', async () => {
      const {getViewSwitch, queryForPreview, user} = await render(<UncontrolledEditor />)
      const viewSwitch = getViewSwitch()
      expect(queryForPreview()).not.toBeInTheDocument()
      user.click(viewSwitch)
      await waitFor(() => expect(queryForPreview()).toBeInTheDocument())
      user.click(viewSwitch)
      await waitFor(() => expect(queryForPreview()).not.toBeInTheDocument())
    })

    it('calls view mode change handler without automatically changing the view when the button is clicked and viewMode is controlled', async () => {
      const onViewModeChange = jest.fn()
      const {getViewSwitch, queryForPreview} = await render(
        <UncontrolledEditor viewMode="edit" onChangeViewMode={onViewModeChange} />
      )
      fireEvent.click(getViewSwitch())
      expect(onViewModeChange).toHaveBeenCalledWith('preview')
      expect(queryForPreview()).not.toBeInTheDocument()
    })

    it('does not disable the preview button when the editor is disabled', async () => {
      const {getViewSwitch} = await render(<UncontrolledEditor disabled />)
      expect(getViewSwitch()).not.toBeDisabled()
    })

    describe('fetching', () => {
      it('prefetches the preview when the view switch is focused', async () => {
        const renderPreviewMock = jest.fn()
        const {getViewSwitch} = await render(<UncontrolledEditor onRenderPreview={renderPreviewMock} />)
        fireEvent.focus(getViewSwitch())
        expect(renderPreviewMock).toHaveBeenCalled()
      })

      it('prefetches the preview when the view switch is hovered over', async () => {
        const renderPreviewMock = jest.fn()
        const {getViewSwitch, user} = await render(<UncontrolledEditor onRenderPreview={renderPreviewMock} />)
        await user.hover(getViewSwitch())
        expect(renderPreviewMock).toHaveBeenCalled()
      })

      it('does not refetch the preview until the fetched preview is stale', async () => {
        const renderPreviewMock = jest.fn()
        const {getViewSwitch, user, getInput} = await render(<UncontrolledEditor onRenderPreview={renderPreviewMock} />)
        await user.hover(getViewSwitch())
        await user.hover(getViewSwitch())
        expect(renderPreviewMock).toHaveBeenCalledTimes(1)

        await user.type(getInput(), 'hello world')
        await user.hover(getViewSwitch())
        expect(renderPreviewMock).toHaveBeenCalledTimes(2)
      })

      it('fetches the preview when the `viewMode` prop is changed externally', async () => {
        const renderPreviewMock = jest.fn()
        const {rerender} = await render(<UncontrolledEditor onRenderPreview={renderPreviewMock} viewMode="edit" />)
        rerender(<UncontrolledEditor onRenderPreview={renderPreviewMock} viewMode="preview" />)
        expect(renderPreviewMock).toHaveBeenCalledTimes(1)
        rerender(<UncontrolledEditor onRenderPreview={renderPreviewMock} viewMode="edit" />)
        expect(renderPreviewMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('rendering', () => {
      it('does not enable checkboxes in rendered preview', async () => {
        // eslint-disable-next-line github/unescaped-html-literal
        const html = '<input type="checkbox" class="task-list-item-checkbox" disabled />'
        const {getPreview} = await render(<UncontrolledEditor onRenderPreview={async () => html} viewMode="preview" />)
        const checkbox = await waitFor(() => within(getPreview()).getByRole('checkbox'))
        expect(checkbox).toBeDisabled()
      })

      it('forces links to open in a new tab', async () => {
        // eslint-disable-next-line github/unescaped-html-literal
        const html = '<a href="https://example.com">Link</a>'
        const {getPreview} = await render(<UncontrolledEditor onRenderPreview={async () => html} viewMode="preview" />)
        const link = await waitFor(() => within(getPreview()).getByText('Link'))
        expect(link).toHaveAttribute('target', '_blank')
      })
    })
  })

  describe('accessible labelling', () => {
    it('renders editor as a labelled group', async () => {
      const {getEditorContainer} = await render(<UncontrolledEditor />)

      const container = getEditorContainer()
      expect(container).toBeInstanceOf(HTMLFieldSetElement)
      expect(container).toHaveAccessibleName('Test Editor')
    })

    it('hides, but still renders, the label when hidden', async () => {
      const {getByText, getEditorContainer} = await render(<UncontrolledEditor hideLabel />)

      const container = getEditorContainer()
      expect(container).toHaveAccessibleName('Test Editor')

      const legend = getByText('Test Editor')
      expect(legend).toHaveStyle('clip: rect(0,0,0,0)')
    })

    it('labels the main input', async () => {
      const {getInput} = await render(<UncontrolledEditor />)
      expect(getInput()).toHaveAccessibleName('Markdown value')
    })

    it('labels the toolbar', async () => {
      const {getToolbar} = await render(<UncontrolledEditor />)
      expect(getToolbar()).toHaveAccessibleName('Formatting tools')
    })

    it('labels all the default formatting buttons', async () => {
      const {getToolbar} = await render(<UncontrolledEditor />)
      const buttons = within(getToolbar()).getAllByRole('button')
      for (const button of buttons) expect(button).toHaveAccessibleName()
    })

    it('renders and updates the accessible description when changing from view to edit mode', async () => {
      const {getEditorContainer, rerender} = await render(<UncontrolledEditor viewMode="edit" />)
      expect(getEditorContainer()).toHaveAccessibleDescription('Markdown input: edit mode selected.')

      rerender(<UncontrolledEditor viewMode="preview" />)

      expect(getEditorContainer()).toHaveAccessibleDescription('Markdown input: preview mode selected.')
    })

    it('appends any custom describedby IDs to the default set', async () => {
      const {getEditorContainer} = await render(
        <>
          <p id="example-description">Example description.</p>
          <UncontrolledEditor viewMode="edit" aria-describedby="example-description" />
        </>
      )

      const container = getEditorContainer()
      expect(container).toHaveAccessibleDescription('Markdown input: edit mode selected. Example description.')
    })
  })

  describe('suggestions', () => {
    // we don't test filtering logic here because that's up to the consumer

    const emojis: Emoji[] = [
      {name: '+1', character: '👍'},
      {name: '-1', character: '👎'},
      {name: 'heart', character: '❤️'},
      {name: 'wave', character: '👋'},
      {name: 'raised_hands', character: '🙌'}
    ]

    const mentionables: Mentionable[] = [
      {identifier: 'monalisa', description: 'Monalisa Octocat'},
      {identifier: 'github', description: 'GitHub'},
      {identifier: 'primer', description: 'Primer'},
      {identifier: 'actions', description: 'Actions'},
      {identifier: 'primer-css', description: 'primer-css'}
    ]

    const references: Reference[] = [
      {id: '1', titleText: 'Add logging functionality', titleHtml: 'Add logging functionality'},
      {
        id: '2',
        titleText: 'Error: `Failed to install` when installing',
        titleHtml: 'Error: <code>Failed to install</code> when installing'
      },
      {id: '3', titleText: 'Add error-handling functionality', titleHtml: 'Add error-handling functionality'},
      {id: '4', titleText: 'Add a new function', titleHtml: 'Add a new function'},
      {id: '5', titleText: 'Fails to exit gracefully', titleHtml: 'Fails to exit gracefully'}
    ]

    const EditorWithSuggestions = () => (
      <UncontrolledEditor
        onSuggestEmojis={() => emojis}
        onSuggestMentions={() => mentionables}
        onSuggestReferences={() => references}
      />
    )

    it('does not initially show suggestions list', async () => {
      const {queryForSuggestionsList} = await render(<EditorWithSuggestions />)
      expect(queryForSuggestionsList()).not.toBeInTheDocument()
    })

    describe.each([
      [':', emojis[0].character],
      ['@', `@${mentionables[0].identifier}`],
      ['#', `#${references[0].id}`]
    ])('%s-suggestions', (triggerChar, first) => {
      it('does not show suggestions when no handler is defined', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<UncontrolledEditor />)
        await user.type(getInput(), `hello ${triggerChar}`)
        expect(queryForSuggestionsList()).not.toBeInTheDocument()
      })

      it('shows suggestions when trigger character typed', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<EditorWithSuggestions />)
        await user.type(getInput(), `hello ${triggerChar}`)
        expect(queryForSuggestionsList()).toBeInTheDocument()
      })

      it('immediately renders suggestion items given synchronous handlers', async () => {
        const {getAllSuggestions, getInput, user} = await render(<EditorWithSuggestions />)
        await user.type(getInput(), `hello ${triggerChar}`)
        expect(getAllSuggestions()).toHaveLength(5)
      })

      it('shows suggestions when the trigger character is the first character in the input', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<EditorWithSuggestions />)
        await user.type(getInput(), `${triggerChar}`)
        expect(queryForSuggestionsList()).toBeInTheDocument()
      })

      it('shows suggestions when the trigger character is the first character in the line', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<EditorWithSuggestions />)
        await user.type(getInput(), `hello\n${triggerChar}`)
        expect(queryForSuggestionsList()).toBeInTheDocument()
      })

      it('does not show suggestions if there is no whitespace before the suggestion', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<EditorWithSuggestions />)
        await user.type(getInput(), `hello${triggerChar}`)
        expect(queryForSuggestionsList()).not.toBeInTheDocument()
      })

      it('does not show suggestions when there is a space immediately after the trigger', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<UncontrolledEditor />)
        // especially important for # suggestions since they are multiword
        await user.type(getInput(), `${triggerChar} `)
        expect(queryForSuggestionsList()).not.toBeInTheDocument()
      })

      it('hides suggestions on Escape', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<EditorWithSuggestions />)

        await user.type(getInput(), `hello ${triggerChar}`)
        expect(queryForSuggestionsList()).toBeInTheDocument()

        await user.keyboard('{Escape}')
        expect(queryForSuggestionsList()).not.toBeInTheDocument()
      })

      it('hides suggestions on blur', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<EditorWithSuggestions />)

        const input = getInput()
        await user.type(input, `hello ${triggerChar}`)
        expect(queryForSuggestionsList()).toBeInTheDocument()

        // eslint-disable-next-line github/no-blur
        input.blur()
        expect(queryForSuggestionsList()).not.toBeInTheDocument()
      })

      it('hides suggestions when trigger key is deleted', async () => {
        const {queryForSuggestionsList, getInput, user} = await render(<EditorWithSuggestions />)

        const input = getInput()
        await user.type(input, `hello ${triggerChar}`)
        expect(queryForSuggestionsList()).toBeInTheDocument()

        await user.keyboard('{Backspace}')
        expect(queryForSuggestionsList()).not.toBeInTheDocument()
      })

      it.each(['Enter', 'Tab'])('applies suggestion and hides list on %s-press', async key => {
        const {queryForSuggestionsList, getInput, user} = await render(<EditorWithSuggestions />)

        const input = getInput()
        await user.type(input, `hello ${triggerChar}`)
        expect(queryForSuggestionsList()).toBeInTheDocument()

        await user.keyboard(`{${key}}`)
        expect(queryForSuggestionsList()).not.toBeInTheDocument()
        expect(input.value).toBe(`hello ${first} `) // suggestions are inserted with a following space
      })
    })
  })
})

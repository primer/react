import React from 'react'
import {Field} from '@base-ui/react/field'
import {cleanup, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Checkbox} from '../Checkbox'
import {Radio} from '../Radio'
import {RadioGroup} from '../RadioGroup'
import {Select} from '../Select'
import {Textarea} from '../Textarea'
import {TextInput} from '../TextInput'
import {ToggleSwitch} from '../ToggleSwitch'
import {FormControl, useFormControlForwardedProps} from './index'

afterEach(cleanup)

describe('FormControl', () => {
  it.each([undefined, 'script'])(
    'keeps a nonnative label connected without forwarding explicit or inferred htmlFor (%s)',
    async htmlFor => {
      const user = userEvent.setup()
      const ref = React.createRef<HTMLSpanElement>()
      render(
        <>
          <button type="button">Before</button>
          <FormControl id="script">
            <FormControl.Label id="script-label" ref={ref} render={<span />} nativeLabel={false} htmlFor={htmlFor}>
              Script
            </FormControl.Label>
            <FormControl.Control aria-labelledby="script-label" />
            <FormControl.Caption>Enter a script</FormControl.Caption>
          </FormControl>
          <button type="button">After</button>
        </>,
      )
      const label = screen.getByText('Script')
      const input = screen.getByRole('textbox', {name: 'Script'})
      expect(label.tagName).toBe('SPAN')
      expect(label).toBe(ref.current)
      expect(label).toHaveAttribute('data-component', 'FormControl.Label')
      expect(label).not.toHaveAttribute('for')
      expect(input).toHaveAccessibleDescription('Enter a script')
      await user.click(label)
      expect(input).toHaveFocus()
      screen.getByRole('button', {name: 'Before'}).focus()
      await user.tab()
      expect(input).toHaveFocus()
      await user.tab()
      expect(screen.getByRole('button', {name: 'After'})).toHaveFocus()
    },
  )

  it('preserves manually authored external-control references with a nonnative label', () => {
    render(
      <FormControl id="script">
        <FormControl.Label id="script-label" render={<span />} nativeLabel={false} htmlFor="script">
          Script
        </FormControl.Label>
        <textarea id="script" aria-labelledby="script-label" aria-describedby="script-help" />
        <FormControl.Caption id="script-help">Enter a script</FormControl.Caption>
      </FormControl>,
    )
    expect(screen.getByText('Script')).not.toHaveAttribute('for')
    expect(screen.getByRole('textbox', {name: 'Script'})).toHaveAccessibleDescription('Enter a script')
  })

  it('keeps htmlFor on native labels', () => {
    render(
      <FormControl id="script">
        <FormControl.Label htmlFor="script">Script</FormControl.Label>
        <textarea id="script" />
      </FormControl>,
    )
    expect(screen.getByText('Script').tagName).toBe('LABEL')
    expect(screen.getByText('Script')).toHaveAttribute('for', 'script')
    expect(screen.getByRole('textbox', {name: 'Script'})).toBeVisible()
  })

  it('renders standalone error and success messages without a field and preserves their props and refs', () => {
    const ref = React.createRef<HTMLDivElement>()
    const message = (variant: 'error' | 'success') => (
      <FormControl.Validation
        ref={ref}
        id="standalone-validation"
        variant={variant}
        className="consumer-validation"
        style={{marginTop: 8}}
        data-testid="validation"
      >
        Suggestion could not be applied.
      </FormControl.Validation>
    )
    const {rerender} = render(message('error'))
    const validation = screen.getByTestId('validation')
    expect(ref.current).toBe(validation)
    expect(validation).toHaveAttribute('id', 'standalone-validation')
    expect(validation).toHaveClass('consumer-validation', 'primer:text-danger')
    expect(validation).toHaveStyle({marginTop: '8px'})
    expect(validation).toHaveAttribute('data-variant', 'error')
    expect(validation).not.toHaveAttribute('role')
    expect(validation).not.toHaveAttribute('aria-live')
    expect(validation).toHaveTextContent('Suggestion could not be applied.')
    expect(validation.querySelector('svg')?.closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true')

    rerender(message('success'))
    expect(ref.current).toBe(validation)
    expect(screen.getByRole('status')).toBe(validation)
    expect(validation).toHaveClass('primer:text-success')
    expect(validation).not.toHaveClass('primer:text-danger')
    rerender(message('error'))
    expect(ref.current).toBe(validation)
    expect(validation).not.toHaveAttribute('role')
  })

  it('preserves explicit standalone announcements and does not create an orphan field id', () => {
    render(
      <FormControl.Validation variant="error" role="alert" aria-live="assertive">
        Suggestion could not be applied.
      </FormControl.Validation>,
    )
    const validation = screen.getByRole('alert')
    expect(validation).toHaveAttribute('aria-live', 'assertive')
    expect(validation).not.toHaveAttribute('id')
  })

  it('hydrates a standalone error associated with an external editor without changing its DOM', () => {
    const example = (
      <>
        <label htmlFor="suggestion">Suggestion</label>
        <textarea id="suggestion" aria-invalid="true" aria-describedby="suggestion-error" />
        <FormControl.Validation id="suggestion-error" variant="error">
          Suggestion could not be applied.
        </FormControl.Validation>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(example)
    document.body.appendChild(container)
    const validation = container.querySelector('#suggestion-error')
    render(example, {container, hydrate: true})
    expect(container.querySelector('#suggestion-error')).toBe(validation)
    expect(screen.getByRole('textbox', {name: 'Suggestion'})).toHaveAccessibleDescription(
      'Suggestion could not be applied.',
    )
  })

  it('registers and removes nested errors with a raw Base UI field without replacing its control', async () => {
    const user = userEvent.setup()
    const example = (invalid: boolean) => (
      <Field.Root invalid={invalid}>
        <Field.Label>Repository</Field.Label>
        <Field.Control defaultValue="primer/react" />
        <Field.Description>Use an owner and repository.</Field.Description>
        {invalid ? (
          <FormControl.Validation id="raw-field-error" variant="error">
            Enter a valid repository.
          </FormControl.Validation>
        ) : null}
      </Field.Root>
    )
    const {rerender} = render(example(true))
    const control = screen.getByRole('textbox', {name: 'Repository'})
    await user.click(control)
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAccessibleDescription('Use an owner and repository. Enter a valid repository.')
    rerender(example(false))
    expect(screen.getByRole('textbox', {name: 'Repository'})).toBe(control)
    expect(control).toHaveFocus()
    expect(control).toHaveValue('primer/react')
    expect(control).not.toHaveAttribute('aria-invalid')
    expect(control).toHaveAccessibleDescription('Use an owner and repository.')
    expect(control).not.toHaveAttribute('aria-describedby', expect.stringContaining('raw-field-error'))
  })

  it('associates composable labels and native Field.Control while forwarding rest props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    render(
      <form>
        <FormControl ref={ref} data-testid="field">
          <FormControl.Label>Repository</FormControl.Label>
          <FormControl.Control name="repository" />
        </FormControl>
      </form>,
    )
    await user.type(screen.getByLabelText('Repository'), 'primer/react')
    expect(ref.current).toBe(screen.getByTestId('field'))
    expect(new FormData(screen.getByTestId('field').closest('form')!).get('repository')).toBe('primer/react')
  })

  it('associates a native control with its label, required state, and descriptions', async () => {
    const user = userEvent.setup()
    render(
      <FormControl id="repository" required>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
        <FormControl.Caption>Use the owner and repository name.</FormControl.Caption>
        <FormControl.Validation variant="error">Enter a repository.</FormControl.Validation>
      </FormControl>,
    )

    const control = screen.getByRole('textbox')
    const label = screen.getByText('Repository').closest('label')
    expect(label?.control).toBe(control)
    expect(control).toBeRequired()
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAccessibleDescription('Enter a repository. Use the owner and repository name.')
    await user.click(screen.getByText('Repository'))
    expect(control).toHaveFocus()
  })

  const missingDescriptionRegions: Array<[string, (key: string) => React.ReactNode]> = [
    ['false', () => false],
    ['an empty array', () => []],
    ['an empty fragment', key => <React.Fragment key={key} />],
  ]

  it.each(missingDescriptionRegions)(
    'does not reference a missing description for %s region props',
    (_name, region) => {
      render(
        <FormControl id="field" caption={region('caption')} validation={region('validation')}>
          <FormControl.Label>Repository</FormControl.Label>
          <FormControl.Control />
          <FormControl.Caption>Previous caption</FormControl.Caption>
          <FormControl.Validation variant="error">Previous error</FormControl.Validation>
        </FormControl>,
      )

      expect(screen.getByRole('textbox', {name: 'Repository'})).not.toHaveAttribute('aria-describedby')
      expect(screen.queryByText('Previous caption')).not.toBeInTheDocument()
      expect(screen.queryByText('Previous error')).not.toBeInTheDocument()
    },
  )

  it('associates plain text and native region elements without explicit ids', () => {
    render(
      <FormControl id="field" caption="Help text" validation={<span>Error text</span>}>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
      </FormControl>,
    )

    const control = screen.getByRole('textbox', {name: 'Repository'})
    expect(control).toHaveAttribute('aria-describedby', 'field-validation field-caption')
    expect(control).toHaveAccessibleDescription('Error text Help text')
  })

  it('associates a single native region inside a fragment', () => {
    render(
      <FormControl
        id="field"
        caption={
          <>
            <span>Help text</span>
          </>
        }
      >
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
      </FormControl>,
    )

    const control = screen.getByRole('textbox', {name: 'Repository'})
    expect(control).toHaveAttribute('aria-describedby', 'field-caption')
    expect(control).toHaveAccessibleDescription('Help text')
  })

  it('associates custom native region elements that provide ids', () => {
    render(
      <FormControl
        caption={<span id="custom-caption">Help text</span>}
        validation={<span id="custom-validation">Error text</span>}
      >
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
      </FormControl>,
    )

    const control = screen.getByRole('textbox', {name: 'Repository'})
    expect(control).toHaveAttribute('aria-describedby', 'custom-validation custom-caption')
    expect(control).toHaveAccessibleDescription('Error text Help text')
  })

  it('associates parts inside native region wrappers without duplicating ids', () => {
    render(
      <FormControl
        id="field"
        caption={
          <div>
            {/* eslint-disable-next-line primer-react/direct-slot-children */}
            <FormControl.Caption>Help text</FormControl.Caption>
          </div>
        }
      >
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
      </FormControl>,
    )

    expect(screen.getByRole('textbox', {name: 'Repository'})).toHaveAccessibleDescription('Help text')
    expect(document.querySelectorAll('[id="field-caption"]')).toHaveLength(1)
  })

  it('uses a control-specific id and preserves explicit control props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <FormControl id="field-id" required>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control ref={ref} id="control-id" required={false} aria-invalid={false} />
        <FormControl.Caption id="help-id">Help text</FormControl.Caption>
        <FormControl.Validation id="error-id" variant="error">
          Error text
        </FormControl.Validation>
      </FormControl>,
    )

    const control = screen.getByRole('textbox')
    expect(ref.current).toBe(control)
    expect(control).toHaveAttribute('id', 'control-id')
    expect(screen.getByText('Repository').closest('label')?.control).toBe(control)
    expect(control).not.toBeRequired()
    expect(control).toHaveAttribute('aria-invalid', 'false')
    expect(control).toHaveAccessibleDescription('Error text Help text')
  })

  it.each([
    ['text input', <TextInput key="text" id="child-id" />],
    ['textarea', <Textarea key="textarea" id="child-id" />],
    [
      'select',
      <Select key="select" id="child-id">
        <Select.Option value="public">Public</Select.Option>
      </Select>,
    ],
    ['checkbox', <Checkbox key="checkbox" id="child-id" />],
    ['switch', <ToggleSwitch key="switch" id="child-id" />],
  ])('associates the label with a %s that specifies its own id', (_name, child) => {
    render(
      <FormControl id="field-id">
        <FormControl.Label>Field label</FormControl.Label>
        {child}
        <FormControl.Caption>Help text</FormControl.Caption>
      </FormControl>,
    )

    const label = screen.getByText('Field label').closest('label')
    expect(label?.control).toHaveAttribute('id', 'child-id')
  })

  it('uses the explicit id of a package control inside a DOM wrapper', () => {
    render(
      <FormControl id="field-id">
        <FormControl.Label>Repository</FormControl.Label>
        <div>
          <TextInput id="child-id" />
        </div>
        <FormControl.Caption>Help text</FormControl.Caption>
      </FormControl>,
    )

    const control = screen.getByRole('textbox', {name: 'Repository'})
    expect(control).toHaveAttribute('id', 'child-id')
    expect(screen.getByText('Repository').closest('label')?.control).toBe(control)
    expect(control).toHaveAccessibleDescription('Help text')
  })

  it('associates a radio label with the control-specific id', () => {
    render(
      <RadioGroup name="options">
        <RadioGroup.Label>Options</RadioGroup.Label>
        <FormControl id="field-id">
          <FormControl.Label>Option</FormControl.Label>
          <Radio id="child-id" value="one" />
        </FormControl>
      </RadioGroup>,
    )

    expect(screen.getByText('Option').closest('label')?.control).toHaveAttribute('id', 'child-id')
  })

  it('activates the associated switch through its label', async () => {
    const user = userEvent.setup()
    render(
      <FormControl id="field-id">
        <FormControl.Label>Enabled</FormControl.Label>
        <ToggleSwitch />
      </FormControl>,
    )

    const control = screen.getByRole('switch', {name: 'Enabled'})
    expect(control).not.toBeChecked()
    await user.click(screen.getByText('Enabled'))
    expect(control).toBeChecked()
  })

  it('hydrates a native label and control without changing their association', () => {
    const field = (
      <FormControl required>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
        <FormControl.Caption>Help text</FormControl.Caption>
      </FormControl>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)
    const label = container.querySelector('label')
    const control = container.querySelector('input')

    expect(label?.control).toBe(control)
    render(field, {container, hydrate: true})
    expect(label?.control).toBe(control)
    expect(control).toHaveAccessibleDescription('Help text')
  })

  it('preserves valid custom description references through hydration', () => {
    const field = (
      <FormControl id="field" caption="Help text" validation={<span id="custom-error">Error text</span>}>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
      </FormControl>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)
    const control = within(container).getByRole('textbox', {name: 'Repository'})

    expect(control).toHaveAttribute('aria-describedby', 'custom-error field-caption')
    expect(control).toHaveAccessibleDescription('Error text Help text')
    render(field, {container, hydrate: true})
    expect(control).toHaveAttribute('aria-describedby', 'custom-error field-caption')
    expect(control).toHaveAccessibleDescription('Error text Help text')
  })

  it('names Base UI choice controls in server-rendered HTML before hydration', () => {
    const field = (
      <>
        <FormControl id="checkbox-field">
          <FormControl.Label>Checkbox label</FormControl.Label>
          <Checkbox />
        </FormControl>
        <FormControl id="switch-field">
          <FormControl.Label>Switch label</FormControl.Label>
          <ToggleSwitch />
        </FormControl>
        <RadioGroup name="options">
          <RadioGroup.Label>Options</RadioGroup.Label>
          <FormControl id="radio-field">
            <FormControl.Label>Radio label</FormControl.Label>
            <Radio value="one" />
          </FormControl>
        </RadioGroup>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)

    try {
      expect(within(container).getByRole('checkbox')).toHaveAccessibleName('Checkbox label')
      expect(within(container).getByRole('switch')).toHaveAccessibleName('Switch label')
      expect(within(container).getByRole('radio')).toHaveAccessibleName('Radio label')
      render(field, {container, hydrate: true})
      expect(within(container).getByRole('checkbox')).toHaveAccessibleName('Checkbox label')
      expect(within(container).getByRole('switch')).toHaveAccessibleName('Switch label')
      expect(within(container).getByRole('radio')).toHaveAccessibleName('Radio label')
    } finally {
      container.remove()
    }
  })

  it('preserves explicit choice-control labels before and after hydration', () => {
    const field = (
      <>
        <span id="checkbox-name">Checkbox label with context</span>
        <span id="switch-name">Switch label with context</span>
        <span id="radio-name">Radio label with context</span>
        <FormControl>
          <FormControl.Label>Checkbox label</FormControl.Label>
          <Checkbox aria-labelledby="checkbox-name" />
        </FormControl>
        <FormControl>
          <FormControl.Label>Switch label</FormControl.Label>
          <ToggleSwitch aria-labelledby="switch-name" />
        </FormControl>
        <RadioGroup name="options">
          <RadioGroup.Label>Options</RadioGroup.Label>
          <FormControl>
            <FormControl.Label>Radio label</FormControl.Label>
            <Radio aria-labelledby="radio-name" value="one" />
          </FormControl>
        </RadioGroup>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)

    try {
      const assertNames = () => {
        expect(within(container).getByRole('checkbox')).toHaveAccessibleName('Checkbox label with context')
        expect(within(container).getByRole('switch')).toHaveAccessibleName('Switch label with context')
        expect(within(container).getByRole('radio')).toHaveAccessibleName('Radio label with context')
      }
      assertNames()
      render(field, {container, hydrate: true})
      assertNames()
    } finally {
      container.remove()
    }
  })

  it('preserves Base UI render composition, refs, handlers, and field state', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLElement>()
    const renderRef = React.createRef<HTMLTextAreaElement>()
    const onChange = vi.fn()
    const onRenderChange = vi.fn()
    const onValueChange = vi.fn()
    render(
      <FormControl id="message">
        <FormControl.Label>Message</FormControl.Label>
        <FormControl.Control
          ref={ref}
          className={({focused}) => (focused ? 'control-focused' : 'control-blurred')}
          onChange={onChange}
          onValueChange={onValueChange}
          render={<textarea ref={renderRef} rows={3} onChange={onRenderChange} />}
        />
      </FormControl>,
    )

    const control = screen.getByRole('textbox', {name: 'Message'})
    expect(control.tagName).toBe('TEXTAREA')
    expect(control).toHaveClass('control-blurred')
    expect(ref.current).toBe(control)
    expect(renderRef.current).toBe(control)
    expect(screen.getByText('Message').closest('label')?.control).toBe(control)
    await user.type(control, 'a')
    expect(control).toHaveClass('control-focused')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onRenderChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange.mock.calls[0][0]).toBe('a')
  })

  it('passes Base UI state and the associated id to a render callback', async () => {
    const user = userEvent.setup()
    render(
      <FormControl id="search">
        <FormControl.Label>Search</FormControl.Label>
        <FormControl.Control
          render={(props, state) => <input {...props} data-testid="search" data-focused={state.focused} />}
        />
      </FormControl>,
    )

    const control = screen.getByTestId('search')
    expect(control).toHaveAttribute('id', 'search')
    expect(control).toHaveAttribute('data-focused', 'false')
    await user.click(control)
    expect(control).toHaveAttribute('data-focused', 'true')
  })

  it('prefers region props over matching children, including parts in fragments', () => {
    render(
      <FormControl
        id="repository"
        label={<FormControl.Label>Preferred label</FormControl.Label>}
        caption={<FormControl.Caption id="repository-help">Preferred caption</FormControl.Caption>}
        validation={
          <FormControl.Validation id="repository-error" variant="error">
            Preferred validation
          </FormControl.Validation>
        }
        leadingVisual={<FormControl.LeadingVisual>Preferred visual</FormControl.LeadingVisual>}
      >
        <>
          <FormControl.Label>Child label</FormControl.Label>
          <FormControl.LeadingVisual>Child visual</FormControl.LeadingVisual>
          <FormControl.Caption>Child caption</FormControl.Caption>
          <FormControl.Validation variant="error">Child validation</FormControl.Validation>
        </>
        <FormControl.Control />
      </FormControl>,
    )

    for (const text of ['Child label', 'Child visual', 'Child caption', 'Child validation']) {
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    }

    const control = screen.getByRole('textbox', {name: 'Preferred label'})
    expect(screen.getByText('Preferred label').closest('label')?.control).toBe(control)
    expect(control).toHaveAccessibleDescription('Preferred validation Preferred caption')
    expect(control).toHaveAttribute('aria-describedby', 'repository-error repository-help')
    expect(screen.getByText('Preferred visual')).toBeInTheDocument()
  })

  it('associates fragment-wrapped region props with the control', () => {
    render(
      <FormControl
        label={
          <>
            <FormControl.Label id="custom-label">Notifications</FormControl.Label>
          </>
        }
        caption={
          <>
            <FormControl.Caption id="custom-caption">Choose whether to receive notifications.</FormControl.Caption>
          </>
        }
        validation={
          <>
            <FormControl.Validation id="custom-error" variant="error">
              Update your notification preference.
            </FormControl.Validation>
          </>
        }
      >
        <Checkbox />
      </FormControl>,
    )

    const control = screen.getByRole('checkbox', {name: 'Notifications'})
    expect(control).toHaveAttribute('aria-labelledby', 'custom-label')
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAttribute('aria-describedby', 'custom-error custom-caption')
    expect(control).toHaveAccessibleDescription(
      'Update your notification preference. Choose whether to receive notifications.',
    )
  })

  it('preserves a native label supplied as a region prop', () => {
    render(
      <FormControl
        id="native-input"
        label={
          <label id="native-label" htmlFor="native-input">
            Notifications
          </label>
        }
      >
        <Checkbox />
      </FormControl>,
    )

    const control = screen.getByRole('checkbox', {name: 'Notifications'})
    expect(control).toHaveAttribute('aria-labelledby', 'native-label')
  })

  it('preserves the control and its value when a region prop is added or removed', async () => {
    const user = userEvent.setup()
    const field = (override: boolean) => (
      <FormControl label={override ? <FormControl.Label>Prop label</FormControl.Label> : undefined}>
        <>
          <FormControl.Label>Child label</FormControl.Label>
          <FormControl.Control defaultValue="initial" />
        </>
      </FormControl>
    )
    const {rerender} = render(field(false))
    const control = screen.getByRole('textbox', {name: 'Child label'})
    await user.clear(control)
    await user.type(control, 'edited')

    rerender(field(true))
    expect(screen.getByRole('textbox', {name: 'Prop label'})).toBe(control)
    expect(control).toHaveValue('edited')
    expect(control).toHaveFocus()

    rerender(field(false))
    expect(screen.getByRole('textbox', {name: 'Child label'})).toBe(control)
    expect(control).toHaveValue('edited')
    expect(control).toHaveFocus()
  })

  it('replaces parts inside DOM wrappers without remounting other children', async () => {
    const user = userEvent.setup()
    const field = (override: boolean) => (
      <FormControl label={override ? <FormControl.Label>Prop label</FormControl.Label> : undefined}>
        <div>
          {/* eslint-disable-next-line primer-react/direct-slot-children */}
          <FormControl.Label>Child label</FormControl.Label>
          {}
          <FormControl.Control defaultValue="initial" />
        </div>
      </FormControl>
    )
    const {rerender} = render(field(false))
    const control = screen.getByRole('textbox', {name: 'Child label'})
    await user.clear(control)
    await user.type(control, 'edited')

    rerender(field(true))
    expect(screen.queryByText('Child label')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', {name: 'Prop label'})).toBe(control)
    expect(control).toHaveValue('edited')
    expect(control).toHaveFocus()

    rerender(field(false))
    expect(screen.getByRole('textbox', {name: 'Child label'})).toBe(control)
    expect(control).toHaveValue('edited')
    expect(control).toHaveFocus()
  })

  it('updates validation references without remounting a focused control', async () => {
    const user = userEvent.setup()
    const field = (invalid: boolean) => (
      <FormControl id="repository">
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control defaultValue="primer/react" />
        <FormControl.Caption>Use the owner and repository name.</FormControl.Caption>
        {invalid ? <FormControl.Validation variant="error">Enter a valid repository.</FormControl.Validation> : null}
      </FormControl>
    )
    const {rerender} = render(field(true))
    const control = screen.getByRole('textbox', {name: 'Repository'})
    await user.click(control)
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAccessibleDescription('Enter a valid repository. Use the owner and repository name.')

    rerender(field(false))
    expect(screen.getByRole('textbox', {name: 'Repository'})).toBe(control)
    expect(control).toHaveValue('primer/react')
    expect(control).toHaveFocus()
    expect(control).not.toHaveAttribute('aria-invalid')
    expect(control).toHaveAccessibleDescription('Use the owner and repository name.')
    expect(control).not.toHaveAttribute('aria-describedby', expect.stringContaining('validation'))

    rerender(field(true))
    expect(screen.getByRole('textbox', {name: 'Repository'})).toBe(control)
    expect(control).toHaveFocus()
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAccessibleDescription('Enter a valid repository. Use the owner and repository name.')
  })

  it('falls back to children for null region props and honors custom wrapper ids', () => {
    function WrappedCaption({id}: {id: string}) {
      // The region prop deliberately supports wrappers around FormControl parts.
      // eslint-disable-next-line primer-react/direct-slot-children
      return <FormControl.Caption id={id}>Wrapped help</FormControl.Caption>
    }

    render(
      <FormControl id="repository" label={null} caption={<WrappedCaption id="custom-help" />}>
        <FormControl.Label>Child label</FormControl.Label>
        <FormControl.Control />
        <FormControl.Caption>Child caption</FormControl.Caption>
      </FormControl>,
    )

    const control = screen.getByRole('textbox', {name: 'Child label'})
    expect(screen.queryByText('Child caption')).not.toBeInTheDocument()
    expect(control).toHaveAttribute('aria-describedby', 'custom-help')
    expect(control).toHaveAccessibleDescription('Wrapped help')
  })

  it('renders supplied error and success validation messages with distinct semantics', () => {
    render(
      <>
        <FormControl>
          <FormControl.Validation variant="error">Enter a repository.</FormControl.Validation>
        </FormControl>
        <FormControl>
          <FormControl.Validation variant="success">Repository is available.</FormControl.Validation>
        </FormControl>
      </>,
    )

    expect(
      screen.getByText('Enter a repository.').closest('[data-component="FormControl.Validation"]'),
    ).toHaveAttribute('data-variant', 'error')
    expect(screen.getByRole('status')).toHaveTextContent('Repository is available.')
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'success')
  })

  it('associates a separate validation message with an editor outside the field root', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <>
        <label htmlFor="description">Description</label>
        <textarea id="description" aria-invalid="true" aria-describedby="description-help description-error" />
        <p id="description-help">Describe the issue.</p>
        <Field.Root>
          <FormControl.Validation ref={ref} id="description-error" variant="error">
            Enter a description.
          </FormControl.Validation>
        </Field.Root>
      </>,
    )

    const editor = screen.getByRole('textbox', {name: 'Description'})
    expect(editor).toHaveAttribute('aria-invalid', 'true')
    expect(editor).toHaveAccessibleDescription('Describe the issue. Enter a description.')
    expect(ref.current).toHaveAttribute('id', 'description-error')
  })

  it('registers an error with a Base UI field when composed directly', async () => {
    render(
      <Field.Root>
        <Field.Label>Repository</Field.Label>
        <Field.Control />
        <FormControl.Validation id="repository-error" variant="error">
          Enter a repository.
        </FormControl.Validation>
      </Field.Root>,
    )

    await waitFor(() =>
      expect(screen.getByRole('textbox', {name: 'Repository'})).toHaveAccessibleDescription('Enter a repository.'),
    )
  })

  it('shows the validation variant on text controls unless they set their own status', () => {
    function CustomControl(props: React.ComponentPropsWithoutRef<'input'>) {
      return <input {...useFormControlForwardedProps(props)} />
    }

    render(
      <>
        <FormControl>
          <FormControl.Label>Repository</FormControl.Label>
          <TextInput />
          <FormControl.Validation variant="success">Repository is available.</FormControl.Validation>
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Textarea />
          <FormControl.Validation variant="success">Description is valid.</FormControl.Validation>
        </FormControl>
        <FormControl>
          <FormControl.Label>Visibility</FormControl.Label>
          <Select>
            <Select.Option value="public">Public</Select.Option>
          </Select>
          <FormControl.Validation variant="success">Visibility is valid.</FormControl.Validation>
        </FormControl>
        <FormControl>
          <FormControl.Label>Owner</FormControl.Label>
          <TextInput validationStatus="error" />
          <FormControl.Validation variant="success">Owner is available.</FormControl.Validation>
        </FormControl>
        <FormControl>
          <FormControl.Label>Topic</FormControl.Label>
          <CustomControl />
          <FormControl.Validation variant="success">Topic is valid.</FormControl.Validation>
        </FormControl>
      </>,
    )

    for (const label of ['Repository', 'Description', 'Visibility']) {
      expect(screen.getByLabelText(label).closest('[data-validation]')).toHaveAttribute('data-validation', 'success')
    }
    expect(screen.getByLabelText('Owner').closest('[data-validation]')).toHaveAttribute('data-validation', 'error')
    expect(screen.getByLabelText('Topic')).not.toHaveAttribute('validationStatus')
    expect(screen.getByLabelText('Topic')).not.toHaveAttribute('aria-invalid')
  })

  it('forwards Base UI Field props to custom controls and lets external props win', () => {
    function CustomControl(props: React.ComponentPropsWithoutRef<'input'>) {
      return <input {...useFormControlForwardedProps(props)} />
    }

    render(
      <FormControl disabled name="repository">
        <CustomControl data-testid="context-control" />
        <CustomControl data-testid="external-control" disabled={false} name="external" />
      </FormControl>,
    )

    expect(screen.getByTestId('context-control')).toBeDisabled()
    expect(screen.getByTestId('context-control')).toHaveAttribute('name', 'repository')
    expect(screen.getByTestId('external-control')).not.toBeDisabled()
    expect(screen.getByTestId('external-control')).toHaveAttribute('name', 'external')
  })

  it('associates custom controls with labels, requirements, and descriptions', () => {
    function CustomControl(props: React.ComponentPropsWithoutRef<'input'>) {
      return <input {...useFormControlForwardedProps(props)} />
    }

    render(
      <FormControl id="repository" required>
        <FormControl.Label>Repository</FormControl.Label>
        <CustomControl data-testid="associated-control" />
        <FormControl.Caption>Use the owner and repository name.</FormControl.Caption>
      </FormControl>,
    )

    const control = screen.getByTestId('associated-control')
    expect(control).toHaveAttribute('id', 'repository')
    expect(control).toHaveAccessibleName('Repository*')
    expect(control).toBeRequired()
    expect(control).toHaveAccessibleDescription('Use the owner and repository name.')
    expect(screen.getByText('Use the owner and repository name.')).toHaveAttribute('id', 'repository-caption')
  })

  it('preserves state-aware Base UI class name callbacks', () => {
    const {container} = render(
      <FormControl
        disabled
        className={({disabled}) => (disabled ? 'custom-disabled' : undefined)}
        data-testid="field"
      />,
    )

    expect(container.firstElementChild).toHaveClass('custom-disabled')
  })

  it('uses visuallyHidden for styling without forwarding it to the label DOM node', () => {
    render(
      <FormControl>
        <FormControl.Label data-testid="label" visuallyHidden>
          Repository
        </FormControl.Label>
        <FormControl.Control />
      </FormControl>,
    )

    expect(screen.getByTestId('label')).toHaveClass('primer:sr-only')
    expect(screen.getByTestId('label')).not.toHaveAttribute('visuallyhidden')
  })

  it('uses choice-control typography and contextual leading-visual colors in horizontal layouts', () => {
    render(
      <FormControl disabled layout="horizontal">
        <FormControl.LeadingVisual data-testid="visual">Visual</FormControl.LeadingVisual>
        <FormControl.Label data-testid="horizontal-label">Repository</FormControl.Label>
      </FormControl>,
    )

    expect(screen.getByTestId('horizontal-label')).toHaveClass('primer:font-normal')
    expect(screen.getByTestId('visual')).toHaveClass('primer:text-[var(--control-fgColor-disabled)]')
    expect(screen.getByTestId('visual')).toHaveAttribute('data-control-disabled', 'true')
  })

  it('renders enabled leading visuals with the default foreground color', () => {
    render(
      <FormControl layout="horizontal">
        <FormControl.LeadingVisual data-testid="visual">Visual</FormControl.LeadingVisual>
        <FormControl.Label>Repository</FormControl.Label>
      </FormControl>,
    )

    expect(screen.getByTestId('visual')).toHaveClass('primer:text-default')
  })

  it('sizes leading visual icons to 16px and grows them beside a caption', () => {
    render(
      <FormControl layout="horizontal">
        <FormControl.LeadingVisual data-testid="visual">
          <svg aria-hidden="true" />
        </FormControl.LeadingVisual>
        <FormControl.Label>Repository</FormControl.Label>
      </FormControl>,
    )

    expect(screen.getByTestId('visual')).toHaveClass(
      'primer:[&>*]:min-h-4',
      'primer:[&>*]:min-w-4',
      'primer:[&>*]:fill-current',
    )
    expect(screen.getByTestId('visual').className).toContain(
      "primer:[[data-component='FormControl']:has([data-component='FormControl.Caption'])_&>*]:min-h-6",
    )
  })

  it('does not space a control away from a visually hidden label', () => {
    const {container, rerender} = render(
      <FormControl>
        <FormControl.Label visuallyHidden>Name</FormControl.Label>
        <input />
      </FormControl>,
    )
    const root = container.querySelector('[data-component="FormControl"]')

    expect(root).toHaveClass('primer:[&>*:not(label)+*]:mt-1')

    rerender(
      <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <input />
      </FormControl>,
    )

    expect(root).toHaveClass('primer:[&>*+*]:mt-1')

    rerender(
      <FormControl>
        <div>
          {/* eslint-disable-next-line primer-react/direct-slot-children */}
          <FormControl.Label visuallyHidden>Name</FormControl.Label>
        </div>
        <input />
      </FormControl>,
    )

    expect(root).toHaveClass('primer:[&>*+*]:mt-1')
  })

  it('renders only one input when layout is horizontal with a non-choice input', () => {
    render(
      <FormControl layout="horizontal">
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />
      </FormControl>,
    )

    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Name')
  })

  it('supports an explicit horizontal layout for a wrapped checkbox', async () => {
    const user = userEvent.setup()
    function WrappedCheckbox(props: React.ComponentProps<typeof Checkbox>) {
      return <Checkbox {...props} />
    }

    render(
      <FormControl id="notifications" layout="horizontal" data-testid="field">
        <WrappedCheckbox />
        <FormControl.Label>Notifications</FormControl.Label>
        <FormControl.Caption>Receive repository updates.</FormControl.Caption>
      </FormControl>,
    )

    const checkbox = screen.getByRole('checkbox', {name: 'Notifications'})
    expect(screen.getByTestId('field')).toHaveAttribute('data-layout', 'horizontal')
    expect(checkbox).toHaveAccessibleDescription('Receive repository updates.')
    await user.click(screen.getByText('Notifications'))
    expect(checkbox).toBeChecked()
  })

  it('supports an explicit horizontal layout for a wrapped package radio', async () => {
    const user = userEvent.setup()
    function WrappedRadio(props: React.ComponentProps<typeof Radio>) {
      return <Radio {...props} />
    }

    render(
      <RadioGroup name="notifications">
        <RadioGroup.Label>Notification preference</RadioGroup.Label>
        <FormControl id="notification-email" layout="horizontal" data-testid="field">
          <WrappedRadio value="email" />
          <FormControl.Label>Email</FormControl.Label>
          <FormControl.Caption>Receive email updates.</FormControl.Caption>
        </FormControl>
      </RadioGroup>,
    )

    const radio = screen.getByRole('radio', {name: 'Email'})
    expect(screen.getByTestId('field')).toHaveAttribute('data-layout', 'horizontal')
    expect(radio).toHaveAccessibleDescription('Receive email updates.')
    await user.click(screen.getByText('Email'))
    expect(radio).toBeChecked()
  })

  it('names a wrapped package radio before and after hydration', async () => {
    const user = userEvent.setup()
    function WrappedRadio(props: React.ComponentProps<typeof Radio>) {
      return <Radio {...props} />
    }
    const field = (
      <RadioGroup name="notifications">
        <RadioGroup.Label>Notification preference</RadioGroup.Label>
        <FormControl id="notification-email" layout="horizontal">
          <WrappedRadio value="email" />
          <FormControl.Label>Email</FormControl.Label>
          <FormControl.Caption>Receive email updates.</FormControl.Caption>
        </FormControl>
      </RadioGroup>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)

    try {
      const radio = within(container).getByRole('radio')
      expect(radio).toHaveAccessibleName('Email')
      expect(radio).toHaveAccessibleDescription('Receive email updates.')
      render(field, {container, hydrate: true})
      expect(radio).toHaveAccessibleName('Email')
      expect(radio).toHaveAccessibleDescription('Receive email updates.')
      await user.click(within(container).getByText('Email'))
      expect(radio).toBeChecked()
    } finally {
      container.remove()
    }
  })

  it('names wrapped package checkbox and switch controls before and after hydration', async () => {
    const user = userEvent.setup()
    function WrappedCheckbox(props: React.ComponentProps<typeof Checkbox>) {
      return <Checkbox {...props} />
    }
    function WrappedSwitch(props: React.ComponentProps<typeof ToggleSwitch>) {
      return <ToggleSwitch {...props} />
    }
    const field = (
      <>
        <FormControl id="notifications" layout="horizontal">
          <WrappedCheckbox />
          <FormControl.Label>Notifications</FormControl.Label>
        </FormControl>
        <FormControl id="enabled">
          <WrappedSwitch />
          <FormControl.Label>Enabled</FormControl.Label>
        </FormControl>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)

    try {
      const checkbox = within(container).getByRole('checkbox')
      const toggle = within(container).getByRole('switch')
      expect(checkbox).toHaveAccessibleName('Notifications')
      expect(toggle).toHaveAccessibleName('Enabled')
      render(field, {container, hydrate: true})
      expect(checkbox).toHaveAccessibleName('Notifications')
      expect(toggle).toHaveAccessibleName('Enabled')
      await user.click(within(container).getByText('Notifications'))
      await user.click(within(container).getByText('Enabled'))
      expect(checkbox).toBeChecked()
      expect(toggle).toBeChecked()
    } finally {
      container.remove()
    }
  })

  it('preserves explicit names for wrapped package choice controls before and after hydration', () => {
    function WrappedCheckbox(props: React.ComponentProps<typeof Checkbox>) {
      return <Checkbox {...props} />
    }
    function WrappedRadio(props: React.ComponentProps<typeof Radio>) {
      return <Radio {...props} />
    }
    function WrappedSwitch(props: React.ComponentProps<typeof ToggleSwitch>) {
      return <ToggleSwitch {...props} />
    }
    const field = (
      <>
        <span id="checkbox-explicit-name">Notifications by email</span>
        <span id="radio-explicit-name">Email notifications</span>
        <span id="switch-explicit-name">Enabled for notifications</span>
        <FormControl id="checkbox-field">
          <FormControl.Label>Notifications</FormControl.Label>
          <WrappedCheckbox aria-labelledby="checkbox-explicit-name" />
        </FormControl>
        <RadioGroup name="options">
          <RadioGroup.Label>Options</RadioGroup.Label>
          <FormControl id="radio-field">
            <FormControl.Label>Email</FormControl.Label>
            <WrappedRadio aria-labelledby="radio-explicit-name" value="email" />
          </FormControl>
        </RadioGroup>
        <FormControl id="switch-field">
          <FormControl.Label>Enabled</FormControl.Label>
          <WrappedSwitch aria-labelledby="switch-explicit-name" />
        </FormControl>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)

    try {
      const assertNames = () => {
        expect(within(container).getByRole('checkbox')).toHaveAccessibleName('Notifications by email')
        expect(within(container).getByRole('radio')).toHaveAccessibleName('Email notifications')
        expect(within(container).getByRole('switch')).toHaveAccessibleName('Enabled for notifications')
      }
      assertNames()
      render(field, {container, hydrate: true})
      assertNames()
    } finally {
      container.remove()
    }
  })

  it('uses the visible field label consistently when a wrapped choice control also has aria-label', () => {
    function WrappedSwitch(props: React.ComponentProps<typeof ToggleSwitch>) {
      return <ToggleSwitch {...props} />
    }
    const field = (
      <FormControl>
        <FormControl.Label>Enabled</FormControl.Label>
        <WrappedSwitch aria-label="Enabled for notifications" />
      </FormControl>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)

    try {
      const toggle = within(container).getByRole('switch')
      expect(toggle).toHaveAccessibleName('Enabled')
      render(field, {container, hydrate: true})
      expect(toggle).toHaveAccessibleName('Enabled')
    } finally {
      container.remove()
    }
  })

  it('preserves aria-label when a wrapped choice control has no field label', () => {
    function WrappedSwitch(props: React.ComponentProps<typeof ToggleSwitch>) {
      return <ToggleSwitch {...props} />
    }
    const field = (
      <FormControl>
        <WrappedSwitch aria-label="Enabled for notifications" />
      </FormControl>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)

    try {
      const toggle = within(container).getByRole('switch')
      expect(toggle).toHaveAccessibleName('Enabled for notifications')
      render(field, {container, hydrate: true})
      expect(toggle).toHaveAccessibleName('Enabled for notifications')
    } finally {
      container.remove()
    }
  })

  it('associates a native radio adapter before and after hydration', () => {
    function NativeRadio(props: Omit<React.ComponentPropsWithoutRef<'input'>, 'type'>) {
      return <input {...useFormControlForwardedProps(props)} type="radio" />
    }
    const field = (
      <FormControl id="native-email" name="notifications" layout="horizontal" required>
        <NativeRadio value="email" />
        <FormControl.Label>Email</FormControl.Label>
        <FormControl.Caption>Receive email updates.</FormControl.Caption>
      </FormControl>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.appendChild(container)

    try {
      const radio = within(container).getByRole('radio', {name: /Email/})
      expect(container.querySelector('label')?.control).toBe(radio)
      expect(radio).toHaveAttribute('id', 'native-email')
      expect(radio).toHaveAttribute('name', 'notifications')
      expect(radio).toBeRequired()
      expect(radio).toHaveAccessibleDescription('Receive email updates.')
      expect(radio).not.toHaveAttribute('labelId')
      render(field, {container, hydrate: true})
      expect(container.querySelector('label')?.control).toBe(radio)
      expect(radio).toHaveAccessibleDescription('Receive email updates.')
    } finally {
      container.remove()
    }
  })

  it('forwards field context to a native radio adapter', async () => {
    const user = userEvent.setup()
    function NativeRadio(props: Omit<React.ComponentPropsWithoutRef<'input'>, 'type'>) {
      return <input {...useFormControlForwardedProps(props)} type="radio" />
    }
    const field = (disabled = false) => (
      <form data-testid="form">
        <FormControl id="notification-email" name="notifications" disabled={disabled} layout="horizontal" required>
          <NativeRadio value="email" />
          <FormControl.Label>Email</FormControl.Label>
          <FormControl.Caption>Receive email updates.</FormControl.Caption>
          <FormControl.Validation variant="error">Choose a notification preference.</FormControl.Validation>
        </FormControl>
      </form>
    )
    const {rerender} = render(field())

    const radio = screen.getByRole('radio', {name: /Email/})
    expect(radio).toHaveAttribute('id', 'notification-email')
    expect(radio).toHaveAttribute('name', 'notifications')
    expect(radio).toBeRequired()
    expect(radio).toHaveAttribute('aria-invalid', 'true')
    expect(radio).toHaveAccessibleDescription('Choose a notification preference. Receive email updates.')
    expect(screen.getByText('Email').closest('label')?.control).toBe(radio)
    await user.click(screen.getByText('Email'))
    expect(radio).toBeChecked()
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('notifications')).toBe('email')

    rerender(field(true))
    expect(radio).toBeDisabled()
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).has('notifications')).toBe(false)
  })

  it('lays out checkbox and radio children horizontally unless a layout is set', () => {
    const {rerender} = render(
      <FormControl data-testid="field">
        <FormControl.Label data-testid="label">Subscribe</FormControl.Label>
        <Checkbox />
      </FormControl>,
    )

    expect(screen.getByTestId('field')).toHaveAttribute('data-layout', 'horizontal')
    expect(screen.getByTestId('label')).toHaveClass('primer:font-normal')
    expect(screen.getByRole('checkbox')).toHaveAccessibleName('Subscribe')

    rerender(
      <RadioGroup name="choices">
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <FormControl data-testid="field">
          <FormControl.Label>One</FormControl.Label>
          <Radio value="one" />
        </FormControl>
      </RadioGroup>,
    )

    expect(screen.getByTestId('field')).toHaveAttribute('data-layout', 'horizontal')
    expect(screen.getByRole('radio')).toHaveAccessibleName('One')

    rerender(
      <FormControl data-testid="field" layout="vertical">
        <FormControl.Label>Subscribe</FormControl.Label>
        <Checkbox />
      </FormControl>,
    )

    expect(screen.getByTestId('field')).toHaveAttribute('data-layout', 'vertical')

    rerender(
      <FormControl data-testid="field">
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />
      </FormControl>,
    )

    expect(screen.getByTestId('field')).toHaveAttribute('data-layout', 'vertical')
  })
})

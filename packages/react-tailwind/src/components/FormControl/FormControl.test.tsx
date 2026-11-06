import React from 'react'
import {cleanup, render, screen, within} from '@testing-library/react'
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

    expect(screen.getByTestId('label')).toHaveClass('sr-only')
    expect(screen.getByTestId('label')).not.toHaveAttribute('visuallyhidden')
  })

  it('uses choice-control typography and contextual leading-visual colors in horizontal layouts', () => {
    render(
      <FormControl disabled layout="horizontal">
        <FormControl.LeadingVisual data-testid="visual">Visual</FormControl.LeadingVisual>
        <FormControl.Label data-testid="horizontal-label">Repository</FormControl.Label>
      </FormControl>,
    )

    expect(screen.getByTestId('horizontal-label')).toHaveClass('font-normal')
    expect(screen.getByTestId('visual')).toHaveClass('text-[var(--control-fgColor-disabled)]')
    expect(screen.getByTestId('visual')).toHaveAttribute('data-control-disabled', 'true')
  })

  it('renders enabled leading visuals with the default foreground color', () => {
    render(
      <FormControl layout="horizontal">
        <FormControl.LeadingVisual data-testid="visual">Visual</FormControl.LeadingVisual>
        <FormControl.Label>Repository</FormControl.Label>
      </FormControl>,
    )

    expect(screen.getByTestId('visual')).toHaveClass('text-default')
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

    expect(screen.getByTestId('visual')).toHaveClass('[&>*]:min-h-4', '[&>*]:min-w-4', '[&>*]:fill-current')
    expect(screen.getByTestId('visual').className).toContain(
      "[[data-component='FormControl']:has([data-component='FormControl.Caption'])_&>*]:min-h-6",
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

    expect(root).toHaveClass('[&>*:not(label)+*]:mt-1')

    rerender(
      <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <input />
      </FormControl>,
    )

    expect(root).toHaveClass('[&>*+*]:mt-1')

    rerender(
      <FormControl>
        <div>
          {/* eslint-disable-next-line primer-react/direct-slot-children */}
          <FormControl.Label visuallyHidden>Name</FormControl.Label>
        </div>
        <input />
      </FormControl>,
    )

    expect(root).toHaveClass('[&>*+*]:mt-1')
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

  it('lays out checkbox and radio children horizontally unless a layout is set', () => {
    const {rerender} = render(
      <FormControl data-testid="field">
        <FormControl.Label data-testid="label">Subscribe</FormControl.Label>
        <Checkbox />
      </FormControl>,
    )

    expect(screen.getByTestId('field')).toHaveAttribute('data-layout', 'horizontal')
    expect(screen.getByTestId('label')).toHaveClass('font-normal')
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

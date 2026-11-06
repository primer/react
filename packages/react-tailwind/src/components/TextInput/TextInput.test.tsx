import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import {SearchIcon, XCircleFillIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {FormControl} from '../FormControl'
import {TextInput} from './TextInput'

describe('TextInput', () => {
  afterEach(cleanup)

  it('keeps native keyboard and form behavior while forwarding props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLInputElement>()
    render(
      <form>
        <TextInput ref={ref} name="title" data-testid="input" />
      </form>,
    )
    await user.type(screen.getByTestId('input'), 'Primer')
    expect(ref.current).toBe(screen.getByTestId('input'))
    expect(new FormData(screen.getByTestId('input').closest('form')!).get('title')).toBe('Primer')
  })

  it('supports intrinsic and full-width layouts without forwarding block', () => {
    const {container, rerender} = render(<TextInput data-testid="block-input" />)
    expect(container.firstElementChild).toHaveClass('inline-flex')

    rerender(<TextInput block data-testid="block-input" />)
    expect(container.firstElementChild).toHaveClass('w-full')
    expect(screen.getByTestId('block-input')).not.toHaveAttribute('block')
  })

  it('renders accessible inner visuals and focuses the input when a visual is clicked', async () => {
    const user = userEvent.setup()
    const {container} = render(<TextInput leadingVisual="Search" trailingVisual={SearchIcon} />)
    const input = screen.getByRole('textbox')

    expect(input).toHaveAccessibleDescription(/Search/)
    await user.click(container.querySelector('[data-component="TextInput.LeadingVisual"]')!)
    expect(input).toHaveFocus()
  })

  it('composes an accessible trailing action from the shared IconButton', async () => {
    const user = userEvent.setup()
    render(<TextInput trailingAction={<TextInput.Action aria-label="Clear input" icon={XCircleFillIcon} />} />)

    await user.click(screen.getByRole('button', {name: 'Clear input'}))
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('exposes loading state and description', () => {
    const {container} = render(<TextInput loading loaderText="Loading repositories" />)

    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Loading repositories')
  })

  it('uses FormControl state unless a direct prop overrides it', () => {
    render(
      <>
        <FormControl disabled required>
          <FormControl.Label>Context input</FormControl.Label>
          <TextInput data-testid="context-input" />
        </FormControl>
        <FormControl disabled required>
          <FormControl.Label>Override input</FormControl.Label>
          <TextInput data-testid="override-input" disabled={false} required={false} />
        </FormControl>
      </>,
    )

    expect(screen.getByTestId('context-input')).toBeDisabled()
    expect(screen.getByTestId('context-input')).toBeRequired()
    expect(screen.getByTestId('context-input').parentElement).toHaveAttribute('data-disabled', 'true')
    expect(screen.getByTestId('override-input')).not.toBeDisabled()
    expect(screen.getByTestId('override-input')).not.toBeRequired()
    expect(screen.getByTestId('override-input').parentElement).not.toHaveAttribute('data-disabled')
  })

  it('preserves explicit aria-required independently of native form validation', () => {
    render(
      <>
        <FormControl>
          <FormControl.Label>Custom validation</FormControl.Label>
          <TextInput aria-required="true" />
        </FormControl>
        <TextInput aria-label="Optional" aria-required={false} />
        <FormControl required>
          <FormControl.Label>Native validation</FormControl.Label>
          <TextInput />
        </FormControl>
      </>,
    )

    const custom = screen.getByRole('textbox', {name: 'Custom validation'})
    expect(custom).toHaveAttribute('aria-required', 'true')
    expect(custom).not.toHaveAttribute('required')
    expect(screen.getByRole('textbox', {name: 'Optional'})).toHaveAttribute('aria-required', 'false')
    const native = screen.getByRole('textbox', {name: /Native validation/})
    expect(native).toHaveAttribute('required')
    expect(native).toHaveAttribute('aria-required', 'true')
  })

  it('uses FormControl error validation for native and visual invalid state', () => {
    render(
      <FormControl>
        <FormControl.Label>Repository</FormControl.Label>
        <TextInput data-testid="validated-input" />
        <FormControl.Validation variant="error">Repository is required.</FormControl.Validation>
      </FormControl>,
    )

    expect(screen.getByTestId('validated-input')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByTestId('validated-input').parentElement).toHaveAttribute('data-validation', 'error')
  })

  it('tracks controlled and uncontrolled character limits', async () => {
    const user = userEvent.setup()
    const {unmount} = render(<TextInput characterLimit={5} />)

    await user.type(screen.getByRole('textbox'), 'Primer')
    expect(screen.getAllByText('1 character over')).toHaveLength(2)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')

    unmount()
    render(<TextInput characterLimit={5} onChange={() => {}} value="Git" />)
    expect(screen.getAllByText('2 characters remaining')).toHaveLength(2)
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })
})

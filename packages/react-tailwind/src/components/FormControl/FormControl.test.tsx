import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {FormControl, useFormControlForwardedProps} from './index'

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

    expect(screen.getByText('Enter a repository.')).toHaveAttribute('data-variant', 'error')
    expect(screen.getByRole('status')).toHaveTextContent('Repository is available.')
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'success')
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
})

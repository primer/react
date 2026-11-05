import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {TextInput} from '../TextInput'
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
})

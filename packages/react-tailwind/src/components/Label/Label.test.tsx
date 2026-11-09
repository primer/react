import React from 'react'
import {render, screen} from '@testing-library/react'
import {renderToStaticMarkup} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {Label} from './Label'

describe('Label', () => {
  it('forwards props and refs to its presentational root', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <Label ref={ref} data-testid="label">
        Bug
      </Label>,
    )
    expect(screen.getByTestId('label')).toHaveAttribute('data-component', 'Label')
    expect(screen.getByTestId('label')).toBe(ref.current)
  })

  it.each([
    'default',
    'primary',
    'secondary',
    'accent',
    'success',
    'attention',
    'severe',
    'danger',
    'done',
    'sponsors',
  ] as const)('exposes the %s variant on the rendered element', variant => {
    render(<Label variant={variant}>Status</Label>)
    expect(screen.getByText('Status')).toHaveAttribute('data-variant', variant)
  })

  it('reflects the default variant and updates it when the variant changes', () => {
    const {rerender} = render(<Label>Status</Label>)
    const label = screen.getByText('Status')
    expect(label).toHaveAttribute('data-variant', 'default')

    rerender(<Label variant="danger">Status</Label>)
    expect(screen.getByText('Status')).toBe(label)
    expect(label).toHaveAttribute('data-variant', 'danger')

    rerender(<Label variant={null}>Status</Label>)
    expect(label).not.toHaveAttribute('data-variant')
    expect(label).not.toHaveClass('primer:text-default')
    expect(label).not.toHaveClass('primer:text-danger')
  })

  it('renders the same variant metadata on the server', () => {
    expect(renderToStaticMarkup(<Label>Status</Label>)).toContain('data-variant="default"')
    expect(renderToStaticMarkup(<Label variant="success">Status</Label>)).toContain('data-variant="success"')
    expect(renderToStaticMarkup(<Label variant={null}>Status</Label>)).not.toContain('data-variant')
  })

  it('preserves an explicitly supplied variant data attribute', () => {
    render(
      <Label variant="attention" data-variant="host-status">
        Status
      </Label>,
    )
    expect(screen.getByText('Status')).toHaveAttribute('data-variant', 'host-status')
  })

  it('accepts element-specific props and forwards the corresponding ref', () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <Label as="a" href="/issues" target="_blank" ref={ref}>
        Issues
      </Label>,
    )
    const link = screen.getByRole('link', {name: 'Issues'})
    expect(link).toHaveAttribute('href', '/issues')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toBe(ref.current)
  })

  it('supports props and refs of a custom element', () => {
    const Link = React.forwardRef<HTMLAnchorElement, {to: string} & React.ComponentPropsWithoutRef<'a'>>(function Link(
      {children, to, ...props},
      ref,
    ) {
      return (
        <a {...props} href={to} ref={ref}>
          {children}
        </a>
      )
    })
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <Label as={Link} to="/pulls" ref={ref}>
        Pull requests
      </Label>,
    )
    const link = screen.getByRole('link', {name: 'Pull requests'})
    expect(link).toHaveAttribute('href', '/pulls')
    expect(link).toBe(ref.current)
    expect(link).toHaveAttribute('data-component', 'Label')
    expect(link).toHaveAttribute('data-variant', 'default')
  })
})

function acceptsLabelElement(_element: React.ReactElement) {}

acceptsLabelElement(
  // @ts-expect-error href requires an anchor or another compatible element.
  <Label href="/issues">Issues</Label>,
)
acceptsLabelElement(
  // @ts-expect-error A button does not accept an anchor's href.
  <Label as="button" href="/issues">
    Issues
  </Label>,
)
acceptsLabelElement(
  // @ts-expect-error A button ref cannot refer to an anchor.
  <Label as="a" href="/issues" ref={React.createRef<HTMLButtonElement>()}>
    Issues
  </Label>,
)

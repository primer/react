import React from 'react'
import {render, screen} from '@testing-library/react'
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

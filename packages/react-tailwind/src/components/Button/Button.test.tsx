import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Button} from './Button'

describe('Button', () => {
  it('overlays a lone loading indicator without changing the label width', () => {
    const {unmount} = render(<Button loading>Submit</Button>)

    expect(screen.getByText('Submit').previousElementSibling).toHaveClass('absolute', 'left-1/2', '-translate-x-1/2')
    unmount()
  })

  it('uses Base UI button semantics and forwards its ref and props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Button ref={ref} data-testid="button">
        Save
      </Button>,
    )
    expect(screen.getByRole('button', {name: 'Save'})).toHaveAttribute('data-component', 'Button')
    expect(screen.getByTestId('button')).toBe(ref.current)
  })

  it('keeps its action label accessible while loading with a keybinding hint', () => {
    render(
      <Button loading trailingVisual={<kbd>⌘↵</kbd>} variant="primary">
        Submit
      </Button>,
    )

    expect(screen.getByRole('button', {name: /Submit/})).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', {name: /Submit/})).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', {name: /Submit/})).not.toBeDisabled()
    expect(screen.queryByText('⌘↵')).not.toBeInTheDocument()
  })

  it('renders Primer-compatible visual, counter, and inactive parts', () => {
    render(
      <Button count={3} inactive leadingVisual={() => <span data-testid="icon" />}>
        Watch
      </Button>,
    )

    const button = screen.getByRole('button', {name: /Watch/})
    expect(button).toHaveAttribute('data-inactive', 'true')
    expect(button).not.toBeDisabled()
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('data-component', 'leadingVisual')
    expect(screen.getByText('3')).toHaveAttribute('data-component', 'ButtonCounter')
  })

  it('does not add a native button type to a non-button render target', () => {
    const {container} = render(
      <Button nativeButton={false} render={<span />}>
        Save
      </Button>,
    )

    expect(container.querySelector('[role="button"]')).not.toHaveAttribute('type')
  })
})

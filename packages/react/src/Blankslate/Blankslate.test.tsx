import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Blankslate} from '../Blankslate'

describe('Blankslate', () => {
  it('should support a custom `className` on the outermost, non-container element', () => {
    const {container} = render(<Blankslate className="test">Test content</Blankslate>)
    expect(container.firstChild!.firstChild).toHaveClass('test')
  })

  it('should render with border when border is true', () => {
    const {container} = render(<Blankslate border>Test content</Blankslate>)
    expect(container.firstChild!.firstChild).toHaveAttribute('data-border', '')
  })

  it('should render with narrow style when narrow is true', () => {
    const {container} = render(<Blankslate narrow>Test content</Blankslate>)
    expect(container.firstChild!.firstChild).toHaveAttribute('data-narrow', '')
  })

  it('should render with spacious style when spacious is true', () => {
    const {container} = render(<Blankslate spacious>Test content</Blankslate>)
    expect(container.firstChild!.firstChild).toHaveAttribute('data-spacious', '')
  })

  describe('Blankslate.Visual', () => {
    it('should render a visual element', () => {
      render(
        <Blankslate>
          <Blankslate.Visual>
            <svg aria-hidden="true" data-testid="test-icon" />
          </Blankslate.Visual>
        </Blankslate>,
      )
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })
  })

  describe('Blankslate.Heading', () => {
    it('should render a heading with h2 by default', () => {
      render(
        <Blankslate>
          <Blankslate.Heading>Test Heading</Blankslate.Heading>
        </Blankslate>,
      )
      expect(screen.getByRole('heading', {level: 2, name: 'Test Heading'})).toBeInTheDocument()
      expect(screen.getByRole('heading', {level: 2})).toHaveClass('Blankslate-Heading')
    })

    it('should render with a custom heading level', () => {
      render(
        <Blankslate>
          <Blankslate.Heading as="h3">Test Heading</Blankslate.Heading>
        </Blankslate>,
      )
      expect(screen.getByRole('heading', {level: 3, name: 'Test Heading'})).toBeInTheDocument()
    })
  })

  describe('Blankslate.Description', () => {
    it('should render a description', () => {
      render(
        <Blankslate>
          <Blankslate.Description>Test description</Blankslate.Description>
        </Blankslate>,
      )
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })
  })

  describe('Blankslate.PrimaryAction', () => {
    it('should render a primary action button', () => {
      render(
        <Blankslate>
          <Blankslate.PrimaryAction>Primary action</Blankslate.PrimaryAction>
        </Blankslate>,
      )
      expect(screen.getByRole('button', {name: 'Primary action'})).toBeInTheDocument()
    })

    it('should handle click events on the button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Blankslate>
          <Blankslate.PrimaryAction onClick={onClick}>Primary action</Blankslate.PrimaryAction>
        </Blankslate>,
      )

      await user.click(screen.getByRole('button', {name: 'Primary action'}))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should render as an anchor when href is provided', () => {
      render(
        <Blankslate>
          <Blankslate.PrimaryAction href="https://example.com">Primary action</Blankslate.PrimaryAction>
        </Blankslate>,
      )
      const link = screen.getByRole('link', {name: 'Primary action'})
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://example.com')
    })
  })

  describe('Blankslate.SecondaryAction', () => {
    it('should render a secondary action link', () => {
      render(
        <Blankslate>
          <Blankslate.SecondaryAction href="https://example.com">Secondary action</Blankslate.SecondaryAction>
        </Blankslate>,
      )
      const link = screen.getByRole('link', {name: 'Secondary action'})
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://example.com')
    })
  })
})

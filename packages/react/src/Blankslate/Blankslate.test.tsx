import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Blankslate} from '../Blankslate'
import {implementsClassName} from '../utils/testing'
import classes from './Blankslate.module.css'

describe('Blankslate', () => {
  implementsClassName(Blankslate, classes.Blankslate)

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

  it('renders data-component attributes', () => {
    const {container} = render(
      <Blankslate>
        <Blankslate.Visual>
          <svg aria-hidden="true" data-testid="test-icon" />
        </Blankslate.Visual>
        <Blankslate.Heading>Test Heading</Blankslate.Heading>
        <Blankslate.Description>Test description</Blankslate.Description>
        <Blankslate.Action>Action</Blankslate.Action>
        <Blankslate.PrimaryAction>Primary action</Blankslate.PrimaryAction>
        <Blankslate.SecondaryAction href="https://example.com">Secondary action</Blankslate.SecondaryAction>
      </Blankslate>,
    )

    expect(container.querySelector('[data-component="Blankslate"]')).toBeInTheDocument()

    expect(
      container.querySelector('[data-component="Blankslate"] [data-component="Blankslate.Visual"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-component="Blankslate"] [data-component="Blankslate.Heading"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-component="Blankslate"] [data-component="Blankslate.Description"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-component="Blankslate"] [data-component="Blankslate.Action"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-component="Blankslate"] [data-component="Blankslate.PrimaryAction"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-component="Blankslate"] [data-component="Blankslate.SecondaryAction"]'),
    ).toBeInTheDocument()
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

  describe('Blankslate.Action', () => {
    it('should render a primary action button by default', () => {
      render(
        <Blankslate>
          <Blankslate.Action>Action</Blankslate.Action>
        </Blankslate>,
      )
      expect(screen.getByRole('button', {name: 'Action'})).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'Action'})).toHaveAttribute('data-variant', 'primary')
    })

    it('should handle click events on the button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Blankslate>
          <Blankslate.Action onClick={onClick}>Action</Blankslate.Action>
        </Blankslate>,
      )

      await user.click(screen.getByRole('button', {name: 'Action'}))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should render as an anchor when href is provided', () => {
      render(
        <Blankslate>
          <Blankslate.Action href="https://example.com">Action</Blankslate.Action>
        </Blankslate>,
      )
      const link = screen.getByRole('link', {name: 'Action'})
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://example.com')
    })

    it('should render secondary actions as links by default', () => {
      render(
        <Blankslate>
          <Blankslate.Action href="https://example.com" variant="secondary">
            Action
          </Blankslate.Action>
        </Blankslate>,
      )
      const link = screen.getByRole('link', {name: 'Action'})
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('data-component', 'Link')
    })

    it('should render secondary actions as buttons', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Blankslate>
          <Blankslate.Action as="button" onClick={onClick} variant="secondary">
            Action
          </Blankslate.Action>
        </Blankslate>,
      )

      await user.click(screen.getByRole('button', {name: 'Action'}))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should render small primary actions when the Blankslate is small', () => {
      render(
        <Blankslate size="small">
          <Blankslate.Action>Action</Blankslate.Action>
        </Blankslate>,
      )
      expect(screen.getByRole('button', {name: 'Action'})).toHaveAttribute('data-size', 'small')
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

    it('should render a secondary action button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Blankslate>
          <Blankslate.SecondaryAction as="button" onClick={onClick}>
            Secondary action
          </Blankslate.SecondaryAction>
        </Blankslate>,
      )

      await user.click(screen.getByRole('button', {name: 'Secondary action'}))
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })
})

import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Blankslate} from '../Blankslate'
import {implementsClassName} from '../utils/testing'
import classes from './Blankslate.module.css'

function getCSSStyleRules(): Array<CSSStyleRule> {
  return Array.from(document.styleSheets).flatMap(sheet => {
    return Array.from(sheet.cssRules).flatMap(rule => {
      if (rule instanceof CSSStyleRule) {
        return [rule]
      }

      if ('cssRules' in rule) {
        return Array.from(rule.cssRules as CSSRuleList).filter((nestedRule): nestedRule is CSSStyleRule => {
          return nestedRule instanceof CSSStyleRule
        })
      }

      return []
    })
  })
}

function getSizePadding(size: 'medium' | 'large') {
  const rule = getCSSStyleRules().find(cssRule => {
    return (
      cssRule.selectorText.includes(`.${classes.Blankslate}`) &&
      cssRule.selectorText.includes(`data-size="${size}"`) &&
      !cssRule.selectorText.includes('data-spacious')
    )
  })

  return rule?.style.getPropertyValue('--blankslate-padding').trim()
}

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

  it('sets reduced padding for the default medium size variant', () => {
    render(<Blankslate>Test content</Blankslate>)

    expect(getSizePadding('medium')).toMatch(/^var\(--base-size-16/)
  })

  it('renders data-component attributes', () => {
    const {container} = render(
      <Blankslate>
        <Blankslate.Visual>
          <svg aria-hidden="true" data-testid="test-icon" />
        </Blankslate.Visual>
        <Blankslate.Heading>Test Heading</Blankslate.Heading>
        <Blankslate.Description>Test description</Blankslate.Description>
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

  describe('Blankslate.PrimaryAction', () => {
    it('should render a primary action button', () => {
      render(
        <Blankslate>
          <Blankslate.PrimaryAction>Primary action</Blankslate.PrimaryAction>
        </Blankslate>,
      )
      expect(screen.getByRole('button', {name: 'Primary action'})).toBeInTheDocument()
    })

    it.each(['medium', 'large'] as const)('should render a default-size button for the %s blankslate size', size => {
      render(
        <Blankslate size={size}>
          <Blankslate.PrimaryAction>Primary action</Blankslate.PrimaryAction>
        </Blankslate>,
      )

      expect(screen.getByRole('button', {name: 'Primary action'})).toHaveAttribute('data-size', 'medium')
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

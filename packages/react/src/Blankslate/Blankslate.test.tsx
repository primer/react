import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
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

function getSizePadding(size: 'small' | 'medium' | 'large') {
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

  it('should render with border when border is true', async () => {
    const {container} = render(<Blankslate border>Test content</Blankslate>)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Blankslate"]'))
      .toHaveAttribute('data-border', '')
  })

  it('should render with narrow style when narrow is true', async () => {
    const {container} = render(<Blankslate narrow>Test content</Blankslate>)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Blankslate"]'))
      .toHaveAttribute('data-narrow', '')
  })

  it('should render with spacious style when spacious is true', async () => {
    const {container} = render(<Blankslate spacious>Test content</Blankslate>)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Blankslate"]'))
      .toHaveAttribute('data-spacious', '')
  })

  it('sets reduced padding for small size variant', () => {
    render(<Blankslate>Test content</Blankslate>)

    expect(getSizePadding('small')).toMatch(/^var\(--base-size-16/)
  })

  it('renders data-component attributes', async () => {
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

    await expect.element(container.querySelector<HTMLElement>('[data-component="Blankslate"]')).toBeInTheDocument()

    await expect
      .element(
        container.querySelector<HTMLElement>('[data-component="Blankslate"] [data-component="Blankslate.Visual"]'),
      )
      .toBeInTheDocument()
    await expect
      .element(
        container.querySelector<HTMLElement>('[data-component="Blankslate"] [data-component="Blankslate.Heading"]'),
      )
      .toBeInTheDocument()
    await expect
      .element(
        container.querySelector<HTMLElement>('[data-component="Blankslate"] [data-component="Blankslate.Description"]'),
      )
      .toBeInTheDocument()
    await expect
      .element(
        container.querySelector<HTMLElement>(
          '[data-component="Blankslate"] [data-component="Blankslate.PrimaryAction"]',
        ),
      )
      .toBeInTheDocument()
    await expect
      .element(
        container.querySelector<HTMLElement>(
          '[data-component="Blankslate"] [data-component="Blankslate.SecondaryAction"]',
        ),
      )
      .toBeInTheDocument()
  })

  describe('Blankslate.Visual', () => {
    it('should render a visual element', async () => {
      render(
        <Blankslate>
          <Blankslate.Visual>
            <svg aria-hidden="true" data-testid="test-icon" />
          </Blankslate.Visual>
        </Blankslate>,
      )
      await expect.element(page.getByTestId('test-icon')).toBeInTheDocument()
    })
  })

  describe('Blankslate.Heading', () => {
    it('should render a heading with h2 by default', async () => {
      render(
        <Blankslate>
          <Blankslate.Heading>Test Heading</Blankslate.Heading>
        </Blankslate>,
      )
      await expect.element(page.getByRole('heading', {level: 2, name: 'Test Heading'})).toBeInTheDocument()
      await expect.element(page.getByRole('heading', {level: 2})).toHaveClass('Blankslate-Heading')
    })

    it('should render with a custom heading level', async () => {
      render(
        <Blankslate>
          <Blankslate.Heading as="h3">Test Heading</Blankslate.Heading>
        </Blankslate>,
      )
      await expect.element(page.getByRole('heading', {level: 3, name: 'Test Heading'})).toBeInTheDocument()
    })
  })

  describe('Blankslate.Description', () => {
    it('should render a description', async () => {
      render(
        <Blankslate>
          <Blankslate.Description>Test description</Blankslate.Description>
        </Blankslate>,
      )
      await expect.element(page.getByText('Test description')).toBeInTheDocument()
    })
  })

  describe('Blankslate.PrimaryAction', () => {
    it('should render a primary action button', async () => {
      render(
        <Blankslate>
          <Blankslate.PrimaryAction>Primary action</Blankslate.PrimaryAction>
        </Blankslate>,
      )
      await expect.element(page.getByRole('button', {name: 'Primary action'})).toBeInTheDocument()
    })

    it('should handle click events on the button', async () => {
      const onClick = vi.fn()
      render(
        <Blankslate>
          <Blankslate.PrimaryAction onClick={onClick}>Primary action</Blankslate.PrimaryAction>
        </Blankslate>,
      )

      await userEvent.click(page.getByRole('button', {name: 'Primary action'}))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should render as an anchor when href is provided', async () => {
      render(
        <Blankslate>
          <Blankslate.PrimaryAction href="https://example.com">Primary action</Blankslate.PrimaryAction>
        </Blankslate>,
      )
      const link = page.getByRole('link', {name: 'Primary action'})
      await expect.element(link).toBeInTheDocument()
      await expect.element(link).toHaveAttribute('href', 'https://example.com')
    })
  })

  describe('Blankslate.SecondaryAction', () => {
    it('should render a secondary action link', async () => {
      render(
        <Blankslate>
          <Blankslate.SecondaryAction href="https://example.com">Secondary action</Blankslate.SecondaryAction>
        </Blankslate>,
      )
      const link = page.getByRole('link', {name: 'Secondary action'})
      await expect.element(link).toBeInTheDocument()
      await expect.element(link).toHaveAttribute('href', 'https://example.com')
    })
  })
})

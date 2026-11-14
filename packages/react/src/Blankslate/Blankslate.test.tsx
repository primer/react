import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {Blankslate} from '../Blankslate'
import {implementsClassName} from '../utils/testing'
import classes from './Blankslate.module.css'

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

  describe.each([480, 800])('in a %ipx container', width => {
    it.each([undefined, 'small', 'medium', 'large'] as const)(
      'uses the graduated size scale for size=%s',
      async size => {
        const {container, rerender} = render(
          <div style={{width}}>
            <Blankslate size={size}>
              <Blankslate.Visual>
                <svg width="32" height="32" aria-hidden="true" />
              </Blankslate.Visual>
              <Blankslate.Heading>Test heading</Blankslate.Heading>
              <Blankslate.Description>Test description</Blankslate.Description>
              <Blankslate.PrimaryAction>Primary action</Blankslate.PrimaryAction>
              <Blankslate.SecondaryAction href="#">Secondary action</Blankslate.SecondaryAction>
            </Blankslate>
          </div>,
        )
        const heading = page.getByRole('heading', {name: 'Test heading', exact: true})
        const blankslate = heading.element().parentElement
        const primaryAction = page.getByRole('button', {name: 'Primary action', exact: true})
        const secondaryAction = page.getByRole('link', {name: 'Secondary action', exact: true})
        const large = size === 'large'

        await expect.element(blankslate).toHaveAttribute('data-size', large ? 'large' : 'medium')
        await expect.element(blankslate).toHaveStyle({padding: large ? '32px' : '16px'})
        await expect.element(heading).toHaveStyle({fontSize: large ? '20px' : '16px', marginTop: '0px'})
        await expect.element(page.getByText('Test description', {exact: true})).toHaveStyle({
          fontSize: large ? '16px' : '14px',
          marginBottom: '0px',
        })
        await expect.element(container.querySelector<HTMLElement>('[data-component="Blankslate.Visual"]')).toHaveStyle({
          maxWidth: large ? 'none' : '24px',
        })
        await expect.element(primaryAction).toHaveAttribute('data-size', 'medium')
        await expect.element(primaryAction.element().parentElement).toHaveStyle({marginTop: '16px'})
        await expect.element(secondaryAction.element().parentElement).toHaveStyle({
          marginTop: '16px',
          marginBottom: large ? '16px' : '12px',
        })

        rerender(
          <div style={{width}}>
            <Blankslate size={size} spacious>
              <Blankslate.Heading>Test heading</Blankslate.Heading>
            </Blankslate>
          </div>,
        )

        await expect.element(heading.element().parentElement).toHaveStyle({
          padding: large ? '80px 40px' : '44px 28px',
        })
      },
    )
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

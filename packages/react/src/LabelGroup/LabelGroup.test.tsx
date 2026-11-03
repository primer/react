import type React from 'react'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {describe, it, expect, vi} from 'vitest'
import BaseStyles from '../BaseStyles'
import LabelGroup from '.'
import Label from '../Label'
import {implementsClassName} from '../utils/testing'
import classes from './LabelGroup.module.css'

const ThemeAndStyleContainer: React.FC<React.PropsWithChildren> = ({children}) => <BaseStyles>{children}</BaseStyles>

const AutoTruncateContainer: React.FC<React.PropsWithChildren & {width?: number}> = ({children, width}) => (
  <div style={{width}}>{children}</div>
)

const observe = vi.fn()

describe('LabelGroup', () => {
  implementsClassName(LabelGroup, classes.Container)

  window.IntersectionObserver = vi.fn(function () {
    return {
      observe,
      unobserve: vi.fn(),
      takeRecords: vi.fn(),
      disconnect: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    }
  }) as unknown as typeof IntersectionObserver

  it('renders data-component="LabelGroup" on the root element', async () => {
    render(
      <ThemeAndStyleContainer>
        <LabelGroup>
          <Label>One</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )
    await expect.element(page.getByRole('list')).toHaveAttribute('data-component', 'LabelGroup')
  })

  it('renders data-component="LabelGroup" on the root element (truncation path)', async () => {
    render(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={1}>
          <Label>One</Label>
          <Label>Two</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )

    await expect.element(page.getByRole('list')).toHaveAttribute('data-component', 'LabelGroup')
  })

  it('renders a toggle wrapper with data-component="LabelGroup.Toggle" (li for lists, span for non-lists)', async () => {
    const {container, rerender} = render(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={1}>
          <Label>One</Label>
          <Label>Two</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )

    const list = page.getByRole('list').element()
    const toggleLi = list.querySelector('li[data-component="LabelGroup.Toggle"]')
    await expect.element(toggleLi).toBeInTheDocument()

    rerender(
      <ThemeAndStyleContainer>
        <LabelGroup as="div" visibleChildCount={1}>
          <Label>One</Label>
          <Label>Two</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )

    const toggleSpan = container.querySelector('span[data-component="LabelGroup.Toggle"]')
    await expect.element(toggleSpan).toBeInTheDocument()
  })

  it('observers intersections on each child', async () => {
    render(
      <ThemeAndStyleContainer>
        <AutoTruncateContainer width={600}>
          <LabelGroup visibleChildCount="auto">
            <Label>One</Label>
            <Label>Two</Label>
            <Label>Three</Label>
            <Label>Four</Label>
            <Label>Five</Label>
            <Label>Six</Label>
            <Label>Seven</Label>
            <Label>Eight</Label>
            <Label>Nine</Label>
            <Label>Ten</Label>
            <Label>Eleven</Label>
            <Label>Twelve</Label>
            <Label>Thirteen</Label>
            <Label>Fourteen</Label>
            <Label>Fifteen</Label>
            <Label>Sixteen</Label>
          </LabelGroup>
        </AutoTruncateContainer>
      </ThemeAndStyleContainer>,
    )

    expect(observe).toHaveBeenCalledTimes(16)
  })

  it('should truncate labels to a specified number', async () => {
    render(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={3}>
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )
    const expandButton = page.getByText('+2', {exact: true})

    await expect.element(expandButton).toBeInTheDocument()
  })

  it('should expand all tokens into an overlay when overflowStyle="overlay"', async () => {
    render(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={3} overflowStyle="overlay">
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )
    const expandButton = page.getByText('+2', {exact: true})
    await userEvent.click(expandButton)
    await expect.element(page.getByRole('button', {name: 'Close', exact: true})).toHaveFocus()
  })

  it('should expand all tokens in place when overflowStyle="inline"', async () => {
    render(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={3} overflowStyle="inline">
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )
    const expandButton = page.getByText('+2', {exact: true})
    const fourthLabel = page.getByText('Four', {exact: true})

    await expect.element(fourthLabel).not.toBeVisible()

    await userEvent.click(expandButton)

    await expect.element(fourthLabel).toBeVisible()
  })

  it('should focus the collapse button when expanded, and the expand button when collapsed', async () => {
    render(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={3} overflowStyle="inline">
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )

    // Expand
    await userEvent.click(page.getByText('+2', {exact: true}))
    await expect.element(page.getByRole('button', {name: 'Show less', exact: true})).toHaveFocus()

    // Collapse
    await userEvent.click(page.getByRole('button', {name: 'Show less', exact: true}))
    await expect.element(page.getByRole('button', {name: 'Show +2 more', exact: true})).toHaveFocus()
  })

  describe('should render as ul by default', () => {
    it('without truncation', async () => {
      render(
        <ThemeAndStyleContainer>
          <LabelGroup>
            <Label>One</Label>
            <Label>Two</Label>
            <Label>Three</Label>
            <Label>Four</Label>
            <Label>Five</Label>
          </LabelGroup>
        </ThemeAndStyleContainer>,
      )
      const list = page.getByRole('list')
      await expect.element(list).toBeInTheDocument()
      expect(list.element().tagName).toBe('UL')
      await expect.element(list).toHaveAttribute('data-list', 'true')
      expect(list.element().querySelectorAll('li')).toHaveLength(5)
    })

    it('with truncation', async () => {
      render(
        <ThemeAndStyleContainer>
          <LabelGroup visibleChildCount={3}>
            <Label>One</Label>
            <Label>Two</Label>
            <Label>Three</Label>
            <Label>Four</Label>
            <Label>Five</Label>
          </LabelGroup>
        </ThemeAndStyleContainer>,
      )
      const list = page.getByRole('list')
      await expect.element(list).toBeInTheDocument()
      expect(list.element().tagName).toBe('UL')
      await expect.element(list).toHaveAttribute('data-list', 'true')
      // account for "show more" button
      expect(list.element().querySelectorAll('li')).toHaveLength(6)
    })
  })

  describe('should render as custom element when `as` is provided', () => {
    it('without truncation', async () => {
      const {container} = render(
        <ThemeAndStyleContainer>
          <LabelGroup as="div">
            <Label>One</Label>
            <Label>Two</Label>
            <Label>Three</Label>
            <Label>Four</Label>
            <Label>Five</Label>
          </LabelGroup>
        </ThemeAndStyleContainer>,
      )
      const list = page.getByRole('list')
      await expect.element(list).not.toBeInTheDocument()
      const labelGroupDiv = container.querySelectorAll('div')[1]
      expect(labelGroupDiv.querySelectorAll('li')).toHaveLength(0)
      expect(labelGroupDiv.querySelectorAll('span')).toHaveLength(5)
      await expect.element(labelGroupDiv).not.toHaveAttribute('data-list')
    })

    it('with truncation', async () => {
      const {container} = render(
        <ThemeAndStyleContainer>
          <LabelGroup as="div" visibleChildCount={2}>
            <Label>One</Label>
            <Label>Two</Label>
            <Label>Three</Label>
            <Label>Four</Label>
            <Label>Five</Label>
          </LabelGroup>
        </ThemeAndStyleContainer>,
      )
      const list = page.getByRole('list')
      await expect.element(list).not.toBeInTheDocument()
      const labelGroupDiv = container.querySelectorAll('div')[1]
      expect(labelGroupDiv.querySelectorAll('li')).toHaveLength(0)
      expect(labelGroupDiv.querySelectorAll(':scope > span[data-index]')).toHaveLength(5)
      await expect.element(labelGroupDiv.querySelector('span[data-component="LabelGroup.Toggle"]')).toBeInTheDocument()
      await expect.element(labelGroupDiv).not.toHaveAttribute('data-list')
    })
  })

  describe('should render children as list items when rendered as ol', () => {
    it('without truncation', async () => {
      render(
        <ThemeAndStyleContainer>
          <LabelGroup as={'ol'}>
            <Label>One</Label>
            <Label>Two</Label>
            <Label>Three</Label>
            <Label>Four</Label>
            <Label>Five</Label>
          </LabelGroup>
        </ThemeAndStyleContainer>,
      )
      const list = page.getByRole('list')
      await expect.element(list).toBeInTheDocument()
      expect(list.element().tagName).toBe('OL')
      await expect.element(list).toHaveAttribute('data-list', 'true')
      expect(list.element().querySelectorAll('li')).toHaveLength(5)
    })
    it('with truncation', async () => {
      render(
        <ThemeAndStyleContainer>
          <LabelGroup as={'ol'} visibleChildCount={1}>
            <Label>One</Label>
            <Label>Two</Label>
            <Label>Three</Label>
            <Label>Four</Label>
            <Label>Five</Label>
          </LabelGroup>
        </ThemeAndStyleContainer>,
      )
      const list = page.getByRole('list')
      await expect.element(list).toBeInTheDocument()
      expect(list.element().tagName).toBe('OL')
      await expect.element(list).toHaveAttribute('data-list', 'true')
      // account for "show more" button
      expect(list.element().querySelectorAll('li')).toHaveLength(6)
    })
  })
})

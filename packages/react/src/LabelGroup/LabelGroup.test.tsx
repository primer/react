import type React from 'react'
import {render, waitFor} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import BaseStyles from '../BaseStyles'
import {LabelGroup, Label} from '..'
import userEvent from '@testing-library/user-event'
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

  it('should truncate labels to a specified number', () => {
    const {getByText} = render(
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
    const expandButton = getByText('+2')

    expect(expandButton).toBeDefined()
  })

  it('should expand all tokens into an overlay when overflowStyle="overlay"', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByText} = render(
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
    const expandButton = getByText('+2')
    await user.click(expandButton)
    await waitFor(() => getByLabelText('Close'))

    expect(document.activeElement).toBe(getByLabelText('Close'))
  })

  it('should expand all tokens in place when overflowStyle="inline"', async () => {
    const user = userEvent.setup()
    const {getByText} = render(
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
    const expandButton = getByText('+2')
    const fourthLabel = getByText('Four')

    expect(fourthLabel).not.toBeVisible()

    await user.click(expandButton)

    expect(fourthLabel).toBeVisible()
  })

  it('should focus the collapse button when expanded, and the expand button when collapsed', async () => {
    const user = userEvent.setup()
    const {getByText} = render(
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
    await user.click(getByText('+2'))
    await waitFor(() => getByText('Show less'))

    expect(document.activeElement).toEqual(getByText('Show less').closest('button'))

    // Collapse
    await user.click(getByText('Show less'))
    await waitFor(() => getByText('+2'))

    expect(document.activeElement).toEqual(getByText('+2').closest('button'))
  })

  describe('should render as ul by default', () => {
    it('without truncation', () => {
      const {getByRole} = render(
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
      const list = getByRole('list')
      expect(list).not.toBeNull()
      expect(list.tagName).toBe('UL')
      expect(list).toHaveAttribute('data-list', 'true')
      expect(list.querySelectorAll('li')).toHaveLength(5)
    })

    it('with truncation', () => {
      const {getByRole} = render(
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
      const list = getByRole('list')
      expect(list).not.toBeNull()
      expect(list.tagName).toBe('UL')
      expect(list).toHaveAttribute('data-list', 'true')
      // account for "show more" button
      expect(list.querySelectorAll('li')).toHaveLength(6)
    })
  })

  describe('should render as custom element when `as` is provided', () => {
    it('without truncation', () => {
      const {queryByRole, container} = render(
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
      const list = queryByRole('list')
      expect(list).toBeNull()
      const labelGroupDiv = container.querySelectorAll('div')[1]
      expect(labelGroupDiv.querySelectorAll('li')).toHaveLength(0)
      expect(labelGroupDiv.querySelectorAll('span')).toHaveLength(5)
      expect(labelGroupDiv).not.toHaveAttribute('data-list')
    })

    it('with truncation', () => {
      const {queryByRole, container} = render(
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
      const list = queryByRole('list')
      expect(list).toBeNull()
      const labelGroupDiv = container.querySelectorAll('div')[1]
      expect(labelGroupDiv.querySelectorAll('li')).toHaveLength(0)
      expect(labelGroupDiv.querySelectorAll(':scope > span')).toHaveLength(5)
      expect(labelGroupDiv).not.toHaveAttribute('data-list')
    })
  })

  describe('should render children as list items when rendered as ol', () => {
    it('without truncation', () => {
      const {getByRole} = render(
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
      const list = getByRole('list')
      expect(list).not.toBeNull()
      expect(list.tagName).toBe('OL')
      expect(list).toHaveAttribute('data-list', 'true')
      expect(list.querySelectorAll('li')).toHaveLength(5)
    })
    it('with truncation', () => {
      const {getByRole} = render(
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
      const list = getByRole('list')
      expect(list).not.toBeNull()
      expect(list.tagName).toBe('OL')
      expect(list).toHaveAttribute('data-list', 'true')
      // account for "show more" button
      expect(list.querySelectorAll('li')).toHaveLength(6)
    })
  })
})

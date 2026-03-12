import {renderHook} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import React from 'react'
import {useBreadcrumbsResponsive, getValidChildren} from '../useBreadcrumbsResponsive'
import {BreadcrumbsOverflowMenu} from '../BreadcrumbsOverflowMenu'

// Mock breadcrumb items for testing
const createMockItems = (count: number) => {
  return Array.from({length: count}, (_, i) => (
    <a key={i} href={`/${i}`}>
      Item {i + 1}
    </a>
  ))
}

describe('useBreadcrumbsResponsive', () => {
  describe('getValidChildren', () => {
    it('filters out non-element children', () => {
      const children = [<span key="1">Valid</span>, null, undefined, 'text', <div key="2">Also Valid</div>]
      const result = getValidChildren(children)
      expect(result).toHaveLength(2)
    })

    it('returns empty array for no valid children', () => {
      const result = getValidChildren([null, undefined, 'text'])
      expect(result).toHaveLength(0)
    })
  })

  describe('hook return values', () => {
    it('returns all children as visibleItems initially for wrap mode', () => {
      const items = createMockItems(3)
      const {result} = renderHook(() =>
        useBreadcrumbsResponsive({
          children: items,
          overflow: 'wrap',
        }),
      )

      expect(result.current.visibleItems).toHaveLength(3)
      expect(result.current.menuItems).toHaveLength(0)
      // In 'wrap' mode (not menu-with-root), showRoot is false since we're not using menu overflow
      expect(result.current.showRoot).toBe(false)
    })

    it('returns containerRef for attaching to container element', () => {
      const items = createMockItems(3)
      const {result} = renderHook(() =>
        useBreadcrumbsResponsive({
          children: items,
          overflow: 'menu',
        }),
      )

      expect(result.current.containerRef).toBeDefined()
      expect(result.current.containerRef.current).toBeNull() // Initially null
    })

    it('returns BreadcrumbsOverflowMenu component', () => {
      const items = createMockItems(3)
      const {result} = renderHook(() =>
        useBreadcrumbsResponsive({
          children: items,
          overflow: 'menu',
        }),
      )

      expect(result.current.BreadcrumbsOverflowMenu).toBe(BreadcrumbsOverflowMenu)
    })

    it('returns rootItem as the first valid child element', () => {
      const items = createMockItems(3)
      const {result} = renderHook(() =>
        useBreadcrumbsResponsive({
          children: items,
          overflow: 'menu',
        }),
      )

      // Check that rootItem is a valid element with the expected props
      expect(result.current.rootItem).toBeDefined()
      expect(result.current.rootItem?.props.href).toBe('/0')
    })
  })

  describe('overflow modes', () => {
    it('defaults overflow to wrap', () => {
      const items = createMockItems(3)
      const {result} = renderHook(() =>
        useBreadcrumbsResponsive({
          children: items,
        }),
      )

      // In wrap mode, all items should be visible
      expect(result.current.visibleItems).toHaveLength(3)
      expect(result.current.menuItems).toHaveLength(0)
    })

    it('handles menu-with-root overflow mode', () => {
      const items = createMockItems(3)
      const {result} = renderHook(() =>
        useBreadcrumbsResponsive({
          children: items,
          overflow: 'menu-with-root',
        }),
      )

      // showRoot should be true for menu-with-root mode
      expect(result.current.showRoot).toBe(true)
    })
  })
})

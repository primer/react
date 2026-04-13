import {render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {FilteredActionList} from '../FilteredActionList'
import {FilteredActionListBodyLoader, FilteredActionListLoadingTypes} from './FilteredActionListLoaders'

const items = [
  {text: 'Item 1', id: 1},
  {text: 'Item 2', id: 2},
  {text: 'Item 3', id: 3},
]

describe('FilteredActionList', () => {
  describe('data-component attributes', () => {
    it('renders FilteredActionList with data-component attribute', () => {
      const {container} = render(<FilteredActionList items={items} onFilterChange={vi.fn()} />)

      expect(container.querySelector('[data-component="FilteredActionList"]')).toBeInTheDocument()
    })

    it('renders FilteredActionList.Header with data-component attribute', () => {
      const {container} = render(<FilteredActionList items={items} onFilterChange={vi.fn()} />)

      expect(container.querySelector('[data-component="FilteredActionList.Header"]')).toBeInTheDocument()
    })

    it('renders FilteredActionList.SelectAll with data-component attribute when onSelectAllChange is provided', () => {
      const {container} = render(
        <FilteredActionList items={items} onFilterChange={vi.fn()} onSelectAllChange={vi.fn()} />,
      )

      expect(container.querySelector('[data-component="FilteredActionList.SelectAll"]')).toBeInTheDocument()
    })

    it('does not render FilteredActionList.SelectAll when onSelectAllChange is not provided', () => {
      const {container} = render(<FilteredActionList items={items} onFilterChange={vi.fn()} />)

      expect(container.querySelector('[data-component="FilteredActionList.SelectAll"]')).not.toBeInTheDocument()
    })
  })
})

describe('FilteredActionListBodyLoader', () => {
  describe('data-component attributes', () => {
    it('renders FilteredActionList.Spinner with data-component attribute for bodySpinner loading type', () => {
      const {container} = render(
        <FilteredActionListBodyLoader loadingType={FilteredActionListLoadingTypes.bodySpinner} height={200} />,
      )

      expect(container.querySelector('[data-component="FilteredActionList.Spinner"]')).toBeInTheDocument()
    })

    it('renders FilteredActionList.Skeleton with data-component attribute for bodySkeleton loading type', () => {
      const {container} = render(
        <FilteredActionListBodyLoader loadingType={FilteredActionListLoadingTypes.bodySkeleton} height={200} />,
      )

      expect(container.querySelector('[data-component="FilteredActionList.Skeleton"]')).toBeInTheDocument()
    })
  })
})

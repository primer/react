import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {FilteredSearch} from '../../deprecated'
import classes from '../../deprecated/FilteredSearch/FilteredSearch.module.css'
import {implementsClassName} from '../../utils/testing'

describe('FilteredSearch', () => {
  implementsClassName(FilteredSearch, classes.FilteredSearch)
  it('should render FilteredSearch', async () => {
    render(<FilteredSearch>Hello</FilteredSearch>)
    await expect.element(page.getByText('Hello')).toBeInTheDocument()
  })

  it('renders a <div>', () => {
    const {container} = render(<FilteredSearch />)
    expect(container.firstElementChild?.tagName).toEqual('DIV')
  })
})

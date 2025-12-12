import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {FilteredSearch} from '../../deprecated'
import classes from '../../deprecated/FilteredSearch/FilteredSearch.module.css'
import {implementsClassName} from '../../utils/testing'

describe('FilteredSearch', () => {
  implementsClassName(FilteredSearch, classes.FilteredSearch)
  it('should render FilteredSearch', () => {
    const {getByText} = render(<FilteredSearch>Hello</FilteredSearch>)
    expect(getByText('Hello')).toBeInTheDocument()
  })

  it('renders a <div>', () => {
    const {container} = render(<FilteredSearch />)
    expect(container.firstElementChild?.tagName).toEqual('DIV')
  })
})

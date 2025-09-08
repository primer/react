import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {FilteredSearch} from '../../deprecated'

describe('FilteredSearch', () => {
  it('should render FilteredSearch', () => {
    const {getByText} = render(<FilteredSearch>Hello</FilteredSearch>)
    expect(getByText('Hello')).toBeInTheDocument()
  })

  it('renders a <div>', () => {
    const {container} = render(<FilteredSearch />)
    expect(container.firstElementChild?.tagName).toEqual('DIV')
  })
})

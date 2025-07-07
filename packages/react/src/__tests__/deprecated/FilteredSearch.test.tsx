import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {FilteredSearch} from '../../deprecated'

describe('FilteredSearch', () => {
  it('renders a <div>', () => {
    const {container} = render(<FilteredSearch />)
    expect(container.firstChild?.nodeName).toEqual('DIV')
  })
})

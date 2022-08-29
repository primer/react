import React from 'react'
import {FilteredSearch} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('FilteredSearch', () => {
  behavesAsComponent({Component: FilteredSearch})

  checkExports('FilteredSearch', {
    default: FilteredSearch
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FilteredSearch>Hello</FilteredSearch>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <div>', () => {
    expect(render(<FilteredSearch />).type).toEqual('div')
  })
})

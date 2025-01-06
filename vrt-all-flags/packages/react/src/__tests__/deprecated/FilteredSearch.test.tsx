import React from 'react'
import {FilteredSearch} from '../../deprecated'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('FilteredSearch', () => {
  behavesAsComponent({Component: FilteredSearch})

  checkExports('deprecated/FilteredSearch', {
    default: FilteredSearch,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FilteredSearch>Hello</FilteredSearch>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <div>', () => {
    expect(render(<FilteredSearch />).type).toEqual('div')
  })
})

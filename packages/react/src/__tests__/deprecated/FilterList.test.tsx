import React from 'react'
import {FilterList} from '../../deprecated'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('FilterList', () => {
  behavesAsComponent({Component: FilterList})

  checkExports('deprecated/FilterList', {
    default: FilterList,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FilterList>Hello</FilterList>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <ul>', () => {
    expect(render(<FilterList />).type).toEqual('ul')
  })
})

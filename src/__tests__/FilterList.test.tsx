import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import {FilterList} from '..'
import {behavesAsComponent, checkExports, render} from '../utils/testing'

expect.extend(toHaveNoViolations)

describe('FilterList', () => {
  behavesAsComponent({Component: FilterList})

  checkExports('FilterList', {
    default: FilterList,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FilterList>Hello</FilterList>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <ul>', () => {
    expect(render(<FilterList />).type).toEqual('ul')
  })
})

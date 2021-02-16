import React from 'react'
import {FilteredSearch} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('FilteredSearch', () => {
  behavesAsComponent({Component: FilteredSearch, systemPropArray: [COMMON]})

  checkExports('FilteredSearch', {
    default: FilteredSearch
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FilteredSearch>Hello</FilteredSearch>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders a <div>', () => {
    expect(render(<FilteredSearch />).type).toEqual('div')
  })
})

import React from 'react'
import {SubNav} from '..'
import {render, behavesAsComponent} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('SubNav.Link', () => {
  // This component does respect the `as` prop, but it affects the link inside, rather than the wrapping element,
  // which causes the test to fail.
  behavesAsComponent({Component: SubNav.Link, options: {skipAs: true}})

  it('renders an <li> + <a> by default', () => {
    const result = render(<SubNav.Link />)
    expect(result.type).toEqual('li')
    const firstChild = result.children![0]!
    if (typeof firstChild !== 'object') throw new Error(`unexpected child type: ${typeof firstChild}`)
    expect(firstChild.type).toEqual('a')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <SubNav.Links>
        <SubNav.Link />
      </SubNav.Links>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the "selected" prop', () => {
    expect(render(<SubNav.Link selected />)).toMatchSnapshot()
  })
})

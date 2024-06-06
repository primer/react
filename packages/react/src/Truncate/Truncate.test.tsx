import React from 'react'
import {Truncate} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Truncate', () => {
  behavesAsComponent({
    Component: Truncate,
    toRender: () => <Truncate title="a-long-branch-name" />,
  })

  checkExports('Truncate', {
    default: Truncate,
  })

  it('renders a <div> by default', () => {
    expect(render(<Truncate title="a-long-branch-name" />).type).toEqual('div')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Truncate title="a-long-branch-name">a-long-branch-name</Truncate>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the maxWidth prop', () => {
    expect(render(<Truncate maxWidth={250} title="a-long-branch-name" />)).toHaveStyleRule('max-width', '250px')
  })

  it('respects the inline prop', () => {
    expect(render(<Truncate inline title="a-long-branch-name" />)).toHaveStyleRule('display', 'inline-block')
  })

  it('respects the expandable prop', () => {
    expect(render(<Truncate expandable title="a-long-branch-name" />)).toHaveStyleRule('max-width', '10000px', {
      modifier: ':hover',
    })
  })
})

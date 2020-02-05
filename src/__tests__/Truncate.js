import React from 'react'
import Truncate from '../Truncate'
import {COMMON, TYPOGRAPHY} from '../constants'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Truncate', () => {
  it('renders a <div> by default', () => {
    expect(render(<Truncate title="a-long-branch-name" />).type).toEqual('div')
  })

  it('implements system props', () => {
    expect(Truncate).toImplementSystemProps(COMMON)
    expect(Truncate).toImplementSystemProps(TYPOGRAPHY)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Truncate title="a-long-branch-name">a-long-branch-name</Truncate>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(Truncate).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<Truncate as="strong" title="a-long-branch-name" />).type).toEqual('strong')
  })

  it('respects the maxWidth prop', () => {
    expect(render(<Truncate maxWidth={250} title="a-long-branch-name" />)).toHaveStyleRule('max-width', '250px')
  })

  it('respects the inline prop', () => {
    expect(render(<Truncate inline title="a-long-branch-name" />)).toHaveStyleRule('display', 'inline-block')
  })

  it('respects the expandable prop', () => {
    expect(render(<Truncate expandable title="a-long-branch-name" />)).toHaveStyleRule('max-width', '10000px', {
      modifier: ':hover'
    })
  })
})

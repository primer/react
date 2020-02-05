import React from 'react'
import Truncate from '../Truncate'
import TruncateExpandable from '../TruncateExpandable'
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

  it('respects the variant prop', () => {
    expect(render(<Truncate variant="target" title="a-long-branch-name" />)).toHaveStyleRule('display', 'inline-block')
  })
})

describe('TruncateExpandable', () => {
  it('renders a <div> by default', () => {
    expect(render(<TruncateExpandable title="a-long-branch-name" />).type).toEqual('div')
  })

  it('implements system props', () => {
    expect(TruncateExpandable).toImplementSystemProps(COMMON)
    expect(TruncateExpandable).toImplementSystemProps(TYPOGRAPHY)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <TruncateExpandable title="a-long-branch-name">a-long-branch-name</TruncateExpandable>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(TruncateExpandable).toSetDefaultTheme()
  })

  it('has the correct default styles', () => {
    expect(render(<TruncateExpandable title="a-long-branch-name" />)).toHaveStyleRule(
      'max-width',
      '10000px !important',
      {modifier: ':hover'}
    )
  })

  it('respects the "as" prop', () => {
    expect(render(<TruncateExpandable as="strong" title="a-long-branch-name" />).type).toEqual('strong')
  })

  it('respects the maxWidth prop', () => {
    expect(render(<TruncateExpandable maxWidth={250} title="a-long-branch-name" />)).toHaveStyleRule(
      'max-width',
      '250px'
    )
  })

  it('respects the variant prop', () => {
    expect(render(<TruncateExpandable variant="target" title="a-long-branch-name" />)).toHaveStyleRule(
      'display',
      'inline-block'
    )
  })
})

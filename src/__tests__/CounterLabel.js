import React from 'react'
import CounterLabel from '../CounterLabel'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {colors} from '../theme'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('CounterLabel', () => {
  it('renders a <span>', () => {
    expect(render(<CounterLabel />).type).toEqual('span')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<CounterLabel />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(CounterLabel).toSetDefaultTheme()
  })

  it('respects the gray "scheme" prop', () => {
    expect(render(<CounterLabel scheme="gray" />)).toHaveStyleRule('color', colors.white.trim())
    expect(render(<CounterLabel scheme="gray" />)).toHaveStyleRule('background-color', colors.gray[5].trim())
  })

  it('respects the gray-light "scheme" prop', () => {
    expect(render(<CounterLabel scheme="gray-light" />)).toHaveStyleRule('color', colors.gray[9].trim())
    expect(render(<CounterLabel scheme="gray-light" />)).toHaveStyleRule(
      'background-color',
      colors.blackfade15.replace(/\s/g, '')
    )
  })

  it('implements system props', () => {
    expect(CounterLabel).toImplementSystemProps(COMMON)
  })

  it('respects the "as" prop', () => {
    expect(render(<CounterLabel as="span" />).type).toEqual('span')
  })
})

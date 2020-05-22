import React from 'react'
import {CounterLabel} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {colors} from '../theme'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('CounterLabel', () => {
  behavesAsComponent(CounterLabel, [COMMON])

  checkExports('CounterLabel', {
    default: CounterLabel
  })

  it('renders a <span>', () => {
    expect(render(<CounterLabel />).type).toEqual('span')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<CounterLabel />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
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
})

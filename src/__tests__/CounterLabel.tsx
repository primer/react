import React from 'react'
import {CounterLabel} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import theme from '../theme'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {default as primitives} from '@primer/primitives'

expect.extend(toHaveNoViolations)

describe('CounterLabel', () => {
  behavesAsComponent({Component: CounterLabel, systemPropArray: [COMMON]})

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

  it('respects the primary "scheme" prop', () => {
    const p = primitives
    expect(render(<CounterLabel scheme="primary" />)).toHaveStyleRule(
      'color',
      theme.colors.counter?.primary.text.trim()
    )
    expect(render(<CounterLabel scheme="primary" />)).toHaveStyleRule(
      'background-color',
      theme.colors.counter?.primary.bg.trim()
    )
  })

  it('respects the secondary "scheme" prop', () => {
    expect(render(<CounterLabel scheme="secondary" />)).toHaveStyleRule('color', theme.colors.counter?.text.trim())
    expect(render(<CounterLabel scheme="secondary" />)).toHaveStyleRule('background-color', theme.colors.counter?.bg)
  })
})

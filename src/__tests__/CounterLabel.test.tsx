import React from 'react'
import {CounterLabel} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import theme from '../theme'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'

expect.extend(toHaveNoViolations)

describe('CounterLabel', () => {
  behavesAsComponent({Component: CounterLabel})

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
    expect(render(<CounterLabel scheme="primary" />)).toHaveStyleRule(
      'color',
      theme.colorSchemes.light.colors.counter?.primary.text.trim()
    )
    expect(render(<CounterLabel scheme="primary" />)).toHaveStyleRule(
      'background-color',
      theme.colorSchemes.light.colors.counter?.primary.bg.trim()
    )
  })

  it('respects the secondary "scheme" prop', () => {
    expect(render(<CounterLabel scheme="secondary" />)).toHaveStyleRule(
      'color',
      theme.colorSchemes.light.colors.counter?.text.trim()
    )
    expect(render(<CounterLabel scheme="secondary" />)).toHaveStyleRule(
      'background-color',
      theme.colorSchemes.light.colors.counter?.bg
    )
  })
})

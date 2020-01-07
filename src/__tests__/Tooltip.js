import React from 'react'
import Tooltip from '../Tooltip'
import {render, renderClasses, rendersClass} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Tooltip', () => {
  it('implements system props', () => {
    expect(Tooltip).toImplementSystemProps(COMMON)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Tooltip text="hi" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(Tooltip).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<Tooltip as="span" />).type).toEqual('span')
  })

  it('renders a <span> with the "tooltipped" class', () => {
    expect(render(<Tooltip />).type).toEqual('span')
    expect(renderClasses(<Tooltip />)).toContain('tooltipped-n')
  })

  it('respects the "align" prop', () => {
    expect(rendersClass(<Tooltip align="left" />, 'tooltipped-align-left-2')).toBe(true)
    expect(rendersClass(<Tooltip align="right" />, 'tooltipped-align-right-2')).toBe(true)
  })

  it('respects the "direction" prop', () => {
    for (const direction of Tooltip.directions) {
      expect(rendersClass(<Tooltip direction={direction} />, `tooltipped-${direction}`)).toBe(true)
    }
  })

  it('respects the "noDelay" prop', () => {
    expect(rendersClass(<Tooltip noDelay />, 'tooltipped-no-delay')).toBe(true)
  })

  it('respects the "text" prop', () => {
    expect(render(<Tooltip text="hi" />).props['aria-label']).toEqual('hi')
  })

  it('respects the "wrap" prop', () => {
    expect(rendersClass(<Tooltip wrap />, 'tooltipped-multiline')).toBe(true)
  })
})

import React from 'react'
import Box from '../Box'
import theme from '../theme'
import {render} from '../utils/testing'
import {LAYOUT, COMMON} from '../constants'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)


describe('Box', () => {
  it("should have no axe violations", async () => {
    const {container} = HTMLRender(<Box/>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('implements system props', () => {
    expect(Box).toImplementSystemProps(LAYOUT)
    expect(Box).toImplementSystemProps(COMMON)
  })

  it('respects the "as" prop', () => {
    expect(render(<Box as="span" />).type).toEqual('span')
  })

  it('renders without any props', () => {
    expect(render(<Box />)).toMatchSnapshot()
  })

  it('has default theme', () => {
    expect(Box).toSetDefaultTheme()
  })

  it('renders margin', () => {
    expect(render(<Box m={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box m={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box m={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })

  it('renders padding', () => {
    expect(render(<Box p={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box p={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box p={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })

  it('respects display', () => {
    expect(render(<Box display="inline" />)).toMatchSnapshot()
    expect(render(<Box display="inline-block" />)).toMatchSnapshot()
    expect(render(<Box display="none" />)).toMatchSnapshot()
    expect(render(<Box display={['none', 'none', 'block']} theme={theme} />)).toMatchSnapshot()
  })
})

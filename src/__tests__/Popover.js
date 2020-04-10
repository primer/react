import React from 'react'
import Popover, {CARET_POSITIONS} from '../Popover'
import {render} from '../utils/testing'
import {BORDER, COMMON, LAYOUT, POSITION} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Popover and Popover.Content', () => {
  it('implements system props', () => {
    expect(Popover).toImplementSystemProps(COMMON)
    expect(Popover).toImplementSystemProps(LAYOUT)
    expect(Popover).toImplementSystemProps(POSITION)

    expect(Popover.Content).toImplementSystemProps(COMMON)
    expect(Popover.Content).toImplementSystemProps(LAYOUT)
    expect(Popover.Content).toImplementSystemProps(BORDER)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <Popover caret="top" open>
        <Popover.Content>Hello!</Popover.Content>
      </Popover>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(Popover).toSetDefaultTheme()
    expect(Popover.Content).toSetDefaultTheme()
  })

  it('renders with default props', () => {
    expect(render(<Popover />)).toMatchSnapshot()
    expect(render(<Popover.Content />)).toMatchSnapshot()
  })

  for (const pos of CARET_POSITIONS) {
    it(`renders correctly for a caret position of ${pos}`, () => {
      const element = (
        <Popover caret={pos} open>
          <Popover.Content>Hello!</Popover.Content>
        </Popover>
      )

      expect(render(element)).toMatchSnapshot()
    })
  }

  it('renders both elements as a <div>', () => {
    expect(render(<Popover />).type).toEqual('div')
    expect(render(<Popover.Content />).type).toEqual('div')
  })
})

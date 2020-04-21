import React from 'react'
import Popover, {CARET_POSITIONS} from '../Popover'
import {render, behavesAsComponent} from '../utils/testing'
import {BORDER, COMMON, LAYOUT, POSITION} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

const comp = (
  <Popover caret="top" open>
    <Popover.Content>Hello!</Popover.Content>
  </Popover>
)

describe('Popover', () => {
  behavesAsComponent(Popover, [COMMON, LAYOUT, POSITION], () => comp)

  describe('Popover.Content', () => {
    behavesAsComponent(Popover.Content, [COMMON, LAYOUT, BORDER], () => comp)
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

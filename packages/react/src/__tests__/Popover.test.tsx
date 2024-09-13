import React from 'react'
import type {PopoverProps} from '../Popover'
import Popover from '../Popover'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

const comp = (
  <Popover caret="top" open>
    <Popover.Content>Hello!</Popover.Content>
  </Popover>
)

describe('Popover', () => {
  behavesAsComponent({Component: Popover, toRender: () => comp})

  checkExports('Popover', {
    default: Popover,
  })

  describe('Popover.Content', () => {
    behavesAsComponent({Component: Popover.Content, toRender: () => comp})
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <Popover caret="top" open>
        <Popover.Content>Hello!</Popover.Content>
      </Popover>,
    )
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  const CARET_POSITIONS: PopoverProps['caret'][] = [
    'top',
    'bottom',
    'left',
    'right',
    'bottom-left',
    'bottom-right',
    'top-left',
    'top-right',
    'left-bottom',
    'left-top',
    'right-bottom',
    'right-top',
  ]

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

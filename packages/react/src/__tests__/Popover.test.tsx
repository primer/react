import React from 'react'
import Popover from '../Popover'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

const comp = (
  <Popover open>
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
      <Popover open>
        <Popover.Content>Hello!</Popover.Content>
      </Popover>,
    )
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders both elements as a <div>', () => {
    expect(render(<Popover />).type).toEqual('div')
    expect(render(<Popover.Content />).type).toEqual('div')
  })
})

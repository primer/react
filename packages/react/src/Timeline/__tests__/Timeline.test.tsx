import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {render, rendersClass, behavesAsComponent, checkExports} from '../../utils/testing'

import React from 'react'
import Timeline from '..'

describe('Timeline', () => {
  behavesAsComponent({Component: Timeline})

  checkExports('Timeline', {
    default: Timeline,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders with clipSidebar prop', () => {
    expect(render(<Timeline clipSidebar />)).toMatchSnapshot()
  })
})

describe('Timeline.Item', () => {
  behavesAsComponent({Component: Timeline.Item})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <Timeline>
        <Timeline.Item />
      </Timeline>,
    )
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders with condensed prop', () => {
    expect(render(<Timeline.Item condensed />)).toMatchSnapshot()
  })

  it('adds the Timeline-Item class', () => {
    expect(rendersClass(<Timeline.Item />, 'Timeline-Item')).toEqual(true)
  })
})

describe('Timeline.Badge', () => {
  behavesAsComponent({Component: Timeline.Badge, options: {skipAs: true}})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline.Badge />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Timeline.Break', () => {
  behavesAsComponent({Component: Timeline.Break})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline.Break />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Timeline.Group', () => {
  behavesAsComponent({Component: Timeline.Group, options: {skipAs: true, skipSx: true}})

  // TODO
  it.todo('correctly renders with Timeline.Group')

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <Timeline>
        <Timeline.Group>
          <Timeline.Item>test</Timeline.Item>
        </Timeline.Group>
      </Timeline>,
    )
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })
})

import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {render, rendersClass, behavesAsComponent, checkExports} from '../../utils/testing'

import React from 'react'
import Timeline from '..'

describe('Timeline', () => {
  behavesAsComponent({Component: Timeline, options: {skipAs: true}})

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

  it('should support `className` on the outermost element', () => {
    expect(HTMLRender(<Timeline className={'test-class-name'} />).container.firstChild).toHaveClass('test-class-name')
  })
})

describe('Timeline.Item', () => {
  behavesAsComponent({Component: Timeline.Item, options: {skipAs: true}})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline.Item />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders with condensed prop', () => {
    expect(render(<Timeline.Item condensed />)).toMatchSnapshot()
  })

  it('adds the Timeline-Item class', () => {
    expect(rendersClass(<Timeline.Item />, 'Timeline-Item')).toEqual(true)
  })

  it('should support `className` on the outermost element', () => {
    expect(HTMLRender(<Timeline.Item className={'test-class-name'} />).container.firstChild).toHaveClass(
      'test-class-name',
    )
  })
})

describe('Timeline.Badge', () => {
  behavesAsComponent({Component: Timeline.Badge, options: {skipAs: true}})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline.Badge />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should support `className` on the outermost element', () => {
    expect(HTMLRender(<Timeline.Badge className={'test-class-name'} />).container.firstChild?.firstChild).toHaveClass(
      'test-class-name',
    )
  })
})

describe('Timeline.Body', () => {
  behavesAsComponent({Component: Timeline.Badge, options: {skipAs: true}})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline.Body />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should support `className` on the outermost element', () => {
    expect(HTMLRender(<Timeline.Body className={'test-class-name'} />).container.firstChild).toHaveClass(
      'test-class-name',
    )
  })
})

describe('Timeline.Break', () => {
  behavesAsComponent({Component: Timeline.Badge, options: {skipAs: true}})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline.Break />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should support `className` on the outermost element', () => {
    expect(HTMLRender(<Timeline.Break className={'test-class-name'} />).container.firstChild).toHaveClass(
      'test-class-name',
    )
  })
})

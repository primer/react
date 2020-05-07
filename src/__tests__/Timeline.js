import 'babel-polyfill'

import {COMMON, FLEX, LAYOUT} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {render, rendersClass, behavesAsComponent, checkExports} from '../utils/testing'

import React from 'react'
import {Timeline} from '..'
expect.extend(toHaveNoViolations)

describe('Timeline', () => {
  behavesAsComponent(Timeline, [COMMON, FLEX, LAYOUT])

  checkExports('Timeline', {
    default: Timeline
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders with clipSidebar prop', () => {
    expect(render(<Timeline clipSidebar />)).toMatchSnapshot()
  })
})

describe('Timeline.Item', () => {
  behavesAsComponent(Timeline.Item, [COMMON, FLEX, LAYOUT])

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline.Item />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders with condensed prop', () => {
    expect(render(<Timeline.Item condensed />)).toMatchSnapshot()
  })

  it('adds the Timeline-Item class', () => {
    expect(rendersClass(<Timeline.Item />, 'Timeline-Item')).toEqual(true)
  })
})

describe('Timeline.Badge', () => {
  behavesAsComponent(Timeline.Badge, [COMMON, LAYOUT], {skipAs: true})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Timeline.Badge />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})

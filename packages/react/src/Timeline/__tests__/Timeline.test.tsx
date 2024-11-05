import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {render, rendersClass, behavesAsComponent, checkExports} from '../../utils/testing'

import React from 'react'
import Timeline from '..'
import {FeatureFlags} from '../../FeatureFlags'

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

  it("should render as 'li' if FF is turned on", () => {
    const {getByRole} = HTMLRender(
      <FeatureFlags flags={{primer_react_timeline_as_list: true}}>
        <Timeline.Item />
      </FeatureFlags>,
    )
    expect(getByRole('listitem')).toBeInTheDocument()
    expect(getByRole('listitem').tagName).toBe('LI')
  })

  it("should render as 'div' by default", () => {
    const {queryByRole, getByText} = HTMLRender(<Timeline.Item>test</Timeline.Item>)
    expect(queryByRole('listitem')).toBeNull()
    expect(getByText('test').tagName).toBe('DIV')
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

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <FeatureFlags flags={{primer_react_timeline_as_list: true}}>
        <Timeline>
          <Timeline.Group>
            <Timeline.Item>test</Timeline.Item>
          </Timeline.Group>
        </Timeline>
      </FeatureFlags>,
    )
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should throw warning if FF not enabled', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    HTMLRender(
      <Timeline>
        <Timeline.Group>
          <Timeline.Item>test</Timeline.Item>
        </Timeline.Group>
      </Timeline>,
    )
    expect(spy).toHaveBeenCalledWith(
      'Warning:',
      "Timeline.Group is only meant to be used with the timeline as list feature, you may want to turn on the 'primer_react_timeline_as_list' feature flag. Using Timeline.Group without this feature may have unintended consequences",
    )

    spy.mockRestore()
  })
})

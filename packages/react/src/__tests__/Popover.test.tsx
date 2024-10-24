import React from 'react'
import Popover from '../Popover'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {FeatureFlags} from '../FeatureFlags'

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

  it('should support `className` on the outermost element', () => {
    const Element = () => <Popover className={'test-class-name'}></Popover>
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_team: true,
            primer_react_css_modules_staff: true,
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
    expect(HTMLRender(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
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

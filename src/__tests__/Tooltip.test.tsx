import React from 'react'
import Tooltip, {TooltipProps} from '../Tooltip'
import {ReactTestRendererJSON} from 'react-test-renderer'
import {render, childRenderClasses, childRendersClass, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Tooltip', () => {
  behavesAsComponent({Component: Tooltip, options: {skipAs: true}})

  checkExports('Tooltip', {
    default: Tooltip,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Tooltip text="hi" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <span> with the "tooltipped" class', () => {
    expect(render(<Tooltip />).type).toEqual('span')
    expect(childRenderClasses(<Tooltip />, -1)).toContain('tooltipped-n')
  })

  it('respects the "direction" prop', () => {
    for (const direction of Tooltip.directions) {
      expect(
        childRendersClass(
          <Tooltip direction={direction as TooltipProps['direction']} />,
          `tooltipped-${direction}`,
          -1,
        ),
      ).toBe(true)
    }
  })

  it('respects the "noDelay" prop', () => {
    expect(childRendersClass(<Tooltip noDelay />, 'tooltipped-no-delay', -1)).toBe(true)
  })

  it('respects the "text" prop', () => {
    const tooltip = render(<Tooltip text="hi" />) as ReactTestRendererJSON
    const child = tooltip.children?.at(-1) as ReactTestRendererJSON
    expect(child.props['aria-label']).toEqual('hi')
  })

  it('respects the "wrap" prop', () => {
    expect(childRendersClass(<Tooltip wrap />, 'tooltipped-multiline', -1)).toBe(true)
  })
})

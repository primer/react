import React from 'react'
import type {TooltipProps} from './Tooltip'
import Tooltip from './Tooltip'
import {render, renderClasses, rendersClass, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, screen} from '@testing-library/react'
import axe from 'axe-core'
import {CodeIcon} from '@primer/octicons-react'

/* Tooltip v1 */

describe('Tooltip', () => {
  behavesAsComponent({Component: Tooltip})

  checkExports('Tooltip', {
    default: Tooltip,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Tooltip text="hi" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <span> with the "tooltipped" class', () => {
    expect(render(<Tooltip />).type).toEqual('span')
    expect(renderClasses(<Tooltip />)).toContain('tooltipped-n')
  })

  it('respects the "align" prop', () => {
    expect(rendersClass(<Tooltip align="left" />, 'tooltipped-align-left-2')).toBe(true)
    expect(rendersClass(<Tooltip align="right" />, 'tooltipped-align-right-2')).toBe(true)
  })

  it('respects the "direction" prop', () => {
    for (const direction of Tooltip.directions) {
      expect(
        rendersClass(<Tooltip direction={direction as TooltipProps['direction']} />, `tooltipped-${direction}`),
      ).toBe(true)
    }
  })

  it('respects the "noDelay" prop', () => {
    expect(rendersClass(<Tooltip noDelay />, 'tooltipped-no-delay')).toBe(true)
  })

  it('respects the "text" prop', () => {
    expect(render(<Tooltip text="hi" />).props['aria-label']).toEqual('hi')
  })

  it('respects the "wrap" prop', () => {
    expect(rendersClass(<Tooltip wrap />, 'tooltipped-multiline')).toBe(true)
  })
  it('should label the link', () => {
    HTMLRender(
      <Tooltip aria-label="Tooltip text" id="tooltip-unique-id">
        <a aria-labelledby="tooltip-unique-id" href="#href">
          <CodeIcon />
        </a>
      </Tooltip>,
    )
    expect(screen.getByRole('link')).toHaveAccessibleName('Tooltip text')
  })
})

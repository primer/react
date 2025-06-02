import type {TooltipProps} from './Tooltip'
import Tooltip from './Tooltip'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {CodeIcon} from '@primer/octicons-react'

/* Tooltip v1 */

describe('Tooltip', () => {
  it('renders a <span> with the "tooltipped" class', () => {
    const {container} = render(<Tooltip />)
    expect(container.firstChild?.nodeName).toEqual('SPAN')
    expect(container.firstChild).toHaveClass('tooltipped-n')
  })

  it('respects the "align" prop', () => {
    const {container: leftContainer} = render(<Tooltip align="left" />)
    expect(leftContainer.firstChild).toHaveClass('tooltipped-align-left-2')

    const {container: rightContainer} = render(<Tooltip align="right" />)
    expect(rightContainer.firstChild).toHaveClass('tooltipped-align-right-2')
  })

  it('respects the "direction" prop', () => {
    for (const direction of Tooltip.directions) {
      const {container} = render(<Tooltip direction={direction as TooltipProps['direction']} />)
      expect(container.firstChild).toHaveClass(`tooltipped-${direction}`)
    }
  })

  it('respects the "noDelay" prop', () => {
    const {container} = render(<Tooltip noDelay />)
    expect(container.firstChild).toHaveClass('tooltipped-no-delay')
  })

  it('respects the "text" prop', () => {
    const {container} = render(<Tooltip text="hi" />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'hi')
  })

  it('respects the "wrap" prop', () => {
    const {container} = render(<Tooltip wrap />)
    expect(container.firstChild).toHaveClass('tooltipped-multiline')
  })

  it('should label the link', () => {
    render(
      <Tooltip aria-label="Tooltip text" id="tooltip-unique-id">
        <a aria-labelledby="tooltip-unique-id" href="#href">
          <CodeIcon />
        </a>
      </Tooltip>,
    )
    expect(screen.getByRole('link')).toHaveAccessibleName('Tooltip text')
  })
})

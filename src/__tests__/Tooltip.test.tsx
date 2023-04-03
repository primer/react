import React from 'react'
import Tooltip, {TooltipProps} from '../Tooltip'
import Tooltip2, {Tooltip2Props} from '../Tooltip2'
import {render, renderClasses, rendersClass, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, act} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {IconButton} from '../Button'
import {SearchIcon} from '@primer/octicons-react'
import {userEvent} from '@storybook/testing-library'

expect.extend(toHaveNoViolations)

describe('Tooltip', () => {
  behavesAsComponent({Component: Tooltip})

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
})

const TooltipComponent = (props: Tooltip2Props) => (
  <Tooltip2 aria-label="label type tooltip" {...props}>
    <IconButton icon={SearchIcon} aria-label="Search button" />
  </Tooltip2>
)

describe('Tooltip2', () => {
  it('renders `data-direction="n"` by default', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    expect(getByText('label type tooltip')).toHaveAttribute('data-direction', 'n')
  })
  it('renders `data-direction` attribute with the correct value when the `direction` prop is specified', () => {
    const {getByText} = HTMLRender(<TooltipComponent direction="s" />)
    expect(getByText('label type tooltip')).toHaveAttribute('data-direction', 's')
  })

  it('renders `data-no-delay` attribute with the correct value when the `noDelay` prop is specified', () => {
    const {getByText} = HTMLRender(<TooltipComponent noDelay />)
    expect(getByText('label type tooltip')).toHaveAttribute('data-no-delay', 'true')
  })

  it('renders `data-wrap` attribute with the correct value when the `wrap` prop is specified', () => {
    const {getByText} = HTMLRender(<TooltipComponent wrap />)
    expect(getByText('label type tooltip')).toHaveAttribute('data-wrap', 'true')
  })
  it('renders `data-align` attribute with the correct value when the `align` prop is specified', () => {
    const {getByText} = HTMLRender(<TooltipComponent align="right" />)
    expect(getByText('label type tooltip')).toHaveAttribute('data-align', 'right')
  })
  it('should label the trigger element by its tooltip when the tooltip type is label', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('label type tooltip')
    expect(triggerEL).toHaveAttribute('aria-labelledby', tooltipEl.id)
  })
  it('should render aria-hidden on the tooltip element when the tooltip is label type', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    expect(getByText('label type tooltip')).toHaveAttribute('aria-hidden', 'true')
  })
  it('should describe the trigger element by its tooltip when the tooltip type is describe', () => {
    const {getByRole, getByText} = HTMLRender(
      <TooltipComponent type="description" text="This is description for the trigger element" />,
    )
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('This is description for the trigger element')
    expect(triggerEL).toHaveAttribute('aria-describedby', tooltipEl.id)
  })
  it('should render the tooltip element with role="tooltip" when the tooltip type is describe', () => {
    const {getByText} = HTMLRender(
      <TooltipComponent type="description" text="This is description for the trigger element" />,
    )
    expect(getByText('This is description for the trigger element')).toHaveAttribute('role', 'tooltip')
  })
  it('should display the tooltip when the trigger element is hovered', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    userEvent.hover(triggerEL)
    expect(getByText('label type tooltip')).toHaveAttribute('data-state', 'open')
  })
  it('should display the tooltip when the trigger element is focused', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    act(() => {
      triggerEL.focus()
    })
    expect(getByText('label type tooltip')).toHaveAttribute('data-state', 'open')
  })
  it('should hide the tooltip when the trigger element is blurred', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    act(() => {
      triggerEL.focus()
    })
    userEvent.tab()
    expect(getByText('label type tooltip')).not.toHaveAttribute('data-state', 'open')
  })
  it('should hide the tooltip when the ESC key is pressed', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    act(() => {
      triggerEL.focus()
    })
    userEvent.type(triggerEL, '{esc}')
    expect(getByText('label type tooltip')).not.toHaveAttribute('data-state', 'open')
  })
})

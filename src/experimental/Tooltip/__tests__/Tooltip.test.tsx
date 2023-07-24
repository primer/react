import React from 'react'
import {Tooltip, TooltipProps} from '../Tooltip'
import {checkStoriesForAxeViolations} from '../../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {Button} from '../../../Button'

const TooltipComponent = (props: TooltipProps) => (
  <Tooltip text="Tooltip text" {...props}>
    <Button>Button Text</Button>
  </Tooltip>
)

describe('Tooltip', () => {
  checkStoriesForAxeViolations('Tooltip.features', '../experimental/Tooltip/')

  it('renders `data-direction="n"` by default', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    expect(getByText('Tooltip text')).toHaveAttribute('data-direction', 'n')
  })
  it('renders `data-direction` attribute with the correct value when the `direction` prop is specified', () => {
    const {getByText} = HTMLRender(<TooltipComponent direction="s" />)
    expect(getByText('Tooltip text')).toHaveAttribute('data-direction', 's')
  })

  it('renders `data-no-delay` attribute with the correct value when the `noDelay` prop is specified', () => {
    const {getByText} = HTMLRender(<TooltipComponent noDelay />)
    expect(getByText('Tooltip text')).toHaveAttribute('data-no-delay', 'true')
  })
  it('should label the trigger element by its tooltip when the tooltip type is label', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent type="label" />)
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('Tooltip text')
    expect(triggerEL).toHaveAttribute('aria-labelledby', tooltipEl.id)
  })
  it('should render aria-hidden on the tooltip element when the tooltip is label type', () => {
    const {getByText} = HTMLRender(<TooltipComponent type="label" />)
    expect(getByText('Tooltip text')).toHaveAttribute('aria-hidden', 'true')
  })
  it('should describe the trigger element by its tooltip when the tooltip type is description (by default)', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('Tooltip text')
    expect(triggerEL).toHaveAttribute('aria-describedby', tooltipEl.id)
  })
  it('should render the tooltip element with role="tooltip" when the tooltip type is description (by default)', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    expect(getByText('Tooltip text')).toHaveAttribute('role', 'tooltip')
  })
})

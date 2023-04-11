import React from 'react'
import {Tooltip, TooltipProps} from '..'
import {checkStoriesForAxeViolations, checkExports} from '../../utils/testing'
import {render as HTMLRender, act} from '@testing-library/react'
import {Button} from '../../Button'
import {SearchIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'

const TooltipComponent = (props: TooltipProps) => (
  <Tooltip aria-label="label type tooltip" {...props}>
    <Button>
      <SearchIcon />
    </Button>
  </Tooltip>
)

describe('Tooltip', () => {
  checkExports('Tooltip', {
    default: undefined,
    Tooltip,
  })

  checkStoriesForAxeViolations('Tooltip.features', '../Tooltip/')

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
  it('should display the tooltip when the trigger element is hovered', async () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    const user = userEvent.setup()
    await user.hover(triggerEL)
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
  it('should hide the tooltip when the trigger element is blurred', async () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    const user = userEvent.setup()
    act(() => {
      triggerEL.focus()
    })
    await user.keyboard('{TAB}')
    expect(getByText('label type tooltip')).not.toHaveAttribute('data-state', 'open')
  })
  it('should hide the tooltip when the ESC key is pressed', async () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    const user = userEvent.setup()
    act(() => {
      triggerEL.focus()
    })
    await user.keyboard('{Escape}')
    expect(getByText('label type tooltip')).not.toHaveAttribute('data-state', 'open')
  })
})

import React from 'react'
import type {TooltipProps} from '../Tooltip'
import {Tooltip} from '../Tooltip'
import {checkStoriesForAxeViolations} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import theme from '../../theme'
import {Button, IconButton, ActionMenu, ActionList, ThemeProvider, BaseStyles} from '../..'
import {XIcon} from '@primer/octicons-react'

const TooltipComponent = (props: Omit<TooltipProps, 'text'> & {text?: string}) => (
  <Tooltip text="Tooltip text" {...props}>
    <Button>Button Text</Button>
  </Tooltip>
)

function ExampleWithActionMenu(actionMenuTrigger: React.ReactElement): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <ActionMenu>
          {actionMenuTrigger}
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('Tooltip', () => {
  checkStoriesForAxeViolations('Tooltip.features', '../TooltipV2/')

  it('renders `data-direction="s"` by default', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    expect(getByText('Tooltip text')).toHaveAttribute('data-direction', 's')
  })
  it('renders `data-direction` attribute with the correct value when the `direction` prop is specified', () => {
    const {getByText} = HTMLRender(<TooltipComponent direction="n" />)
    expect(getByText('Tooltip text')).toHaveAttribute('data-direction', 'n')
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
    expect(triggerEL.getAttribute('aria-describedby')).toContain(tooltipEl.id)
  })
  it('should render the tooltip element with role="tooltip" when the tooltip type is description (by default)', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    expect(getByText('Tooltip text')).toHaveAttribute('role', 'tooltip')
  })

  it('should spread the accessibility attributes correctly on the trigger (ActionMenu.Button) when tooltip is used in an action menu', () => {
    const {getByRole, getByText} = HTMLRender(
      ExampleWithActionMenu(
        <Tooltip text="Additional context about the menu button">
          <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
        </Tooltip>,
      ),
    )
    const menuButton = getByRole('button')
    const tooltip = getByText('Additional context about the menu button')
    expect(menuButton.getAttribute('aria-describedby')).toContain(tooltip.id)
    expect(menuButton).toHaveAttribute('aria-haspopup', 'true')
  })

  it('should spread the accessibility attributes correctly on the trigger (Button) when tooltip is used in an action menu', () => {
    const {getByRole, getByText} = HTMLRender(
      ExampleWithActionMenu(
        <ActionMenu.Anchor>
          <Tooltip text="Additional context about the menu button">
            <Button>Toggle Menu</Button>
          </Tooltip>
        </ActionMenu.Anchor>,
      ),
    )
    const menuButton = getByRole('button')
    const tooltip = getByText('Additional context about the menu button')
    expect(menuButton.getAttribute('aria-describedby')).toContain(tooltip.id)
    expect(menuButton).toHaveAttribute('aria-haspopup', 'true')
  })
  it('should use the custom tooltip id (if present) to label the trigger element', () => {
    const {getByRole} = HTMLRender(
      <Tooltip id="custom-tooltip-id" text="Close feedback form" direction="nw" type="label">
        <IconButton aria-labelledby="custom-tooltip-id" icon={XIcon} variant="invisible" onClick={() => {}} />
      </Tooltip>,
    )
    const triggerEL = getByRole('button')
    expect(triggerEL).toHaveAttribute('aria-labelledby', 'custom-tooltip-id')
  })
  it('should use the custom tooltip id (if present) to described the trigger element', () => {
    const {getByRole} = HTMLRender(
      <Tooltip text="This operation cannot be reverted" id="custom-tooltip-id">
        <Button>Delete</Button>
      </Tooltip>,
    )
    const triggerEL = getByRole('button')
    expect(triggerEL.getAttribute('aria-describedby')).toContain('custom-tooltip-id')
  })
})

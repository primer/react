import type React from 'react'
import {describe, expect, it} from 'vitest'
import type {TooltipProps} from '../Tooltip'
import {Tooltip} from '../Tooltip'
import {render as HTMLRender} from '@testing-library/react'
import BaseStyles from '../../BaseStyles'
import {Button, IconButton, ActionMenu, ActionList, ButtonGroup} from '../..'
import {XIcon} from '@primer/octicons-react'
import classes from '../Tooltip.module.css'

import type {JSX} from 'react'
import {implementsClassName} from '../../utils/testing'

const TooltipComponent = (props: Omit<TooltipProps, 'text'> & {text?: string}) => (
  <Tooltip text="Tooltip text" {...props}>
    <Button>Button Text</Button>
  </Tooltip>
)

const TooltipComponentWithExistingDescription = (props: Omit<TooltipProps, 'text'> & {text?: string}) => (
  <>
    <span id="external-description">External description</span>
    <Tooltip text="Tooltip text" {...props}>
      <Button aria-describedby="external-description">Button Text</Button>
    </Tooltip>
  </>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExampleWithActionMenu(actionMenuTrigger: React.ReactElement<any>): JSX.Element {
  return (
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
  )
}

describe('Tooltip', () => {
  implementsClassName(TooltipComponent, classes.Tooltip)
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
  it('should render aria-hidden on the tooltip element when the tooltip is description type', () => {
    const {getByText} = HTMLRender(<TooltipComponent type="description" />)
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
  it('should throw an error if the trigger element is disabled', () => {
    expect(() => {
      HTMLRender(
        <Tooltip text="Tooltip text" direction="n">
          <Button disabled>Delete</Button>
        </Tooltip>,
      )
    }).toThrow(
      'The `Tooltip` component expects a single React element that contains interactive content. Consider using a `<button>` or equivalent interactive element instead.',
    )
  })
  it('should not throw an error when the trigger element is a button in a fieldset', () => {
    const {getByRole} = HTMLRender(
      <fieldset>
        <legend>Legend</legend>
        <Tooltip text="Tooltip text">
          <button type="button">Button Text</button>
        </Tooltip>
      </fieldset>,
    )

    const triggerEL = getByRole('button')
    expect(triggerEL).toBeInTheDocument()
  })
  it('should allow for two-level deep interactive elements', () => {
    const {getByText} = HTMLRender(
      <Tooltip text="Tooltip text">
        <ButtonGroup>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </Tooltip>,
    )

    const triggerEL = getByText('Button 1')
    expect(triggerEL).toBeInTheDocument()
  })
  it('includes keybinding hints in the label text', () => {
    const {getByRole} = HTMLRender(<TooltipComponent type="label" keybindingHint="Control+K" />)
    expect(getByRole('button', {name: 'Tooltip text (control k)'})).toBeInTheDocument()
  })
  it('allows overriding the accessible label with aria-label', () => {
    const {getByRole} = HTMLRender(
      <TooltipComponent type="label" keybindingHint="Control+K" aria-label="Overridden label" />,
    )
    expect(getByRole('button', {name: 'Overridden label'})).toBeInTheDocument()
  })

  it('should append tooltip id to existing aria-describedby value on the trigger element', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponentWithExistingDescription />)
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('Tooltip text')
    const externalDescription = getByText('External description')

    // Check that aria-describedby contains both the external description ID and the tooltip ID
    const describedBy = triggerEL.getAttribute('aria-describedby')
    expect(describedBy).toContain(externalDescription.id)
    expect(describedBy).toContain(tooltipEl.id)
  })
})

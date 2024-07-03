/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react'
import type {Meta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {Tooltip} from '../next'
import {IconButton, Button, ActionMenu, ActionList} from '..'
import {PlusIcon, DashIcon, TriangleDownIcon} from '@primer/octicons-react'

const meta = {
  title: 'Components/ButtonGroup/Features',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta

export const IconButtons = () => (
  <ButtonGroup>
    <IconButton icon={PlusIcon} aria-label="Add" />
    <IconButton icon={DashIcon} aria-label="Subtract" />
  </ButtonGroup>
)

export const IconButtonsWithTooltip = () => (
  <ButtonGroup>
    <Tooltip text="Add" type="label">
      <IconButton icon={PlusIcon} aria-label="Add" />
    </Tooltip>
    <Tooltip text="Subtract" type="label">
      <IconButton icon={DashIcon} aria-label="Subtract" />
    </Tooltip>
  </ButtonGroup>
)
export const ButtonAndLink = () => (
  <ButtonGroup>
    <Button>Button</Button>
    <Button as="a" href="https://primer.style">
      Link
    </Button>
  </ButtonGroup>
)

export const LinksWithTooltip = () => (
  <ButtonGroup>
    <Tooltip text="Additonal text for link 1" direction="s">
      <Button as="a" href="https://primer.style">
        Sample Link 1
      </Button>
    </Tooltip>
    <Tooltip text="Additonal text for link 2" direction="s">
      <Button as="a" href="https://primer.style">
        Sample Link 2
      </Button>
    </Tooltip>
  </ButtonGroup>
)

export const ExamplePrx = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const secondaryButtonInactive = true
  const hideSecondaryButton = false

  const buttonContent = (
    <ButtonGroup>
      <Button inactive={true} aria-disabled={true}>
        Hello
      </Button>
      {!hideSecondaryButton && (
        <ActionMenu open={isOpen} onOpenChange={secondaryButtonInactive ? () => {} : open => setIsOpen(open)}>
          <ActionMenu.Anchor>
            <IconButton
              aria-label="SecondaryButtonAriaLabel"
              aria-disabled={secondaryButtonInactive}
              inactive={secondaryButtonInactive}
              icon={TriangleDownIcon}
            />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay align="end">
            <ActionList>
              <ActionList.Item>Item 1</ActionList.Item>
              <ActionList.Item>Item 2</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      )}
    </ButtonGroup>
  )

  return (
    <Tooltip text="this is inactive" direction="ne">
      {buttonContent}
    </Tooltip>
  )
}

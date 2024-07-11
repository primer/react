import React from 'react'
import type {Meta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {Button, IconButton} from '../Button'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {PlusIcon, DashIcon} from '@primer/octicons-react'
import {Tooltip} from '../next'

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
    <IconButton icon={PlusIcon} aria-label="Add" unsafeDisableTooltip={false} />
    <IconButton icon={DashIcon} aria-label="Subtract" unsafeDisableTooltip={false} />
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

export const InactiveButtonsGroup = () => {
  const primaryButton = (
    <Button inactive={true} aria-disabled={true} onClick={() => {}}>
      Primary Button
    </Button>
  )

  const secondaryButton = (
    <IconButton
      unsafeDisableTooltip={true}
      aria-label="Secondary Button Aria Label"
      aria-disabled={true}
      inactive={true}
      icon={DashIcon}
    />
  )

  return (
    <ButtonGroup>
      <Tooltip text="This button is inactive" direction="ne">
        {primaryButton}
      </Tooltip>

      <ActionMenu open={false} onOpenChange={() => {}}>
        <ActionMenu.Anchor>
          <Tooltip text="this button is inactive" direction="ne" type="label">
            {secondaryButton}
          </Tooltip>
        </ActionMenu.Anchor>
        <ActionMenu.Overlay align="end">
          <ActionList.Item>Item 1</ActionList.Item>
          <ActionList.Item>Item 2</ActionList.Item>
        </ActionMenu.Overlay>
      </ActionMenu>
    </ButtonGroup>
  )
}

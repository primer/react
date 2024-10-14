import React, {useState} from 'react'
import type {Meta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {IconButton, Button} from '../Button'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {Tooltip} from '../next'
import {PlusIcon, DashIcon} from '@primer/octicons-react'

export default {
  title: 'Components/ButtonGroup/Features',
  component: ButtonGroup,
} as Meta<typeof ButtonGroup>

export const IconButtons = () => (
  <ButtonGroup>
    {/* We can remove these unsafe props after we resolve https://github.com/primer/react/issues/4129 */}
    <IconButton icon={PlusIcon} aria-label="Add" />
    <IconButton icon={DashIcon} aria-label="Subtract" />
  </ButtonGroup>
)

export const LoadingButtons = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
  }
  return (
    <ButtonGroup>
      <Button loading={isLoading} onClick={handleClick}>
        Button 1
      </Button>
      <Button onClick={handleClick}>Button 2</Button>
      <Button onClick={handleClick}>Button 3</Button>
    </ButtonGroup>
  )
}

export const IconButtonsWithTooltip = () => (
  <ButtonGroup>
    <IconButton icon={PlusIcon} aria-label="Add" />
    <IconButton icon={DashIcon} aria-label="Subtract" />
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
    <IconButton aria-label="Secondary Button Aria Label" aria-disabled={true} inactive={true} icon={DashIcon} />
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

import React from 'react'
import type {Meta} from '@storybook/react-vite'
import ButtonGroup from './ButtonGroup'
import {IconButton, Button} from '../Button'
import {PlusIcon, DashIcon, TriangleDownIcon} from '@primer/octicons-react'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {Tooltip} from '../next'

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
  const handleClick = () => {}
  return (
    <ButtonGroup>
      <Button loading={true} onClick={handleClick}>
        Button 1
      </Button>
      <Button onClick={handleClick}>Button 2</Button>
      <Tooltip text="Additional info about the button">
        <Button onClick={handleClick}>Button 3</Button>
      </Tooltip>
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
    <IconButton aria-label="Secondary Button" aria-disabled={true} inactive={true} icon={DashIcon} />
  )

  return (
    <ButtonGroup>
      <Tooltip text="This button is inactive" direction="ne">
        {primaryButton}
      </Tooltip>

      <ActionMenu open={false} onOpenChange={() => {}}>
        <ActionMenu.Anchor>
          <Tooltip text="this button is inactive" direction="ne" type="description">
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

export const DropdownSplit = () => {
  const actions = ['Action one', 'Action two', 'Action three']
  const [selectedActionIndex, setSelectedActionIndex] = React.useState<number>(0)
  const selectedAction = actions[selectedActionIndex]
  return (
    <ButtonGroup>
      <Button
        onClick={() => {
          alert(`Activated ${selectedAction}`)
        }}
      >
        {selectedAction}
      </Button>
      <ActionMenu>
        <ActionMenu.Button aria-label="More options" icon={TriangleDownIcon} />
        <ActionMenu.Overlay>
          <ActionList>
            {actions.map((action, index) => {
              return (
                <ActionList.Item
                  key={action}
                  onSelect={() => {
                    setSelectedActionIndex(index)
                  }}
                >
                  {action}
                </ActionList.Item>
              )
            })}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </ButtonGroup>
  )
}

export const AsToolbar = () => (
  <ButtonGroup role="toolbar">
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </ButtonGroup>
)

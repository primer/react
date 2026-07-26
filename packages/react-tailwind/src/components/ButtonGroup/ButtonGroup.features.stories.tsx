import {DashIcon, PlusIcon, TriangleDownIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {LinkButton} from '../LinkButton'
import {ButtonGroup} from './ButtonGroup'

const meta = {title: 'React Tailwind/Display/ButtonGroup/Features', component: ButtonGroup} satisfies Meta<
  typeof ButtonGroup
>
export default meta
type Story = StoryObj<typeof meta>

export const IconButtons: Story = {
  render: () => (
    <ButtonGroup>
      <IconButton icon={PlusIcon} aria-label="Add" />
      <IconButton icon={DashIcon} aria-label="Subtract" />
    </ButtonGroup>
  ),
}
export const LoadingButtons: Story = {
  render: () => (
    <ButtonGroup>
      <Button loading>Button 1</Button>
      <Button>Button 2</Button>
      <Button title="Additional info about the button">Button 3</Button>
    </ButtonGroup>
  ),
}
export const IconButtonsWithTooltip: Story = IconButtons
export const ButtonAndLink: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Button</Button>
      <LinkButton href="https://primer.style">Link</LinkButton>
    </ButtonGroup>
  ),
}
export const LinksWithTooltip: Story = {
  render: () => (
    <ButtonGroup>
      <LinkButton href="https://primer.style" title="Additional text for link 1">
        Sample Link 1
      </LinkButton>
      <LinkButton href="https://primer.style" title="Additional text for link 2">
        Sample Link 2
      </LinkButton>
    </ButtonGroup>
  ),
}
export const InactiveButtonsGroup: Story = {
  render: () => (
    <ButtonGroup>
      <Button aria-disabled="true" title="This button is inactive">
        Primary Button
      </Button>
      <IconButton aria-disabled="true" icon={DashIcon} aria-label="Secondary Button" title="This button is inactive" />
    </ButtonGroup>
  ),
}
export const DropdownSplit: Story = {
  render: function DropdownSplitStory() {
    const actions = ['Action one', 'Action two', 'Action three']
    const [selectedAction, setSelectedAction] = useState(actions[0])
    return (
      <ButtonGroup>
        <Button onClick={() => setSelectedAction(selectedAction)}>{selectedAction}</Button>
        <IconButton icon={TriangleDownIcon} aria-label="More options" aria-haspopup="menu" />
      </ButtonGroup>
    )
  },
}
export const AsToolbar: Story = {
  render: () => (
    <ButtonGroup role="toolbar">
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </ButtonGroup>
  ),
}

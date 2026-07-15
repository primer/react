import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Close, Popover, Root as BasePopoverRoot, Trigger} from '../BasePopover'
import {Root, Target, Anchor} from './AnchorPosition'
import type {Placement} from './AnchorPosition'

const meta = {
  title: 'Components/AnchorPosition/Features',
  component: Root,
} satisfies Meta<typeof Root>

export default meta

type Story = StoryObj<typeof Root>

const targetStyle = {
  padding: 'var(--base-size-12)',
  color: 'var(--fgColor-default)',
  backgroundColor: 'var(--bgColor-default)',
  border: 'var(--borderWidth-thin) solid var(--borderColor-default)',
  borderRadius: 'var(--borderRadius-medium)',
  boxShadow: 'var(--shadow-floating-small)',
}

const placements: Placement[] = ['above', 'below', 'start', 'end']

export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(12rem, 1fr))',
        gap: '10rem',
        padding: '8rem',
      }}
    >
      {placements.map(placement => (
        <Root key={placement}>
          <Anchor as={Button}>{placement}</Anchor>
          <Target alignment="center" placement={placement} style={targetStyle}>
            {placement}
          </Target>
        </Root>
      ))}
    </div>
  ),
}

export const WithBasePopover: Story = {
  render: () => (
    <div style={{padding: '8rem'}}>
      <BasePopoverRoot>
        <Root>
          <Anchor as={Trigger}>Toggle popover</Anchor>
          <Target as={Popover} style={targetStyle}>
            Anchored popover
            <div>
              <Close>Close popover</Close>
            </div>
          </Target>
        </Root>
      </BasePopoverRoot>
    </div>
  ),
}

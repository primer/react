import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'

import {Tooltip} from '.'
import {Button} from '../Button'

const meta = {
  title: 'Components/Tooltip',
  decorators: [
    Story => (
      <Tooltip.Provider>
        <Story />
      </Tooltip.Provider>
    ),
  ],
  args: {},
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={Button}>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup>This is a tooltip</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
}

export const PositionTop: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={Button}>Tooltip on top</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup side="top">I appear on top</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
}

export const PositionBottom: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={Button}>Tooltip on bottom</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup side="bottom">I appear on bottom</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
}

export const PositionLeft: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={Button}>Tooltip on left</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup side="left">I appear on left</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
}

export const PositionRight: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={Button}>Tooltip on right</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup side="right">I appear on right</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
}

export const WithOffset: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={Button}>Large offset</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup sideOffset={20}>This tooltip has a larger offset</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={Button}>Hover for details</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup>This is a tooltip with much longer content that explains something in detail</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
}

export const MultipleTooltips: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button variant="primary" />}>Primary</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>Primary action</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger render={<Button variant="danger" />}>Danger</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>Dangerous action!</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger render={<Button variant="invisible" />}>Invisible</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>Subtle action</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  ),
}

import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import type React from 'react'
import {Overlay, OverlayContent} from './Overlay'

const meta = {
  title: 'React Tailwind/Components/Overlay/Features',
  component: Overlay,
} satisfies Meta<typeof Overlay>

export default meta
type Story = StoryObj<typeof meta>

const visiblePlay = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  await expect(within(canvasElement).getByText(/overlay content/i)).toBeVisible()
}

const Surface = ({
  children = 'Overlay content',
  className = '',
  role = 'dialog',
  tabIndex,
}: {
  children?: React.ReactNode
  className?: string
  role?: React.AriaRole
  tabIndex?: number
}) => (
  <div className="relative min-h-48 p-8">
    <OverlayContent role={role} aria-label="Overlay surface" className={className} tabIndex={tabIndex}>
      {children}
    </OverlayContent>
  </div>
)

export const DropdownOverlay: Story = {
  render: () => (
    <Surface role="menu">
      <div role="menuitem" tabIndex={-1}>
        Overlay content
      </div>
    </Surface>
  ),
  play: visiblePlay,
}
export const DialogOverlay: Story = {
  render: () => <Surface />,
  play: visiblePlay,
}
export const OverlayOnTopOfOverlay: Story = {
  render: () => (
    <div className="relative min-h-64">
      <Surface />
      <Overlay className="left-16 top-16 z-10" role="dialog" aria-label="Nested overlay">
        Nested overlay content
      </Overlay>
    </div>
  ),
  play: visiblePlay,
}
export const MemexNestedOverlays: Story = {
  render: () => (
    <Surface className="max-h-64 overflow-auto" tabIndex={0}>
      Nested overlay content
    </Surface>
  ),
  play: visiblePlay,
}
export const NestedOverlays: Story = {
  render: () => <Surface>Nested overlay content</Surface>,
  play: visiblePlay,
}
export const MemexIssueOverlay: Story = {
  render: () => <Surface className="w-96">Issue overlay content</Surface>,
  play: visiblePlay,
}
export const PositionedOverlays: Story = {
  render: () => <Surface className="right-0 top-0">Positioned overlay content</Surface>,
  play: visiblePlay,
}
export const SettingMaxHeight: Story = {
  render: () => (
    <Surface className="max-h-32 overflow-auto" tabIndex={0}>
      {'Scrollable overlay content. '.repeat(40)}
    </Surface>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('dialog', {name: 'Overlay surface'})).toBeVisible()
  },
}

import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import React from 'react'
import {Portal} from './Portal'

const meta = {
  title: 'React Tailwind/Components/Portal/Features',
  component: Portal,
} satisfies Meta<typeof Portal>

export default meta
type Story = StoryObj<typeof meta>

const portalPlay = async ({canvasElement: _canvasElement}: {canvasElement: HTMLElement}) => {
  await expect(within(document.body).findByText('Portaled content')).resolves.toBeVisible()
}

const PortalFixture = ({children = 'Portaled content', id}: {children?: React.ReactNode; id?: string}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <>
      <div id={id} ref={containerRef} className="min-h-8 border border-dashed border-default p-2">
        <Portal container={containerRef}>{children}</Portal>
      </div>
    </>
  )
}

export const CustomPortalRootById: Story = {
  render: () => <PortalFixture id="portal-root-by-id" />,
  play: portalPlay,
}

export const CustomPortalRootByRegistration: Story = {
  render: () => <PortalFixture id="registered-portal-root" />,
  play: portalPlay,
}

export const MultiplePortalRoots: Story = {
  render: () => (
    <div className="grid gap-2">
      <PortalFixture id="outer-portal-root" />
      <PortalFixture id="inner-portal-root" />
    </div>
  ),
  play: portalPlay,
}

export const WithPortalContext: Story = {
  render: () => <PortalFixture id="context-portal-root">Content from the configured portal</PortalFixture>,
  play: async ({canvasElement}) => {
    await expect(within(document.body).findByText('Content from the configured portal')).resolves.toBeVisible()
    await expect(within(canvasElement).getByText('Content from the configured portal')).toBeVisible()
  },
}

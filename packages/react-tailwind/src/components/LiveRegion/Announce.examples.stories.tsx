import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {Announce, AriaAlert, AriaStatus} from './LiveRegion'

const meta = {
  title: 'React Tailwind/Components/Announce/Examples',
  component: Announce,
} satisfies Meta<typeof Announce>

export default meta
type Story = StoryObj<typeof meta>

export const AsyncSave: Story = {
  render: () => <Announce>Changes saved</Announce>,
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Changes saved')
  },
}

export const SaveFailed: Story = {
  render: () => <AriaAlert>Could not save changes</AriaAlert>,
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('Could not save changes')
  },
}

export const ResultsLoaded: Story = {
  render: () => <AriaStatus>3 results loaded</AriaStatus>,
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('3 results loaded')
  },
}

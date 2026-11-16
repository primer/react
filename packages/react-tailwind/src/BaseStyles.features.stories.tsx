import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {BaseStyles} from './BaseStyles'

const meta = {
  title: 'React Tailwind/Behaviors/BaseStyles/Features',
  component: BaseStyles,
} satisfies Meta<typeof BaseStyles>

export default meta
type Story = StoryObj<typeof meta>

export const AsMainLandmark: Story = {
  render: () => <BaseStyles as="main">Main content</BaseStyles>,
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('main')).toHaveTextContent('Main content')
  },
}

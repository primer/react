import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {BaseStyles} from './BaseStyles'

const meta = {
  title: 'React Tailwind/Behaviors/BaseStyles',
  component: BaseStyles,
  args: {as: 'div', children: 'Base styled content'},
  argTypes: {
    as: {control: 'select', options: ['div', 'main', 'section', 'article']},
    color: {control: 'color'},
  },
} satisfies Meta<typeof BaseStyles>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Base styled content')).toBeVisible()
  },
}

export const Playground: Story = {}

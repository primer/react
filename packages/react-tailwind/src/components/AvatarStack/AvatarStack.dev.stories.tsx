import type {Meta, StoryObj} from '@storybook/react-vite'
import {AvatarStack} from './AvatarStack'
import {WithLinkWrappers as WithLinkWrappersFeature} from './AvatarStack.features.stories'

const meta = {
  title: 'React Tailwind/Display/AvatarStack/Dev',
  component: AvatarStack,
  args: {children: null},
} satisfies Meta<typeof AvatarStack>

export default meta
type Story = StoryObj<typeof meta>

export const WithLinkWrappers: Story = {...WithLinkWrappersFeature}

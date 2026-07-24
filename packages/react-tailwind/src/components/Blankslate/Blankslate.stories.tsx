import type {Meta, StoryObj} from '@storybook/react-vite'
import {Blankslate, BlankslateDescription, BlankslateHeading} from './Blankslate'
const meta = {
  title: 'React Tailwind/Content/Blankslate',
  component: Blankslate,
  render: args => (
    <Blankslate {...args}>
      <BlankslateHeading>No results</BlankslateHeading>
      <BlankslateDescription>Try a different search.</BlankslateDescription>
    </Blankslate>
  ),
} satisfies Meta<typeof Blankslate>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {border: true, spacious: true}}

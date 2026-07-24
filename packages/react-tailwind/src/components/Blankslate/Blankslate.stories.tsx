import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  Blankslate,
  BlankslateDescription,
  BlankslateHeading,
  BlankslatePrimaryAction,
  BlankslateSecondaryAction,
} from './Blankslate'
const meta = {
  title: 'React Tailwind/Content/Blankslate',
  component: Blankslate,
  render: args => (
    <Blankslate {...args}>
      <BlankslateHeading>Welcome to the mona wiki!</BlankslateHeading>
      <BlankslateDescription>
        Wikis provide a place in your repository to lay out the roadmap of your project, show the current status, and
        document software better, together.
      </BlankslateDescription>
      <BlankslatePrimaryAction href="#">Create the first page</BlankslatePrimaryAction>
      <BlankslateSecondaryAction href="#">Learn more about wikis</BlankslateSecondaryAction>
    </Blankslate>
  ),
} satisfies Meta<typeof Blankslate>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {border: true, spacious: true}}

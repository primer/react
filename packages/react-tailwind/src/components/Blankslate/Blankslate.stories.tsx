import type {Meta, StoryObj} from '@storybook/react-vite'
import {BookIcon} from '@primer/octicons-react'
import {
  Blankslate,
  BlankslateDescription,
  BlankslateHeading,
  BlankslatePrimaryAction,
  BlankslateSecondaryAction,
  BlankslateVisual,
} from './Blankslate'
const meta = {
  title: 'React Tailwind/Content/Blankslate',
  component: Blankslate,
  render: args => (
    <Blankslate {...args}>
      <BlankslateVisual>
        <BookIcon size="medium" />
      </BlankslateVisual>
      <BlankslateHeading>Welcome to the mona wiki!</BlankslateHeading>
      <BlankslateDescription>
        Wikis provide a place in your repository to lay out the roadmap of your project, show the current status, and
        document software better, together.
      </BlankslateDescription>
      <BlankslatePrimaryAction href="#">Create the first page</BlankslatePrimaryAction>
      <BlankslateSecondaryAction href="#">Learn more about wikis</BlankslateSecondaryAction>
    </Blankslate>
  ),
  args: {
    border: false,
    narrow: false,
    spacious: false,
    size: 'medium',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof Blankslate>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {}

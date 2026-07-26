import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  Blankslate,
  BlankslateDescription,
  BlankslateHeading,
  BlankslatePrimaryAction,
  BlankslateSecondaryAction,
  BlankslateVisual,
} from './Blankslate'

const meta = {
  title: 'React Tailwind/Content/Blankslate/Examples',
  component: Blankslate,
} satisfies Meta<typeof Blankslate>

export default meta
type Story = StoryObj<typeof meta>

export const EmptyRepository: Story = {
  render: () => (
    <Blankslate border spacious>
      <BlankslateVisual>◇</BlankslateVisual>
      <BlankslateHeading>Welcome to your repository</BlankslateHeading>
      <BlankslateDescription>Create a file or invite collaborators to get started.</BlankslateDescription>
      <BlankslatePrimaryAction href="#">Create a file</BlankslatePrimaryAction>
      <BlankslateSecondaryAction href="#">Invite collaborators</BlankslateSecondaryAction>
    </Blankslate>
  ),
}

export const NoSearchResults: Story = {
  render: () => (
    <Blankslate size="small" narrow>
      <BlankslateHeading>No results found</BlankslateHeading>
      <BlankslateDescription>Try a different search term or remove a filter.</BlankslateDescription>
      <BlankslatePrimaryAction href="#">Clear filters</BlankslatePrimaryAction>
    </Blankslate>
  ),
}

export const CustomEmptyState: Story = {
  render: () => (
    <Blankslate>
      <div className="mb-2 text-4xl" aria-hidden="true">
        ☁
      </div>
      <BlankslateHeading>Upload your first file</BlankslateHeading>
      <BlankslateDescription>Files uploaded here will be available to everyone on your team.</BlankslateDescription>
      <label className="mt-4 cursor-pointer rounded-md bg-accent-emphasis px-3 py-1.5 font-semibold text-on-emphasis">
        Choose file
        <input type="file" className="sr-only" />
      </label>
    </Blankslate>
  ),
}

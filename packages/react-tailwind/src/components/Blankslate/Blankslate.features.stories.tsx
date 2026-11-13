import type {Meta, StoryObj} from '@storybook/react-vite'
import {BookIcon} from '@primer/octicons-react'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {ConfirmationDialog} from '../ConfirmationDialog'
import {
  Blankslate,
  BlankslateDescription,
  BlankslateHeading,
  BlankslatePrimaryAction,
  BlankslateSecondaryAction,
  BlankslateVisual,
} from './Blankslate'

const meta = {
  title: 'React Tailwind/Content/Blankslate/Features',
  component: Blankslate,
} satisfies Meta<typeof Blankslate>

export default meta
type Story = StoryObj<typeof meta>

const content = (
  <>
    <BlankslateVisual>
      <BookIcon size="medium" />
    </BlankslateVisual>
    <BlankslateHeading>Blankslate heading</BlankslateHeading>
    <BlankslateDescription>Use it to provide information when no dynamic content exists.</BlankslateDescription>
  </>
)

export const WithVisual: Story = {render: () => <Blankslate>{content}</Blankslate>}
export const WithPrimaryActionAsLink: Story = {
  render: () => (
    <Blankslate>
      {content}
      <BlankslatePrimaryAction href="#">Primary action</BlankslatePrimaryAction>
    </Blankslate>
  ),
}

export const WithPrimaryActionAsButton: Story = {
  render: function WithPrimaryActionAsButtonStory() {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Blankslate>
          {content}
          <BlankslatePrimaryAction onClick={() => setIsOpen(true)}>Primary action</BlankslatePrimaryAction>
        </Blankslate>
        <ConfirmationDialog
          confirmButtonContent="Delete it!"
          dangerous
          onOpenChange={setIsOpen}
          open={isOpen}
          title="Delete universe?"
        >
          Deleting the universe could have disastrous effects, including but not limited to destroying all life on
          Earth.
        </ConfirmationDialog>
      </>
    )
  },
}

export const WithPrimaryActionAsButtonOpen: Story = {
  ...WithPrimaryActionAsButton,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Primary action'}))
    await expect(within(document.body).getByRole('alertdialog')).toBeVisible()
  },
}

export const WithSecondaryAction: Story = {
  render: () => (
    <Blankslate>
      {content}
      <BlankslateSecondaryAction href="#">Secondary action</BlankslateSecondaryAction>
    </Blankslate>
  ),
}
export const WithBorder: Story = {render: () => <Blankslate border>{content}</Blankslate>}
export const Narrow: Story = {
  render: () => (
    <Blankslate border narrow>
      {content}
    </Blankslate>
  ),
}
export const Spacious: Story = {render: () => <Blankslate spacious>{content}</Blankslate>}

export const SizeSmall: Story = {
  render: () => (
    <Blankslate border size="small">
      {content}
      <BlankslatePrimaryAction href="#">Primary action</BlankslatePrimaryAction>
      <BlankslateSecondaryAction href="#">Secondary action</BlankslateSecondaryAction>
    </Blankslate>
  ),
}

export const SizeLarge: Story = {
  render: () => (
    <Blankslate size="large">
      {content}
      <BlankslatePrimaryAction href="#">Primary action</BlankslatePrimaryAction>
      <BlankslateSecondaryAction href="#">Secondary action</BlankslateSecondaryAction>
    </Blankslate>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <Blankslate>
      <BlankslateHeading>Nothing here yet</BlankslateHeading>
      <BlankslateDescription>Invite collaborators to start building this project.</BlankslateDescription>
      <form className="mt-4 flex gap-2">
        <input aria-label="Email address" placeholder="Email address" />
        <button type="submit">Invite</button>
      </form>
    </Blankslate>
  ),
}

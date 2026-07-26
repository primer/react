import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {Button} from '../Button'
import {Dialog} from './Dialog'

const meta = {
  title: 'React Tailwind/Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

const lipsum = Array.from({length: 5}, (_, index) => (
  <p key={index} className="mb-3 text-xs">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec
    lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis
    nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt.
    Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue.
  </p>
))

const content = (title: string) => (
  <>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.CloseButton />
    </Dialog.Header>
    <Dialog.Body>{lipsum}</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button>Open Second Dialog</Button>} />
      <Dialog.Close render={<Button variant="danger">Delete the universe</Button>} />
      <Dialog.Close render={<Button variant="primary">Proceed</Button>} />
    </Dialog.Footer>
  </>
)

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content>{content('My Dialog')}</Dialog.Content>
    </Dialog>
  ),
}
export const Playground: Story = {
  render: () => (
    <Dialog modal="trap-focus">
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content>{content('Dialog heading')}</Dialog.Content>
    </Dialog>
  ),
}
export const NonModal: Story = {
  render: () => (
    <Dialog modal={false}>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content>{content('My Dialog')}</Dialog.Content>
    </Dialog>
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'Show dialog'}))
    const dialog = await within(document.body).findByRole('dialog', {name: 'My Dialog'})
    await waitFor(() => expect(dialog).toBeVisible())
  },
}

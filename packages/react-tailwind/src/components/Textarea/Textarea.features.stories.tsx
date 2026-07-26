import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {FormControl} from '../FormControl'
import {Heading} from '../Heading'
import {Textarea} from './Textarea'

const meta = {title: 'React Tailwind/Forms/Textarea/Features', component: Textarea} satisfies Meta<typeof Textarea>
export default meta
type Story = StoryObj<typeof meta>

function Field(props: React.ComponentProps<typeof Textarea>) {
  return (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea {...props} />
    </FormControl>
  )
}
export const Disabled: Story = {render: () => <Field disabled />}
export const WithCaption: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea />
      <FormControl.Caption>This is a caption</FormControl.Caption>
    </FormControl>
  ),
}
export const VisuallyHiddenLabel: Story = {
  render: () => (
    <form>
      <Heading as="h2" size="small">
        Primer form title
      </Heading>
      <FormControl>
        <FormControl.Label visuallyHidden>Primer form label</FormControl.Label>
        <Textarea />
        <FormControl.Caption>Label is visually hidden; the title describes the purpose visually</FormControl.Caption>
      </FormControl>
    </form>
  ),
}
export const Error: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea aria-invalid />
      <FormControl.Validation variant="error">Something went wrong</FormControl.Validation>
    </FormControl>
  ),
}
export const Success: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea defaultValue="Valid input" />
      <FormControl.Validation variant="success">Success</FormControl.Validation>
    </FormControl>
  ),
}
export const Block: Story = {render: () => <Field className="w-full" />}
export const CustomHeight: Story = {render: () => <Field rows={3} />}
export const CustomWidth: Story = {render: () => <Field cols={60} />}
export const CustomResizeBehavior: Story = {
  render: () => (
    <div className="grid gap-3">
      <Field resize="both" />
      <Field resize="none" />
      <Field resize="horizontal" />
      <Field resize="vertical" />
    </div>
  ),
}
export const MinimumHeight: Story = {render: () => <Field rows={1} style={{minHeight: 100}} />}
export const MaximumHeight: Story = {render: () => <Field rows={20} style={{maxHeight: 200}} />}
export const Required: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label requiredIndicator>Default label</FormControl.Label>
      <Textarea required />
    </FormControl>
  ),
}
export const FocusVisible: Story = {
  render: () => <Field />,
  play: async ({canvasElement}) => {
    const textarea = within(canvasElement).getByRole('textbox')
    await userEvent.tab()
    await expect(textarea).toHaveFocus()
  },
}

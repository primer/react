import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {FormControl} from '../FormControl'
import {Heading} from '../Heading'
import {Stack} from '../Stack'
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
      <Textarea />
      <FormControl.Validation variant="success">Success</FormControl.Validation>
    </FormControl>
  ),
}
export const Block: Story = {render: () => <Field block />}
export const CustomHeight: Story = {render: () => <Field rows={3} />}
export const CustomWidth: Story = {render: () => <Field cols={60} />}
export const CustomResizeBehavior: Story = {
  render: () => (
    <Stack as="form">
      {(
        [
          ['both', 'Resize in either direction (default)'],
          ['none', 'No resize'],
          ['horizontal', 'Horizontal resize'],
          ['vertical', 'Vertical resize'],
        ] as const
      ).map(([resize, label]) => (
        <FormControl key={resize}>
          <FormControl.Label>{label}</FormControl.Label>
          <Textarea resize={resize} />
        </FormControl>
      ))}
    </Stack>
  ),
}
export const AutoSize: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Automatically growing textarea</FormControl.Label>
        <Textarea autoSize />
      </FormControl>
    </form>
  ),
}
export const MinimumHeight: Story = {render: () => <Field rows={1} minHeight={100} />}
export const MaximumHeight: Story = {render: () => <Field rows={20} maxHeight={200} />}

function CharacterLimitField({caption, initialValue = ''}: {caption?: string; initialValue?: string}) {
  const [value, setValue] = useState(initialValue)
  return (
    <form>
      <FormControl>
        <FormControl.Label>Bio</FormControl.Label>
        <Textarea value={value} onChange={event => setValue(event.target.value)} characterLimit={100} />
        {caption ? <FormControl.Caption>{caption}</FormControl.Caption> : null}
      </FormControl>
    </form>
  )
}

export const WithCharacterLimit: Story = {render: () => <CharacterLimitField />}
export const WithCharacterLimitAndCaption: Story = {
  render: () => <CharacterLimitField caption="Tell us about yourself" />,
}
export const WithCharacterLimitExceeded: Story = {
  render: () => (
    <CharacterLimitField
      caption="Keep it concise"
      initialValue="This is a very long bio text that will definitely exceed the character limit that we have set for this textarea field. It keeps going and going."
    />
  ),
}
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

import {CalendarIcon, CheckIcon, XCircleFillIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {FormControl} from '../FormControl'
import {Heading} from '../Heading'
import {Stack} from '../Stack'
import {TextInput} from './TextInput'

const meta = {title: 'React Tailwind/Forms/TextInput/Features', component: TextInput} satisfies Meta<typeof TextInput>
export default meta
type Story = StoryObj<typeof meta>

function Field(props: React.ComponentProps<typeof TextInput>) {
  return (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput {...props} />
    </FormControl>
  )
}
export const Disabled: Story = {render: () => <Field disabled />}
export const WithCaption: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput />
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
        <TextInput />
        <FormControl.Caption>Label is visually hidden; the title describes the purpose visually</FormControl.Caption>
      </FormControl>
    </form>
  ),
}
export const Error: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput aria-invalid />
      <FormControl.Validation variant="error">Something went wrong</FormControl.Validation>
    </FormControl>
  ),
}
export const Success: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput />
      <FormControl.Validation variant="success">Something went wrong</FormControl.Validation>
    </FormControl>
  ),
}
export const Block: Story = {render: () => <Field className="w-full" />}
export const Small: Story = {render: () => <Field size="small" />}
export const Large: Story = {render: () => <Field size="large" />}
export const Required: Story = {
  render: () => (
    <FormControl required>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput size="large" />
    </FormControl>
  ),
}
export const WithLeadingVisual: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput leadingVisual={() => <CheckIcon aria-label="Checkmark" />} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput leadingVisual="$" />
      </FormControl>
    </form>
  ),
}
export const WithTrailingIcon: Story = {
  render: () => (
    <div>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput trailingVisual={() => <CheckIcon aria-label="Checkmark" />} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput placeholder="200" trailingVisual="minutes" />
      </FormControl>
    </div>
  ),
}
export const WithTrailingAction: Story = {
  render: function WithTrailingActionStory() {
    const [value, setValue] = useState('sample text')
    return (
      <form>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput
            value={value}
            onChange={event => setValue(event.target.value)}
            trailingAction={
              <Stack justify="center" style={{minWidth: '34px'}}>
                {value ? (
                  <TextInput.Action aria-label="Clear input" icon={XCircleFillIcon} onClick={() => setValue('')} />
                ) : undefined}
              </Stack>
            }
          />
        </FormControl>
      </form>
    )
  },
}
export const WithTooltipDirection: Story = {
  render: function WithTooltipDirectionStory() {
    const [value, setValue] = useState('sample text')
    return (
      <form>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput
            value={value}
            onChange={event => setValue(event.target.value)}
            trailingAction={
              <Stack justify="center" style={{minWidth: '34px'}}>
                {value ? (
                  <TextInput.Action
                    aria-label="Clear input"
                    icon={XCircleFillIcon}
                    onClick={() => setValue('')}
                    tooltipDirection="nw"
                  />
                ) : undefined}
              </Stack>
            }
          />
        </FormControl>
      </form>
    )
  },
}
export const WithLoadingIndicator: Story = {
  args: {loading: true},
  render: args => (
    <div>
      <h3>No visual</h3>
      <div className="mb-2">
        <Field {...args} value="auto" />
      </div>
      <div className="mb-2">
        <Field {...args} loaderPosition="leading" value="leading" />
      </div>
      <div className="mb-8">
        <Field {...args} loaderPosition="trailing" value="trailing" />
      </div>
      <h3>Leading visual</h3>
      <div className="mb-2">
        <Field {...args} leadingVisual={CalendarIcon} value="auto" />
      </div>
      <div className="mb-2">
        <Field {...args} leadingVisual={CalendarIcon} loaderPosition="leading" value="leading" />
      </div>
      <div className="mb-8">
        <Field {...args} leadingVisual={CalendarIcon} loaderPosition="trailing" value="trailing" />
      </div>
      <h3>Trailing visual</h3>
      <FormControl>
        <div className="mb-2">
          <Field {...args} trailingVisual={CalendarIcon} value="auto" />
        </div>
        <div className="mb-2">
          <Field {...args} loaderPosition="leading" trailingVisual={CalendarIcon} value="leading" />
        </div>
        <div className="mb-8">
          <Field {...args} loaderPosition="trailing" trailingVisual={CalendarIcon} value="trailing" />
        </div>
      </FormControl>
      <h3>Both visuals</h3>
      <div className="mb-2">
        <Field {...args} leadingVisual={CalendarIcon} size="small" trailingVisual={CalendarIcon} value="auto" />
      </div>
      <div className="mb-2">
        <Field
          {...args}
          leadingVisual={CalendarIcon}
          loaderPosition="leading"
          trailingVisual={CalendarIcon}
          value="leading"
        />
      </div>
      <div className="mb-2">
        <Field
          {...args}
          leadingVisual={CalendarIcon}
          loaderPosition="trailing"
          size="large"
          trailingVisual={CalendarIcon}
          value="trailing"
        />
      </div>
    </div>
  ),
}
export const WithAutocompleteAttribute: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>First name</FormControl.Label>
        <TextInput autoComplete="given-name" />
      </FormControl>
      <FormControl>
        <FormControl.Label>Last name</FormControl.Label>
        <TextInput autoComplete="family-name" />
      </FormControl>
    </form>
  ),
}
export const WithCharacterLimit: Story = {
  render: function WithCharacterLimitStory() {
    const [value, setValue] = useState('')
    return (
      <FormControl>
        <FormControl.Label>Username</FormControl.Label>
        <TextInput characterLimit={20} value={value} onChange={event => setValue(event.target.value)} />
      </FormControl>
    )
  },
}
export const WithCharacterLimitAndCaption: Story = {
  render: function WithCharacterLimitAndCaptionStory() {
    const [value, setValue] = useState('')
    return (
      <FormControl>
        <FormControl.Label>Username</FormControl.Label>
        <TextInput characterLimit={20} value={value} onChange={event => setValue(event.target.value)} />
        <FormControl.Caption>Choose a unique username</FormControl.Caption>
      </FormControl>
    )
  },
}
export const WithCharacterLimitExceeded: Story = {
  render: function WithCharacterLimitExceededStory() {
    const [value, setValue] = useState('This is a very long text that exceeds the limit')
    return (
      <form>
        <FormControl>
          <FormControl.Label>Bio</FormControl.Label>
          <TextInput characterLimit={20} value={value} onChange={event => setValue(event.target.value)} />
          <FormControl.Caption>Keep it short</FormControl.Caption>
        </FormControl>
      </form>
    )
  },
}
export const FocusVisible: Story = {
  render: () => <Field />,
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('textbox')
    await userEvent.tab()
    await expect(input).toHaveFocus()
  },
}

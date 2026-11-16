import {MarkGithubIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Avatar} from '../Avatar'
import {FormControl} from '../FormControl'
import {RadioGroup} from '../RadioGroup'
import {Radio} from './Radio'

const meta = {
  title: 'React Tailwind/Forms/Radio/Features',
  component: Radio,
  args: {value: 'default'},
} satisfies Meta<typeof Radio>
export default meta
type Story = StoryObj<typeof meta>

function Choice({disabled = false}: {disabled?: boolean}) {
  return (
    <RadioGroup className="gap-0" disabled={disabled} name="radio-feature">
      <FormControl disabled={disabled} layout="horizontal">
        <Radio value="one" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </RadioGroup>
  )
}

export const WithLeadingVisual: Story = {
  render: () => (
    <RadioGroup className="gap-0" name="radio-feature">
      <FormControl layout="horizontal">
        <Radio value="one" />
        <FormControl.LeadingVisual>
          <MarkGithubIcon aria-hidden="true" />
        </FormControl.LeadingVisual>
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Radio value="two" />
        <FormControl.LeadingVisual>
          <Avatar src="https://github.com/lukasoppermann.png" />
        </FormControl.LeadingVisual>
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </RadioGroup>
  ),
}
export const Disabled: Story = {render: () => <Choice disabled />}
export const WithCaption: Story = {
  render: () => (
    <RadioGroup name="radio-caption">
      <FormControl layout="horizontal">
        <Radio value="default" />
        <FormControl.Label>Default label</FormControl.Label>
        <FormControl.Caption>This is a caption</FormControl.Caption>
      </FormControl>
    </RadioGroup>
  ),
}
export const Checked: Story = {
  render: () => <Choice />,
  play: async ({canvasElement}) => expect(within(canvasElement).getByRole('radio')).toBeChecked(),
}
export const FocusVisible: Story = {
  render: () => <Choice />,
  play: async ({canvasElement}) => {
    const radio = within(canvasElement).getByRole('radio')
    await userEvent.tab()
    await expect(radio).toHaveFocus()
  },
}

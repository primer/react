import {MarkGithubIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Checkbox} from './Checkbox'
import {CheckboxField} from './Checkbox.storyHelpers'

const meta = {title: 'React Tailwind/Forms/Checkbox/Features', component: Checkbox} satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>

export const WithLeadingVisual: Story = {
  render: () => <CheckboxField leadingVisual={<MarkGithubIcon aria-hidden="true" />} />,
}
export const Disabled: Story = {render: () => <CheckboxField disabled />}
export const WithCaption: Story = {
  render: () => <CheckboxField caption="This is a caption" />,
}
export const Indeterminate: Story = {
  render: function IndeterminateStory() {
    const [indeterminate, setIndeterminate] = useState(true)
    return <CheckboxField indeterminate={indeterminate} onCheckedChange={() => setIndeterminate(false)} />
  },
}
export const Checked: Story = {
  render: () => <CheckboxField defaultChecked />,
  play: async ({canvasElement}) => expect(within(canvasElement).getByRole('checkbox')).toBeChecked(),
}
export const FocusVisible: Story = {
  render: () => <CheckboxField />,
  play: async ({canvasElement}) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
  },
}

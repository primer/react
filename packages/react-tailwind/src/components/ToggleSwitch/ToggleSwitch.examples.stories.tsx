import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {ToggleSwitch} from './ToggleSwitch'

const meta = {title: 'React Tailwind/Forms/ToggleSwitch/Examples', component: ToggleSwitch} satisfies Meta<
  typeof ToggleSwitch
>
export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: function ControlledStory() {
    const [checked, setChecked] = useState(false)
    return <ToggleSwitch aria-label="Notifications" checked={checked} onCheckedChange={setChecked} />
  },
  play: async ({canvasElement}) => {
    const control = within(canvasElement).getByRole('switch')
    await userEvent.click(control)
    await expect(control).toBeChecked()
  },
}

export const Uncontrolled: Story = {
  render: () => <ToggleSwitch aria-label="Notifications" defaultChecked />,
  play: async ({canvasElement}) => {
    const control = within(canvasElement).getByRole('switch')
    await expect(control).toBeChecked()
    await userEvent.keyboard('{Space}')
    await expect(control).not.toBeChecked()
  },
}

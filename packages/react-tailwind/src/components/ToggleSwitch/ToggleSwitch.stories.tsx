import type {Meta, StoryObj} from '@storybook/react-vite'
import {useId, useState} from 'react'
import {ToggleSwitch} from './ToggleSwitch'
const meta = {
  title: 'React Tailwind/Forms/ToggleSwitch',
  component: ToggleSwitch,
} satisfies Meta<typeof ToggleSwitch>

export default meta

type Story = StoryObj<typeof meta>

function ToggleSwitchStory({
  defaultChecked = false,
  labelClassName = 'text-sm font-semibold',
  ...props
}: React.ComponentProps<typeof ToggleSwitch> & {labelClassName?: string}) {
  const labelId = useId()
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="grid max-w-80 grid-cols-[max-content_auto] items-center justify-between">
      <span className={labelClassName} id={labelId}>
        Toggle label
      </span>
      <span className="inline-flex items-center">
        <span className="mx-2 text-right text-sm">{checked ? 'On' : 'Off'}</span>
        <ToggleSwitch {...props} checked={checked} aria-labelledby={labelId} onCheckedChange={setChecked} />
      </span>
    </div>
  )
}

export const Default: Story = {
  render: () => <ToggleSwitchStory />,
}
export const Playground: Story = {
  args: {size: 'medium', defaultChecked: false},
  render: args => <ToggleSwitchStory {...args} labelClassName="text-base font-semibold" />,
}

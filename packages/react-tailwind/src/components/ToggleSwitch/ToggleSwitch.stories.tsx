import type {Meta, StoryObj} from '@storybook/react-vite'
import {useId} from 'react'
import {ToggleSwitch} from './ToggleSwitch'
const meta = {
  title: 'React Tailwind/Forms/ToggleSwitch',
  component: ToggleSwitch,
} satisfies Meta<typeof ToggleSwitch>

export default meta

type Story = StoryObj<typeof meta>

function ToggleSwitchStory({
  labelClassName = 'text-sm font-semibold',
  ...props
}: React.ComponentProps<typeof ToggleSwitch> & {labelClassName?: string}) {
  const labelId = useId()
  return (
    <div className="grid max-w-80 grid-cols-[max-content_auto] items-center justify-between">
      <span className={labelClassName} id={labelId}>
        Toggle label
      </span>
      <ToggleSwitch {...props} aria-labelledby={labelId} />
    </div>
  )
}

export const Default: Story = {
  render: () => <ToggleSwitchStory />,
}
export const Playground: Story = {
  args: {disabled: false, loading: false, size: 'medium', statusLabelPosition: 'start'},
  argTypes: {
    buttonLabelOff: {control: {type: 'text'}},
    buttonLabelOn: {control: {type: 'text'}},
    checked: {control: {type: 'boolean'}},
    size: {control: {type: 'radio'}, options: ['small', 'medium']},
    statusLabelPosition: {control: {type: 'radio'}, options: ['start', 'end']},
  },
  render: args => <ToggleSwitchStory {...args} labelClassName="text-md font-semibold" />,
}

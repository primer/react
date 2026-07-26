import type {Meta, StoryObj} from '@storybook/react-vite'
import {useId, useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {cn} from '../../internal/cn'
import {ToggleSwitch} from './ToggleSwitch'

const meta = {title: 'React Tailwind/Forms/ToggleSwitch/Features', component: ToggleSwitch} satisfies Meta<
  typeof ToggleSwitch
>
export default meta
type Story = StoryObj<typeof meta>

interface SwitchProps extends React.ComponentProps<typeof ToggleSwitch> {
  caption?: string
  containerClassName?: string
  label?: string
  statusLabelOff?: string
  statusLabelOn?: string
}

function Switch({
  caption,
  checked,
  containerClassName,
  defaultChecked = false,
  disabled,
  label = 'Toggle label',
  onCheckedChange,
  size = 'medium',
  statusLabelOff = 'Off',
  statusLabelOn = 'On',
  ...props
}: SwitchProps) {
  const labelId = useId()
  const captionId = useId()
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const isChecked = checked ?? uncontrolledChecked
  const handleCheckedChange = (...args: Parameters<NonNullable<SwitchProps['onCheckedChange']>>) => {
    if (checked === undefined) setUncontrolledChecked(args[0])
    onCheckedChange?.(...args)
  }
  const control = (
    <span className="inline-flex items-center">
      <span className={cn('mx-2 text-right', size === 'small' ? 'text-xs' : 'text-sm', disabled && 'text-muted')}>
        {isChecked ? statusLabelOn : statusLabelOff}
      </span>
      <ToggleSwitch
        {...props}
        checked={isChecked}
        disabled={disabled}
        size={size}
        aria-labelledby={labelId}
        aria-describedby={caption ? captionId : undefined}
        onCheckedChange={handleCheckedChange}
      />
    </span>
  )

  if (caption) {
    return (
      <div className="flex items-start gap-4">
        <span className="grow">
          <span className="block text-base font-semibold" id={labelId}>
            {label}
          </span>
          <span className="block text-sm text-muted" id={captionId}>
            {caption}
          </span>
        </span>
        {control}
      </div>
    )
  }

  return (
    <div className={cn('grid max-w-80 grid-cols-[max-content_auto] items-center justify-between', containerClassName)}>
      <span className="block text-sm font-semibold" id={labelId}>
        {label}
      </span>
      {control}
    </div>
  )
}

export const Small: Story = {render: () => <Switch size="small" />}
export const WithCaption: Story = {
  render: () => (
    <Switch
      label="Notifications"
      caption="Notifications will be delivered via email and the GitHub notification center"
    />
  ),
}
export const Disabled: Story = {render: () => <Switch disabled />}
export const Checked: Story = {render: () => <Switch defaultChecked />}
export const CheckedDisabled: Story = {render: () => <Switch defaultChecked disabled />}
export const Controlled: Story = {
  render: function ControlledStory() {
    const [checked, setChecked] = useState(false)
    return (
      <>
        <Switch
          checked={checked}
          containerClassName="max-w-[300px]"
          label="Notifications"
          onCheckedChange={setChecked}
        />
        <p>The switch is {checked ? 'on' : 'off'}</p>
      </>
    )
  },
}
export const WithCustomLabels: Story = {render: () => <Switch statusLabelOn="Active" statusLabelOff="Inactive" />}
export const FocusVisible: Story = {
  render: () => <Switch />,
  play: async ({canvasElement}) => {
    const control = within(canvasElement).getByRole('switch')
    await userEvent.tab()
    await expect(control).toHaveFocus()
  },
}

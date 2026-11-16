import type {Meta, StoryObj} from '@storybook/react-vite'
import {useEffect, useId, useRef, useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {cn} from '../../internal/cn'
import {Button} from '../Button'
import {ToggleSwitch} from './ToggleSwitch'

const meta = {title: 'React Tailwind/Forms/ToggleSwitch/Features', component: ToggleSwitch} satisfies Meta<
  typeof ToggleSwitch
>
export default meta
type Story = StoryObj<typeof meta>

interface SwitchProps extends React.ComponentProps<typeof ToggleSwitch> {
  caption?: string
  label?: string
  labelClassName?: string
}

function Switch({caption, label = 'Toggle label', labelClassName, ...props}: SwitchProps) {
  const labelId = useId()
  const captionId = useId()

  if (caption) {
    return (
      <div className="flex items-start gap-4">
        <span className="grow">
          <span className="block font-semibold" id={labelId}>
            {label}
          </span>
          <span className="block text-sm text-muted" id={captionId}>
            {caption}
          </span>
        </span>
        <ToggleSwitch {...props} aria-labelledby={labelId} aria-describedby={captionId} />
      </div>
    )
  }

  return (
    <div className="grid max-w-80 grid-cols-[max-content_auto] items-center justify-between">
      <span className={cn('block text-sm font-semibold', labelClassName)} id={labelId}>
        {label}
      </span>
      <ToggleSwitch {...props} aria-labelledby={labelId} />
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
    const labelId = useId()
    return (
      <>
        <div className="flex max-w-[300px] items-start gap-4">
          <span className="block grow font-semibold [font-size:var(--text-title-size-small)]" id={labelId}>
            Notifications
          </span>
          <ToggleSwitch checked={checked} onCheckedChange={setChecked} aria-labelledby={labelId} />
        </div>
        <p>The switch is {checked ? 'on' : 'off'}</p>
      </>
    )
  },
}
export const Loading: Story = {render: () => <Switch loading />}

interface LoadingWithDelayArgs {
  loadingDelay: number
  loadingLabelDelay: number
}

function LoadingWithDelaySwitch({loadingDelay, loadingLabelDelay}: LoadingWithDelayArgs) {
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const timeout = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timeout.current), [])

  return (
    <Switch
      checked={checked}
      label="Enable feature"
      labelClassName="text-md font-[700]"
      loading={loading}
      loadingLabel={`${checked ? 'Enabling' : 'Disabling'} feature`}
      loadingLabelDelay={loadingLabelDelay}
      onCheckedChange={nextChecked => {
        setChecked(nextChecked)
        setLoading(true)
        window.clearTimeout(timeout.current)
        timeout.current = window.setTimeout(() => setLoading(false), loadingDelay)
      }}
    />
  )
}

export const LoadingWithDelay: StoryObj<LoadingWithDelayArgs> = {
  args: {loadingDelay: 5000, loadingLabelDelay: 2000},
  argTypes: {loadingDelay: {control: {type: 'number'}}, loadingLabelDelay: {control: {type: 'number'}}},
  render: args => <LoadingWithDelaySwitch {...args} />,
}
export const LabelEnd: Story = {render: () => <Switch statusLabelPosition="end" />}
export const WithCustomLabels: Story = {render: () => <Switch buttonLabelOn="Active" buttonLabelOff="Inactive" />}
export const FocusVisible: Story = {
  render: () => <Switch />,
  play: async ({canvasElement}) => {
    const control = within(canvasElement).getByRole('switch')
    await userEvent.tab()
    await expect(control).toHaveFocus()
  },
}

export const UnavailableControlled: Story = {
  render: function UnavailableControlledExample() {
    const [checked, setChecked] = useState(false)
    const [mode, setMode] = useState<'available' | 'disabled' | 'loading' | 'both'>('disabled')
    const [requests, setRequests] = useState(0)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setMode('disabled')}>Make disabled</Button>
          <Button onClick={() => setMode('loading')}>Make loading</Button>
          <Button onClick={() => setMode('both')}>Make disabled and loading</Button>
          <Button onClick={() => setMode('available')}>Make available</Button>
          <Button onClick={() => setChecked(!checked)}>Update value externally</Button>
        </div>
        <Button>Before switch</Button>
        <Switch
          checked={checked}
          disabled={mode === 'disabled' || mode === 'both'}
          loading={mode === 'loading' || mode === 'both'}
          loadingLabel="Saving firewall"
          loadingLabelDelay={0}
          label="Firewall"
          caption="Managed by your organization"
          onCheckedChange={nextChecked => {
            setRequests(requests + 1)
            setChecked(nextChecked)
          }}
        />
        <Button>After switch</Button>
        <p role="status">Changes requested: {requests}</p>
      </div>
    )
  },
}

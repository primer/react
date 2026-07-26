import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {FormControl} from '../FormControl'
import {Radio} from '../Radio'
import {RadioGroup} from './RadioGroup'

const meta = {title: 'React Tailwind/Forms/RadioGroup/Features', component: RadioGroup} satisfies Meta<
  typeof RadioGroup
>
export default meta
type Story = StoryObj<typeof meta>

function Choices({
  caption,
  defaultValue = 'one',
  disabled = false,
  label = 'visible',
  selected,
  validation,
}: {
  caption?: React.ReactNode
  defaultValue?: string
  disabled?: boolean
  label?: 'visible' | 'hidden' | 'external'
  selected?: 'one' | 'two' | 'three' | null
  validation?: {children: React.ReactNode; variant: 'error' | 'success'}
}) {
  return (
    <RadioGroup
      aria-labelledby={label === 'external' ? 'choiceHeading' : undefined}
      defaultValue={selected === null ? undefined : (selected ?? defaultValue)}
      name="choices"
      disabled={disabled}
    >
      {label !== 'external' ? <RadioGroup.Label visuallyHidden={label === 'hidden'}>Choices</RadioGroup.Label> : null}
      {caption ? <RadioGroup.Caption>{caption}</RadioGroup.Caption> : null}
      <FormControl layout="horizontal">
        <Radio value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Radio value="two" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Radio value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
      {validation ? (
        <RadioGroup.Validation variant={validation.variant}>{validation.children}</RadioGroup.Validation>
      ) : null}
    </RadioGroup>
  )
}

export const VisuallyHiddenLabel: Story = {
  render: () => <Choices label="hidden" />,
}
export const WithExternalLabel: Story = {
  render: () => (
    <>
      <div id="choiceHeading" className="mb-4 border-b border-default pb-2 text-title-medium leading-[30px]">
        External label
      </div>
      <Choices label="external" selected={null} />
    </>
  ),
}
export const Error: Story = {
  render: () => <Choices validation={{children: 'Something went wrong', variant: 'error'}} />,
}
export const Success: Story = {
  render: () => <Choices defaultValue="two" validation={{children: 'Great job!', variant: 'success'}} />,
}
export const Caption: Story = {
  render: () => <Choices caption="Caption" defaultValue="two" />,
}
export const KeyboardSelection: Story = {
  render: () => <Choices />,
  play: async ({canvasElement}) => {
    const [first, second] = within(canvasElement).getAllByRole('radio')
    first.focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(second).toBeChecked()
  },
}

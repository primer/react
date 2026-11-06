import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {FormControl} from '../FormControl'
import {Checkbox} from '../Checkbox'
import {CheckboxGroup} from './CheckboxGroup'

const meta = {title: 'React Tailwind/Forms/CheckboxGroup/Features', component: CheckboxGroup} satisfies Meta<
  typeof CheckboxGroup
>
export default meta
type Story = StoryObj<typeof meta>

const defaultSelected = ['one', 'two']

function Choices({
  caption,
  label = 'visible',
  selected = defaultSelected,
  validation,
}: {
  caption?: React.ReactNode
  label?: 'visible' | 'hidden' | 'external'
  selected?: string[]
  validation?: {children: React.ReactNode; variant: 'error' | 'success'}
}) {
  return (
    <CheckboxGroup aria-labelledby={label === 'external' ? 'choiceHeading' : undefined} defaultValue={selected}>
      {label !== 'external' ? (
        <CheckboxGroup.Label visuallyHidden={label === 'hidden'}>Choices</CheckboxGroup.Label>
      ) : null}
      {caption ? <CheckboxGroup.Caption>{caption}</CheckboxGroup.Caption> : null}
      <FormControl layout="horizontal">
        <Checkbox value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Checkbox value="two" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Checkbox value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
      {validation ? (
        <CheckboxGroup.Validation variant={validation.variant}>{validation.children}</CheckboxGroup.Validation>
      ) : null}
    </CheckboxGroup>
  )
}
export const VisuallyHiddenLabel: Story = {
  render: () => <Choices label="hidden" />,
}
export const WithExternalLabel: Story = {
  render: () => (
    <>
      <div
        id="choiceHeading"
        className="mb-4 border-b border-default pb-2 text-[length:var(--text-title-size-medium)] leading-[30px]"
      >
        External label
      </div>
      <Choices label="external" selected={[]} />
    </>
  ),
}
export const Error: Story = {
  render: () => <Choices validation={{children: 'Something went wrong', variant: 'error'}} />,
}
export const Success: Story = {
  render: () => <Choices validation={{children: 'Great job!', variant: 'success'}} />,
}
export const Caption: Story = {
  render: () => <Choices caption="Caption" />,
}
export const Checked: Story = {
  render: () => <Choices />,
  play: async ({canvasElement}) => {
    const [first, second] = within(canvasElement).getAllByRole('checkbox')
    await expect(first).toBeChecked()
    await userEvent.click(second)
    await expect(second).toBeChecked()
  },
}

import type {Meta, StoryObj} from '@storybook/react-vite'
import {Checkbox} from './Checkbox'
import {CheckboxField} from './Checkbox.storyHelpers'
const meta = {
  title: 'React Tailwind/Forms/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => <CheckboxField />,
}

type PlaygroundArgs = React.ComponentProps<typeof Checkbox> & {
  captionChildren?: React.ReactNode
  labelChildren?: React.ReactNode
  visuallyHidden?: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    captionChildren: 'Always unchecked unless `checked` is set to true in Storybook controls',
    checked: false,
    disabled: false,
    indeterminate: false,
    labelChildren: 'Default checkbox',
    visuallyHidden: false,
  },
  render: ({captionChildren, labelChildren, visuallyHidden, ...checkboxProps}) => (
    <CheckboxField {...checkboxProps} caption={captionChildren} label={labelChildren} visuallyHidden={visuallyHidden} />
  ),
}

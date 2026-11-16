import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Label} from '../Label'
import {LabelGroup, type LabelGroupProps} from './LabelGroup'

const labels = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
]

const ResizableContainer = ({children, ...props}: {children: React.ReactNode}) => (
  <div className="w-[600px] resize overflow-auto p-1 outline outline-1 outline-[var(--fgColor-default)]" {...props}>
    {children}
  </div>
)

const meta = {
  title: 'React Tailwind/Display/LabelGroup',
  component: LabelGroup,
} satisfies Meta<typeof LabelGroup>

export default meta
type Story = StoryObj<typeof meta>
type PlaygroundArgs = LabelGroupProps & {autoTruncateTokens?: boolean}

const playgroundArgTypes: Meta<PlaygroundArgs>['argTypes'] = {
  overflowStyle: {control: {type: 'radio'}, options: ['inline', 'overlay']},
  autoTruncateTokens: {name: 'Truncate to fit width', control: {type: 'boolean'}},
  visibleChildCount: {control: {type: 'number'}, if: {arg: 'autoTruncateTokens', truthy: false}},
}

export const Default: Story = {
  render: () => (
    <LabelGroup>
      {labels.map(label => (
        <Label key={label}>{label}</Label>
      ))}
    </LabelGroup>
  ),
}

export const Playground: Story = {
  args: {as: 'ul'},
  render: ({autoTruncateTokens, visibleChildCount, ...args}: PlaygroundArgs) => {
    const visibleChildCountValue = autoTruncateTokens ? 'auto' : visibleChildCount
    return (
      <ResizableContainer>
        <LabelGroup {...args} visibleChildCount={visibleChildCountValue}>
          {labels.map(label => (
            <Label key={label}>{label}</Label>
          ))}
        </LabelGroup>
      </ResizableContainer>
    )
  },
  argTypes: playgroundArgTypes as Meta<LabelGroupProps>['argTypes'],
}

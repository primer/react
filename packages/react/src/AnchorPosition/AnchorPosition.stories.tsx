import type {Meta, StoryFn} from '@storybook/react-vite'
import {Button} from '../Button'
import {Root, Anchor, Target} from './AnchorPosition'
import type {Alignment, FallbackStrategy, Placement} from './AnchorPosition'

const meta = {
  title: 'Components/AnchorPosition',
  component: Root,
} satisfies Meta<typeof Root>

export default meta

const targetStyle = {
  padding: 'var(--base-size-12)',
  color: 'var(--fgColor-default)',
  backgroundColor: 'var(--bgColor-default)',
  border: 'var(--borderWidth-thin) solid var(--borderColor-default)',
  borderRadius: 'var(--borderRadius-medium)',
  boxShadow: 'var(--shadow-floating-small)',
}

export const Default = () => (
  <Root>
    <Anchor as={Button}>Anchor</Anchor>
    <Target style={targetStyle}>Target</Target>
  </Root>
)

type PlaygroundArgs = {
  alignment: Alignment
  fallbackStrategy: FallbackStrategy
  gap: number
  placement: Placement
}

export const Playground: StoryFn<PlaygroundArgs> = ({alignment, fallbackStrategy, gap, placement}) => (
  <div style={{padding: '8rem'}}>
    <Root>
      <Anchor as={Button}>Anchor</Anchor>
      <Target
        alignment={alignment}
        fallbackStrategy={fallbackStrategy}
        gap={gap}
        placement={placement}
        style={targetStyle}
      >
        Target
      </Target>
    </Root>
  </div>
)

Playground.args = {
  alignment: 'start',
  fallbackStrategy: 'default',
  gap: 4,
  placement: 'below',
}

Playground.argTypes = {
  alignment: {
    control: 'radio',
    options: ['start', 'center', 'end'],
  },
  fallbackStrategy: {
    control: 'radio',
    options: ['default', 'none', 'opposite-side'],
  },
  gap: {
    control: {type: 'number', min: 0},
  },
  placement: {
    control: 'radio',
    options: ['above', 'below', 'start', 'end'],
  },
}

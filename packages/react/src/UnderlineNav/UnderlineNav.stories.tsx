import type {Meta, StoryFn} from '@storybook/react-vite'
import {UnderlineNav} from './index'
import {UnderlineNavItem} from './UnderlineNavItem'

const excludedControlKeys = ['as', 'align', 'afterSelect']

const meta: Meta<typeof UnderlineNav> = {
  title: 'Components/UnderlineNav',
  component: UnderlineNav,
  parameters: {
    controls: {
      expanded: true,
      // size and others were developed in the first design iteration but then they are abandoned.
      // Still keeping them on the source code for future reference but they are not exposed as props.
      exclude: excludedControlKeys,
    },
  },
  argTypes: {
    'aria-label': {
      type: {
        name: 'string',
      },
    },
    loadingCounters: {
      control: {
        type: 'boolean',
      },
    },
    variant: {
      control: 'radio',
      options: ['inset', 'flush'],
    },
  },
  args: {
    'aria-label': 'Repository',
    loadingCounters: false,
    variant: 'inset',
  },
}

export default meta

export const Default: StoryFn<typeof UnderlineNav> = () => {
  const children = ['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki']
  return (
    <UnderlineNav aria-label="Repository">
      {children.map((child: string, index: number) => (
        <UnderlineNavItem key={index} href="#" aria-current={index === 0 ? 'page' : undefined}>
          {child}
        </UnderlineNavItem>
      ))}
    </UnderlineNav>
  )
}

export const Playground: StoryFn<typeof UnderlineNav> = args => {
  const children = ['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki']
  return (
    <UnderlineNav {...args}>
      {children.map((child: string, index: number) => (
        <UnderlineNavItem key={index} href="#" aria-current={index === 0 ? 'page' : undefined}>
          {child}
        </UnderlineNavItem>
      ))}
    </UnderlineNav>
  )
}

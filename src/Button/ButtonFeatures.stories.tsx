import {EyeClosedIcon, EyeIcon, SearchIcon, TriangleDownIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import {Story, Meta} from '@storybook/react'
import React, {useState} from 'react'
import {Button, ButtonProps} from '.'
import {BaseStyles, ThemeProvider} from '..'

const unset = undefined
const icons = {unset, EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon}

const actionIcons = {unset, TriangleDownIcon}

export default {
  title: 'Components/Button/Features',
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large']
      }
    },
    disabled: {
      control: {
        type: 'boolean'
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: ['default', 'primary', 'danger', 'invisible', 'outline']
      }
    },
    alignContent: {
      control: {
        type: 'radio',
        options: ['center', 'start']
      }
    },
    block: {
      control: {
        type: 'boolean'
      }
    },
    leadingIcon: {
      description: 'The displayed icon on the left',
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    trailingIcon: {
      description: 'The displayed icon on the left',
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    trailingAction: {
      description: 'The displayed icon on the left',
      control: {
        type: 'select',
        options: Object.keys(actionIcons)
      },
      mapping: actionIcons
    }
  },
  args: {
    block: false,
    size: 'medium',
    disabled: false,
    variant: 'default',
    alignContent: 'center',
    trailingIcon: null,
    leadingIcon: null,
    trailingAction: null
  }
} as Meta<typeof Button>

const Template: Story = args => <Button {...args}>Default</Button>

export const Default = Template.bind({})
Default.args = {
  variant: 'default'
}

export const Primary = Template.bind({})
Primary.args = {
  variant: 'primary'
}

export const Danger = Template.bind({})
Danger.args = {
  variant: 'danger'
}

export const Invisible = Template.bind({})
Invisible.args = {
  variant: 'invisible'
}

export const LeadingVisual = Template.bind({})
LeadingVisual.args = {
  leadingIcon: HeartIcon
}

export const TrailingVisual = Template.bind({})
TrailingVisual.args = {
  trailingIcon: HeartIcon
}

export const TrailingAction = Template.bind({})
TrailingAction.args = {
  trailingAction: TriangleDownIcon
}

export const Block = Template.bind({})
Block.args = {
  block: true
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true
}

export const TrailingCounter = ({...args}: ButtonProps) => {
  // <Button trailingVisualCount={15} />

  const [count, setCount] = useState(0)
  return (
    <Button onClick={() => setCount(count + 1)} trailingVisualCount={count} {...args}>
      Watch
    </Button>
  )
  // return (
  //   <Button onClick={() => setCount(count + 1)} {...args}>
  //     Watch
  //     <Button.Counter>{count}</Button.Counter>
  //   </Button>
  // )
}

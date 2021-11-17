import React, {useState} from 'react'
import {NewButton as Button, NewButtonProps as ButtonProps} from '../NewButton'
import {BaseStyles, ThemeProvider} from '..'
import {Meta} from '@storybook/react'
import CounterLabel from '../CounterLabel'
import {XIcon, SearchIcon, EyeIcon, EyeClosedIcon, TriangleDownIcon} from '@primer/octicons-react'

export default {
  title: 'Composite components/New Button',

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
    }
  }
} as Meta

export const defaultButton = ({size = 'medium', ...args}: ButtonProps) => {
  return (
    <Button size={size} {...args}>
      Default
    </Button>
  )
}

export const primaryButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="primary">
      Primary
    </Button>
  )
}

export const dangerButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="danger">
      Danger
    </Button>
  )
}

export const invisibleButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="invisible">
      Invisible
    </Button>
  )
}

export const iconBeforeButton = (args: ButtonProps) => {
  return (
    <Button leadingIcon={SearchIcon} {...args}>
      Before
    </Button>
  )
}

export const iconButton = ({...args}: ButtonProps) => {
  return (
    <>
      <Button icon={XIcon} {...args}>
        Close
      </Button>
      <Button icon={XIcon} {...args} variant="invisible">
        Close
      </Button>
      <Button icon={XIcon} {...args} variant="danger">
        Close
      </Button>
      <Button icon={XIcon} {...args} variant="primary">
        Close
      </Button>
    </>
  )
}

export const WatchCounterButton = ({...args}: ButtonProps) => {
  const [count, setCount] = useState(0)
  return (
    <>
      <Button onClick={() => setCount(count + 1)} {...args}>
        Watch
        <CounterLabel sx={{ml: 2}}>{count}</CounterLabel>
      </Button>
      <Button onClick={() => setCount(count + 1)} {...args} variant="primary">
        Watch
        <CounterLabel sx={{ml: 2}}>{count}</CounterLabel>
      </Button>
      <Button onClick={() => setCount(count + 1)} {...args} variant="invisible">
        Watch
        <CounterLabel sx={{ml: 2}}>{count}</CounterLabel>
      </Button>
      <Button onClick={() => setCount(count + 1)} {...args} variant="danger">
        Watch
        <CounterLabel sx={{ml: 2}}>{count}</CounterLabel>
      </Button>
    </>
  )
}

export const WatchIconButton = ({...args}: ButtonProps) => {
  const [watching, setWatching] = useState(false)
  const icon = watching ? EyeClosedIcon : () => <EyeIcon />
  return (
    <Button onClick={() => setWatching(!watching)} trailingIcon={icon} {...args}>
      Watch
    </Button>
  )
}

export const caretButton = ({...args}: ButtonProps) => {
  return (
    <Button trailingIcon={TriangleDownIcon} {...args}>
      Dropdown
    </Button>
  )
}

export const blockButton = ({...args}: ButtonProps) => {
  return (
    <Button sx={{width: '100%'}} {...args}>
      Block
    </Button>
  )
}

export const disabledButton = ({...args}: ButtonProps) => {
  return (
    <>
      <Button disabled {...args}>
        Disabled
      </Button>
      <Button disabled variant="danger" {...args}>
        Disabled
      </Button>
      <Button disabled variant="invisible" {...args}>
        Disabled
      </Button>
      <Button disabled variant="primary" {...args}>
        Disabled
      </Button>
      <Button disabled icon={() => <XIcon />} {...args}></Button>
    </>
  )
}

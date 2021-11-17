import React, {useState} from 'react'
import {NewButton as Button, NewButtonProps as ButtonProps} from '../NewButton'
import {BaseStyles, ThemeProvider} from '..'
import {Meta} from '@storybook/react'
import {XIcon, SearchIcon, EyeIcon, EyeClosedIcon, TriangleDownIcon} from '@primer/octicons-react'
import Box from '../Box'

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
      <Box mb={2}>
        <Button icon={XIcon} {...args}>
          Close
        </Button>
      </Box>
      <Box mb={2}>
        <Button icon={XIcon} {...args} variant="invisible">
          Close
        </Button>
      </Box>
      <Box mb={2}>
        <Button icon={XIcon} {...args} variant="danger">
          Close
        </Button>
      </Box>
      <Box mb={2}>
        <Button icon={XIcon} {...args} variant="primary">
          Close
        </Button>
      </Box>
      <Box mb={2}>
        <Button icon={XIcon} {...args} variant="outline">
          Close
        </Button>
      </Box>
    </>
  )
}

export const WatchCounterButton = ({...args}: ButtonProps) => {
  const [count, setCount] = useState(0)
  return (
    <>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args}>
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args} variant="primary">
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args} variant="invisible">
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args} variant="danger">
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args} variant="outline">
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
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
    <Button {...args} sx={{width: '100%'}}>
      Block
    </Button>
  )
}

export const disabledButton = ({...args}: ButtonProps) => {
  return (
    <>
      <Box mb={2}>
        <Button disabled {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled variant="danger" {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled variant="invisible" {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled variant="primary" {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled variant="outline" {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled icon={() => <XIcon />} {...args}></Button>
      </Box>
    </>
  )
}

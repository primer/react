import type {StoryObj} from '@storybook/react-vite'
import {useEffect, useState} from 'react'
import {AriaStatus} from './AriaStatus'

export default {
  title: 'Experimental/Components/AriaStatus',
  component: AriaStatus,
}

export const Default = () => {
  const [message, setMessage] = useState('Default message')

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(`Last updated at ${new Date().toLocaleTimeString()}`)
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <AriaStatus>{message}</AriaStatus>
}

export const Playground: StoryObj = {
  argTypes: {
    announceOnShow: {
      control: 'boolean',
    },
    hidden: {
      control: 'boolean',
    },
    delayMs: {
      control: 'number',
    },
  },
  render: args => {
    return <AriaStatus {...args}>Example message</AriaStatus>
  },
}

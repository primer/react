import type {StoryObj} from '@storybook/react-vite'
import {useEffect, useState} from 'react'
import {AriaAlert} from './AriaAlert'

export default {
  title: 'Experimental/Components/AriaAlert',
  component: AriaAlert,
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

  return <AriaAlert>{message}</AriaAlert>
}

export const Playground: StoryObj = {
  argTypes: {
    announceOnShow: {
      control: 'boolean',
    },
  },
  render: args => {
    return <AriaAlert {...args}>Example message</AriaAlert>
  },
}

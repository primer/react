import {useEffect, useState} from 'react'
import {Announce} from './Announce'
import type {StoryObj} from '@storybook/react-vite'

export default {
  title: 'Experimental/Components/Announce',
  component: Announce,
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

  return <Announce>{message}</Announce>
}

export const Playground: StoryObj = {
  render: args => {
    return <Announce {...args}>Example message</Announce>
  },
}

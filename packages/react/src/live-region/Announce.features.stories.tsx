import type {StoryObj} from '@storybook/react-vite'
import {useEffect, useState} from 'react'
import {Announce} from './Announce'
import {VisuallyHidden} from '../VisuallyHidden'

export default {
  title: 'Experimental/Components/Announce/Features',
  component: Announce,
}

export const VisuallyHiddenStory: StoryObj = {
  name: 'VisuallyHidden',
  render: () => {
    return (
      <>
        <p>This is an example</p>
        <VisuallyHidden>
          <Announce>A visually hidden message</Announce>
        </VisuallyHidden>
      </>
    )
  },
}

export const WithDelay = () => {
  const [message, setMessage] = useState('Default message')

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(`Last updated at ${new Date().toLocaleTimeString()}`)
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <Announce delayMs={1000}>{message}</Announce>
}

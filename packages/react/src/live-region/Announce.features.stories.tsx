import type {StoryObj} from '@storybook/react'
import React, {useEffect, useState} from 'react'
import {Announce} from './Announce'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'

export default {
  title: 'Drafts/Components/Announce/Features',
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

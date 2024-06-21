import type {StoryObj} from '@storybook/react'
import React, {useEffect, useState} from 'react'
import {Status} from './Status'
import {VisuallyHidden} from './VisuallyHidden'

export default {
  title: 'Private/Components/Status',
  component: Status,
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

  return <Status>{message}</Status>
}

export const VisuallyHiddenStory: StoryObj = {
  name: 'VisuallyHidden',
  render: () => {
    return (
      <>
        <p>This is an example</p>
        <VisuallyHidden>
          <Status>A visually hidden message</Status>
        </VisuallyHidden>
      </>
    )
  },
}

import type {StoryObj} from '@storybook/react'
import React, {useEffect, useState} from 'react'
import {AriaStatus} from './AriaStatus'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'

export default {
  title: 'Drafts/Components/AriaStatus/Features',
  component: AriaStatus,
}

export const VisuallyHiddenStory: StoryObj = {
  name: 'VisuallyHidden',
  render: () => {
    return (
      <>
        <p>This is an example</p>
        <VisuallyHidden>
          <AriaStatus>A visually hidden message</AriaStatus>
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

  return <AriaStatus delayMs={1000}>{message}</AriaStatus>
}

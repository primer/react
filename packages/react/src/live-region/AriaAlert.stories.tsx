import type {StoryObj} from '@storybook/react'
import React, {useEffect, useState} from 'react'
import {AriaAlert} from './AriaAlert'
import {Button} from '../Button'
import RelativeTime from './../RelativeTime'
import {Banner} from './../Banner'
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

export const WithRelativeTime = () => {
  const [bannerShown, setBannerShown] = useState(false) 

  return (
    <>
      {bannerShown && (
        <Banner title="Info" description={<AriaAlert>This will expire on <RelativeTime datetime={new Date().toISOString()} /></AriaAlert>} />
      )}
      <Button onClick={() => setBannerShown(!bannerShown)}>Toggle Banner</Button>
    </>
  )
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

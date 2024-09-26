import React from 'react'
import type {Meta} from '@storybook/react'
import Spinner from './Spinner'
import {Box, Button} from '..'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'
import {AriaStatus} from '../live-region'

export default {
  title: 'Components/Spinner/Examples',
  component: Spinner,
} as Meta<typeof Spinner>

type LoadingState = 'initial' | 'loading' | 'done'

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// There should be an announcement when loading is completed or if there was an error loading
export const FullLifecycle = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadedContent, setLoadedContent] = React.useState('')
  let state: LoadingState = 'initial'

  if (isLoading) {
    state = 'loading'
  } else if (loadedContent) {
    state = 'done'
  }

  const initiateLoading = async () => {
    if (state === 'done') {
      return
    }

    setIsLoading(true)
    await wait(1000)
    setLoadedContent('Some content that had to be loaded.')
    setIsLoading(false)
  }

  return (
    <>
      <Button onClick={initiateLoading} sx={{mb: '1em'}}>
        Load content
      </Button>
      {state === 'loading' && <Spinner />}
      <p>{loadedContent}</p>
      <VisuallyHidden>
        <AriaStatus>{state === 'done' && 'Content finished loading'}</AriaStatus>
      </VisuallyHidden>
    </>
  )
}

// We should avoid duplicate loading announcements
export const FullLifecycleVisibleLoadingText = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadedContent, setLoadedContent] = React.useState('')
  let state: LoadingState = 'initial'

  if (isLoading) {
    state = 'loading'
  } else if (loadedContent) {
    state = 'done'
  }

  const initiateLoading = async () => {
    if (state === 'done') {
      return
    }

    setIsLoading(true)
    await wait(1000)
    setLoadedContent('Some content that had to be loaded.')
    setIsLoading(false)
  }

  return (
    <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: '0.5em'}}>
      <Button onClick={initiateLoading} sx={{mb: '1em'}}>
        Load content
      </Button>
      {state !== 'done' && (
        <Box sx={{alignItems: 'center', display: 'flex', gap: '0.25rem'}}>
          {state === 'loading' && <Spinner size="small" srText={null} />}
          <AriaStatus>{state === 'loading' ? 'Content is loading...' : ''}</AriaStatus>
        </Box>
      )}
      <p>{loadedContent}</p>
      <VisuallyHidden>
        <AriaStatus>{state === 'done' && 'Content finished loading'}</AriaStatus>
      </VisuallyHidden>
    </Box>
  )
}

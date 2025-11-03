import React from 'react'
import type {Meta} from '@storybook/react-vite'
import Spinner from './Spinner'
import {Button} from '..'
import {VisuallyHidden} from '../VisuallyHidden'
import {AriaStatus} from '../live-region'
import classes from './SpinnerStories.module.css'

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
      <Button onClick={initiateLoading} style={{marginBottom: '1em'}}>
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
    <div className={classes.LoadingExample}>
      <Button onClick={initiateLoading} className={classes.LoadButton}>
        Load content
      </Button>
      {state !== 'done' && (
        <div className={classes.LoadingIndicator}>
          {state === 'loading' && <Spinner size="small" srText={null} />}
          <AriaStatus>{state === 'loading' ? 'Content is loading...' : ''}</AriaStatus>
        </div>
      )}
      <p>{loadedContent}</p>
      <VisuallyHidden>
        <AriaStatus>{state === 'done' && 'Content finished loading'}</AriaStatus>
      </VisuallyHidden>
    </div>
  )
}

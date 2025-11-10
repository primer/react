import React from 'react'
import type {Meta} from '@storybook/react-vite'
import Spinner from './Spinner'
import {Button, Text, Stack} from '..'
import {VisuallyHidden} from '../VisuallyHidden'
import {AriaStatus} from '../live-region'
import {CheckCircleFillIcon, XCircleFillIcon} from '@primer/octicons-react'
import classes from './Spinner.examples.stories.module.css'

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

// Example showing a list of PR checks similar to GitHub's UI
export const PullRequestChecks = () => {
  type CheckStatus = 'pending' | 'success' | 'failure'

  interface Check {
    id: string
    name: string
    description: string
    status: CheckStatus
  }

  const [checks, setChecks] = React.useState<Check[]>([
    {id: '1', name: 'Build', description: 'Building and testing the application', status: 'pending'},
    {id: '2', name: 'Lint', description: 'Running ESLint checks', status: 'pending'},
    {id: '3', name: 'Type Check', description: 'Running TypeScript type checks', status: 'pending'},
    {id: '4', name: 'Tests', description: 'Running unit tests', status: 'pending'},
  ])

  const runChecks = async () => {
    // Simulate checks running one by one
    for (let i = 0; i < checks.length; i++) {
      await wait(1500)
      setChecks(prevChecks => {
        const newChecks = [...prevChecks]
        // Randomly pass or fail each check (mostly pass)
        newChecks[i] = {...newChecks[i], status: Math.random() > 0.2 ? 'success' : 'failure'}
        return newChecks
      })
    }
  }

  const allComplete = checks.every(check => check.status !== 'pending')
  const hasFailures = checks.some(check => check.status === 'failure')

  return (
    <Stack direction="vertical" gap="normal" padding="normal">
      <div>
        <Button onClick={runChecks} disabled={!allComplete && checks.some(check => check.status !== 'pending')}>
          Run checks
        </Button>
      </div>

      <Stack direction="vertical" gap="condensed" className={classes.ChecksList}>
        {checks.map(check => (
          <div key={check.id} className={classes.CheckItem}>
            <div className={classes.CheckIcon}>
              {check.status === 'pending' && <Spinner size="small" srText={null} />}
              {check.status === 'success' && (
                <CheckCircleFillIcon size={16} fill="var(--fgColor-success)" aria-label="Success" />
              )}
              {check.status === 'failure' && (
                <XCircleFillIcon size={16} fill="var(--fgColor-danger)" aria-label="Failed" />
              )}
            </div>
            <div className={classes.CheckContent}>
              <Text weight="semibold">{check.name}</Text>
              <Text size="small" className={classes.CheckDescription}>
                {check.description}
              </Text>
            </div>
          </div>
        ))}
      </Stack>

      {allComplete && (
        <VisuallyHidden>
          <AriaStatus>{hasFailures ? 'Some checks failed' : 'All checks passed successfully'}</AriaStatus>
        </VisuallyHidden>
      )}
    </Stack>
  )
}

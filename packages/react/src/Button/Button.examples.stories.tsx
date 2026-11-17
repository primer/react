import React from 'react'
import type {Meta} from '@storybook/react-vite'
import {Button} from '.'
import {DownloadIcon} from '@primer/octicons-react'
import {Banner} from '../Banner'
import {AriaStatus, AriaAlert} from '../live-region'

const meta: Meta<typeof Button> = {
  title: 'Components/Button/Examples',
} as Meta<typeof Button>

export default meta

export const LoadingStatusAnnouncementSuccessful = () => {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const resolveAction = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)

    return await true
  }

  const onClick = (resolveType: 'error' | 'success') => async () => {
    const actionResult = await resolveAction()

    if (resolveType === 'error') {
      setSuccess(!actionResult)
      return
    }

    setSuccess(actionResult)
  }

  return (
    <>
      <AriaStatus>{!loading && success ? 'Export completed' : null}</AriaStatus>
      <Button loading={loading} leadingVisual={DownloadIcon} onClick={onClick('success')}>
        Export (success)
      </Button>
    </>
  )
}
LoadingStatusAnnouncementSuccessful.parameters = {
  docs: {
    description: {
      story:
        'While `loading` is set, the button announces its loading state for you through its built-in live region, so you should not add a separate loading announcement. Announcing the *result* of the action is still your responsibility — here, a polite `AriaStatus` live region announces "Export completed" once the action resolves successfully.',
    },
  },
}

export const LoadingStatusAnnouncementError = () => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  const resolveAction = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)

    return await true
  }

  const onClick = (resolveType: 'error' | 'success') => async () => {
    const actionResult = await resolveAction()

    if (resolveType === 'error') {
      setError(actionResult)
      return
    }

    setError(!actionResult)
  }

  return (
    <>
      {!loading && error ? (
        <AriaAlert>
          <Banner title="Export failed" variant="critical" />
        </AriaAlert>
      ) : null}

      <Button loading={loading} leadingVisual={DownloadIcon} onClick={onClick('error')}>
        Export (error)
      </Button>
    </>
  )
}
LoadingStatusAnnouncementError.parameters = {
  docs: {
    description: {
      story:
        'The button handles the loading announcement for you, so you only need to announce the outcome. Here, an assertive `AriaAlert` surfaces an error `Banner` when the action fails.',
    },
  },
}

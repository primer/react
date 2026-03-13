import React from 'react'
import type {Meta} from '@storybook/react-vite'
import {Button} from '.'
import {DownloadIcon, ShieldIcon} from '@primer/octicons-react'
import {Banner} from '../Banner'
import BranchName from '../BranchName'
import Label from '../Label'
import Text from '../Text'
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

export const TwoLineButton = () => (
  <Button block variant="invisible" alignContent="start" leadingVisual={ShieldIcon}>
    <span>
      <BranchName>main</BranchName> <Label>default</Label>
    </span>
    <br />
    <Text size="small">First detected 2 weeks ago</Text>
  </Button>
)

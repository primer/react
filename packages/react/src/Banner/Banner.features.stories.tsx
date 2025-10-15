import {CopilotIcon, GitPullRequestIcon} from '@primer/octicons-react'
import {action} from 'storybook/actions'
import type {Meta} from '@storybook/react-vite'
import React from 'react'
import {Banner} from '../Banner'
import Link from '../Link'
import {Dialog} from '../Dialog/Dialog'

const meta = {
  title: 'Components/Banner/Features',
  component: Banner,
} satisfies Meta<typeof Banner>

export default meta

export const Critical = () => {
  return (
    <Banner
      title="Critical"
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      variant="critical"
    />
  )
}

export const Info = () => {
  return (
    <Banner
      title="Info"
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
      variant="info"
    ></Banner>
  )
}

export const Success = () => {
  return (
    <Banner
      title="Success"
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
      variant="success"
    />
  )
}

export const Upsell = () => {
  return (
    <Banner
      title="Upsell"
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
      variant="upsell"
    />
  )
}

export const Warning = () => {
  return (
    <Banner
      title="Warning"
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
      variant="warning"
    />
  )
}

export const Dismiss = () => {
  return (
    <Banner
      title="Notice"
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
    />
  )
}

export const DismissWithActions = () => {
  return (
    <Banner
      title="Notice"
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
    />
  )
}

export const WithHiddenTitle = () => {
  return (
    <Banner
      title="Warning"
      hideTitle
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      variant="warning"
    />
  )
}

export const WithHiddenTitleAndActions = () => {
  return (
    <Banner
      title="Warning"
      hideTitle
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      variant="warning"
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
    />
  )
}

export const DismissibleWithHiddenTitleAndActions = () => {
  return (
    <Banner
      title="Warning"
      hideTitle
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
      variant="warning"
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
    />
  )
}

export const DismissibleWithHiddenTitleAndSecondaryAction = () => {
  return (
    <Banner
      title="Warning"
      hideTitle
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
      variant="warning"
      secondaryAction={<Banner.SecondaryAction leadingVisual={GitPullRequestIcon}>Button</Banner.SecondaryAction>}
    />
  )
}

export const WithActions = () => {
  return (
    <Banner
      title="Warning"
      description={
        <>
          GitHub users are{' '}
          <Link inline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
      variant="warning"
    />
  )
}

export const CustomIcon = () => {
  return (
    <Banner
      title="Upsell"
      description="An example banner with a custom icon"
      icon={<CopilotIcon />}
      onDismiss={action('onDismiss')}
      variant="upsell"
    />
  )
}

export const SingleLineWithAction = () => {
  return (
    <Banner
      onDismiss={action('onDismiss')}
      title="This is a single line"
      hideTitle
      description="This is a single line"
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
    />
  )
}

export const InsideDialog = () => {
  const onDialogClose = React.useCallback(() => {}, [])

  return (
    <Dialog title="Add issue fields" onClose={onDialogClose} width="small">
      <Banner
        title="Something went wrong adding fields."
        hideTitle
        description="Please try again."
        variant="critical"
        primaryAction={<Banner.PrimaryAction onClick={action('Try again')}>Try again</Banner.PrimaryAction>}
      />
    </Dialog>
  )
}

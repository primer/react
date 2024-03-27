import React from 'react'
import {action} from '@storybook/addon-actions'
import type {Meta} from '@storybook/react'
import {Banner} from '../Banner'
import Link from '../Link'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'

const meta = {
  title: 'Drafts/Components/Banner/Features',
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
          <Link inline underline href="#">
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
          <Link inline underline href="#">
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
          <Link inline underline href="#">
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
          <Link inline underline href="#">
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
          <Link inline underline href="#">
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
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      onDismiss={action('onDismiss')}
    />
  )
}

export const WithNoTitle = () => {
  return (
    <Banner variant="warning">
      <VisuallyHidden>
        <Banner.Title>Warning</Banner.Title>
      </VisuallyHidden>
      <Banner.Description>
        GitHub users are{' '}
        <Link inline underline href="#">
          now required
        </Link>{' '}
        to enable two-factor authentication as an additional security measure.
      </Banner.Description>
    </Banner>
  )
}

export const WithActions = () => {
  return (
    <Banner
      title="Warning"
      description={
        <>
          GitHub users are{' '}
          <Link inline underline href="#">
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

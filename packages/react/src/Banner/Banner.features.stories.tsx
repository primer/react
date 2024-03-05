import {Banner} from '../Banner'
import {action} from '@storybook/addon-actions'
import Link from '../Link'
import type {Meta} from '@storybook/react'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'

const meta = {
  title: 'Drafts/Components/Banner/Features',
  component: Banner,
} satisfies Meta<typeof Banner>

export default meta

export const Critical = () => {
  return (
    <Banner variant="critical">
      <Banner.Content>
        <Banner.Title>Critical</Banner.Title>
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}

export const Info = () => {
  return (
    <Banner onDismiss={action('onDismiss')} variant="info">
      <Banner.Content>
        <Banner.Title>Info</Banner.Title>
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}

export const Success = () => {
  return (
    <Banner onDismiss={action('onDismiss')} variant="success">
      <Banner.Content>
        <Banner.Title>Success</Banner.Title>
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}

export const Upsell = () => {
  return (
    <Banner onDismiss={action('onDismiss')} variant="upsell">
      <Banner.Content>
        <Banner.Title>Upsell</Banner.Title>
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}

export const Warning = () => {
  return (
    <Banner onDismiss={action('onDismiss')} variant="warning">
      <Banner.Content>
        <Banner.Title>Warning</Banner.Title>
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}

export const Dismiss = () => {
  return (
    <Banner onDismiss={action('onDismiss')}>
      <Banner.Content>
        <Banner.Title>Notice</Banner.Title>
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}

export const WithNoTitle = () => {
  return (
    <Banner variant="warning">
      <Banner.Content>
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
      </Banner.Content>
    </Banner>
  )
}

export const WithActions = () => {
  return (
    <Banner variant="warning">
      <Banner.Content>
        <Banner.Title>Warning</Banner.Title>
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
      </Banner.Content>
      <Banner.Actions
        primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
      />
    </Banner>
  )
}

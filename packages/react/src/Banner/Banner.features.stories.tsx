import {Banner} from '../Banner'
import {action} from '@storybook/addon-actions'
import Link from '../Link'
import type {Meta} from '@storybook/react'

const meta = {
  title: 'Drafts/Components/Banner/Features',
  component: Banner,
} satisfies Meta<typeof Banner>

export default meta

export const Critical = () => {
  return (
    <Banner variant="critical">
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

export const Info = () => {
  return (
    <Banner onDismiss={action('onDismiss')} variant="info">
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

export const Success = () => {
  return (
    <Banner onDismiss={action('onDismiss')} variant="success">
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

export const Upsell = () => {
  return (
    <Banner onDismiss={action('onDismiss')} variant="upsell">
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

export const Warning = () => {
  return (
    <Banner onDismiss={action('onDismiss')} variant="warning">
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

export const Dismiss = () => {
  return (
    <Banner onDismiss={action('onDismiss')}>
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

export const TitleOnly = () => {
  return (
    <Banner
      title={
        <>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </>
      }
      variant="warning"
    />
  )
}

export const WithTitle = () => {
  return (
    <Banner title="This is a title" variant="warning">
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
    <Banner title="This is a title" variant="warning">
      <Banner.Description>
        GitHub users are{' '}
        <Link inline underline href="#">
          now required
        </Link>{' '}
        to enable two-factor authentication as an additional security measure.
      </Banner.Description>
      <Banner.Actions>
        <Banner.PrimaryAction>Button</Banner.PrimaryAction>
        <Banner.SecondaryAction>Button</Banner.SecondaryAction>
      </Banner.Actions>
    </Banner>
  )
}

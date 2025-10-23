import {CopilotIcon, GitPullRequestIcon} from '@primer/octicons-react'
import {action} from 'storybook/actions'
import type {Meta} from '@storybook/react-vite'
import React from 'react'
import {Banner} from '../Banner'
import Link from '../Link'
import {Dialog} from '../Dialog/Dialog'
import {Stack} from '../Stack'
import Heading from '../Heading'

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

export const InsideDialog = () => {
  const onDialogClose = React.useCallback(() => {}, [])

  return (
    <Dialog title="Add issue fields" onClose={onDialogClose} width="small">
      <Banner
        title="Something went wrong adding fields."
        hideTitle
        description="Please try again."
        variant="critical"
        actionsLayout="inline"
        primaryAction={<Banner.PrimaryAction onClick={action('Try again')}>Try again</Banner.PrimaryAction>}
      />
    </Dialog>
  )
}

export const ActionsLayoutStacked = () => {
  return (
    <Stack gap="spacious">
      <Stack style={{maxWidth: '320px'}}>
        <Heading variant="small" as="h3">
          Mobile (320px)
        </Heading>
        <Banner
          title="Actions Layout: Stacked"
          aria-label="Actions Layout Stacked Mobile"
          description="Actions are displayed in a vertical stack on both mobile and desktop."
          variant="info"
          actionsLayout="stacked"
          primaryAction={<Banner.PrimaryAction onClick={action('Primary')}>Primary Action</Banner.PrimaryAction>}
          secondaryAction={
            <Banner.SecondaryAction onClick={action('Secondary')}>Secondary Action</Banner.SecondaryAction>
          }
        />
        <Banner
          title="Actions Layout: Stacked"
          aria-label="Actions Layout Stacked Mobile Dismissible"
          description="Actions are displayed in a vertical stack on both mobile and desktop."
          variant="info"
          actionsLayout="stacked"
          onDismiss={action('onDismiss')}
          primaryAction={<Banner.PrimaryAction onClick={action('Primary')}>Primary Action</Banner.PrimaryAction>}
          secondaryAction={
            <Banner.SecondaryAction onClick={action('Secondary')}>Secondary Action</Banner.SecondaryAction>
          }
        />
      </Stack>

      <Stack style={{maxWidth: '768px'}}>
        <Heading variant="small" as="h3">
          Desktop (768px)
        </Heading>
        <Banner
          title="Actions Layout: Stacked"
          aria-label="Actions Layout Stacked Desktop"
          description="Actions are displayed in a vertical stack on both mobile and desktop."
          variant="info"
          actionsLayout="stacked"
          primaryAction={<Banner.PrimaryAction onClick={action('Primary')}>Primary Action</Banner.PrimaryAction>}
          secondaryAction={
            <Banner.SecondaryAction onClick={action('Secondary')}>Secondary Action</Banner.SecondaryAction>
          }
        />
        <Banner
          title="Actions Layout: Stacked"
          aria-label="Actions Layout Stacked Desktop Dismissible"
          description="Actions are displayed in a vertical stack on both mobile and desktop."
          variant="info"
          actionsLayout="stacked"
          onDismiss={action('onDismiss')}
          primaryAction={<Banner.PrimaryAction onClick={action('Primary')}>Primary Action</Banner.PrimaryAction>}
          secondaryAction={
            <Banner.SecondaryAction onClick={action('Secondary')}>Secondary Action</Banner.SecondaryAction>
          }
        />
      </Stack>
    </Stack>
  )
}

export const ActionsLayoutInline = () => {
  return (
    <Stack gap="spacious">
      <Stack style={{maxWidth: '320px'}}>
        <Heading variant="small" as="h3">
          Mobile (320px)
        </Heading>
        <Banner
          title="A short title"
          aria-label="Actions Layout Inline Mobile"
          description="A very short message."
          variant="warning"
          actionsLayout="inline"
          primaryAction={<Banner.PrimaryAction onClick={action('Primary')}>Primary</Banner.PrimaryAction>}
        />
        <Banner
          title="A short title"
          aria-label="Actions Layout Inline Mobile Dismissible"
          description="A very short message."
          variant="warning"
          actionsLayout="inline"
          onDismiss={action('onDismiss')}
          primaryAction={<Banner.PrimaryAction onClick={action('Primary')}>Primary</Banner.PrimaryAction>}
        />
      </Stack>

      <Stack style={{maxWidth: '768px'}}>
        <Heading variant="small" as="h3">
          Desktop (768px)
        </Heading>
        <Banner
          title="A short title"
          aria-label="Actions Layout Inline Desktop"
          description="A very short message."
          variant="warning"
          actionsLayout="inline"
          primaryAction={<Banner.PrimaryAction onClick={action('Primary')}>Primary</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction onClick={action('Secondary')}>Secondary</Banner.SecondaryAction>}
        />
        <Banner
          title="A short title"
          aria-label="Actions Layout Inline Desktop Dismissible"
          description="A very short message."
          variant="warning"
          actionsLayout="inline"
          onDismiss={action('onDismiss')}
          primaryAction={<Banner.PrimaryAction onClick={action('Primary')}>Primary</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction onClick={action('Secondary')}>Secondary</Banner.SecondaryAction>}
        />
      </Stack>
    </Stack>
  )
}

import {CopilotIcon, GitPullRequestIcon} from '@primer/octicons-react'
import {action} from 'storybook/actions'
import type {Meta} from '@storybook/react-vite'
import React from 'react'
import {Banner} from '../Banner'
import Link from '../Link'
import {Dialog} from '../Dialog'
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

Critical.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#variants-and-leading-visuals'],
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

Info.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#variants-and-leading-visuals', './SPEC.md#dismissal'],
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

Success.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#variants-and-leading-visuals', './SPEC.md#dismissal'],
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

Upsell.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#variants-and-leading-visuals', './SPEC.md#dismissal'],
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

Warning.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#variants-and-leading-visuals', './SPEC.md#dismissal'],
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

Dismiss.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#dismissal'],
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

DismissWithActions.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#actions', './SPEC.md#dismissal'],
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

WithHiddenTitle.parameters = {
  spec: ['./SPEC.md#default'],
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

WithHiddenTitleAndActions.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#actions'],
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

DismissibleWithHiddenTitleAndActions.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#actions', './SPEC.md#dismissal'],
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

DismissibleWithHiddenTitleAndSecondaryAction.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#actions', './SPEC.md#dismissal'],
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

WithActions.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#variants-and-leading-visuals', './SPEC.md#actions'],
}

export const ActionsAsLinks = () => {
  return (
    <Banner
      title="Subscription expires soon"
      description="Extend your subscription to keep access to all features."
      primaryAction={
        <Banner.PrimaryAction as="a" href="#extend-subscription">
          Extend subscription
        </Banner.PrimaryAction>
      }
      secondaryAction={
        <Banner.SecondaryAction as="a" href="#learn-more">
          Learn more
        </Banner.SecondaryAction>
      }
      variant="warning"
    />
  )
}

ActionsAsLinks.parameters = {
  spec: ['./SPEC.md#actions'],
}

export const CustomIcon = () => {
  return (
    <Banner
      title="Upsell"
      description="An example banner with a custom icon"
      leadingVisual={<CopilotIcon />}
      onDismiss={action('onDismiss')}
      variant="upsell"
    />
  )
}

CustomIcon.parameters = {
  spec: ['./SPEC.md#variants-and-leading-visuals'],
}

export const FlushInsideDialog = () => {
  const onDialogClose = React.useCallback(() => {}, [])

  return (
    <Dialog
      title="Add issue fields"
      onClose={onDialogClose}
      height="small"
      renderBody={({children}) => {
        // custom renderBody to remove default padding from body and move it to the child after banner
        return <div style={{padding: 0}}>{children}</div>
      }}
    >
      <Banner
        title="Something went wrong loading custom fields."
        description="Please try again."
        variant="critical"
        actionsLayout="inline"
        primaryAction={<Banner.PrimaryAction onClick={action('Try again')}>Try again</Banner.PrimaryAction>}
        flush
      />
      <div style={{padding: 'var(--base-size-16)'}}>rest of the dialog content goes here</div>
    </Dialog>
  )
}

FlushInsideDialog.parameters = {
  spec: ['./SPEC.md#actions', './SPEC.md#layout'],
}

export const Compact = () => {
  return (
    <Banner
      title="Compact banner"
      description="Compact layout reduces the padding without changing the Banner structure."
      layout="compact"
    />
  )
}

Compact.parameters = {
  spec: ['./SPEC.md#default', './SPEC.md#layout'],
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

ActionsLayoutStacked.parameters = {
  spec: ['./SPEC.md#actions', './SPEC.md#layout'],
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

ActionsLayoutInline.parameters = {
  spec: ['./SPEC.md#actions', './SPEC.md#layout'],
}

import React from 'react'
import {CopilotIcon, GitPullRequestIcon} from '@primer/octicons-react'
import {action} from '@storybook/addon-actions'
import type {Meta} from '@storybook/react'
import {Banner} from '../Banner'
import Link from '../Link'
import FormControl from '../FormControl'
import RadioGroup from '../RadioGroup'
import Radio from '../Radio'
import {AriaStatus} from '../live-region'

const meta = {
  title: 'Experimental/Components/Banner/Features',
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

export const DismissWithActions = () => {
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

export const WithHiddenTitleAndActions = () => {
  return (
    <Banner
      title="Warning"
      hideTitle
      description={
        <>
          GitHub users are{' '}
          <Link inline underline href="#">
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
          <Link inline underline href="#">
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
          <Link inline underline href="#">
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

export const WithAnnouncement = () => {
  type Choice = 'one' | 'two' | 'three'
  const messages: Map<Choice, string> = new Map([
    ['one', 'This is a message for choice one'],
    ['two', 'This is a message for choice two'],
    ['three', 'This is a message for choice three'],
  ])
  const [selected, setSelected] = React.useState<Choice>('one')

  return (
    <>
      <Banner
        title="Info"
        description={<AriaStatus>{messages.get(selected)}</AriaStatus>}
        onDismiss={action('onDismiss')}
        primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
      />
      <RadioGroup
        sx={{marginTop: 4}}
        name="options"
        onChange={selected => {
          setSelected(selected as Choice)
        }}
      >
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <FormControl>
          <Radio value="one" defaultChecked />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </RadioGroup>
    </>
  )
}

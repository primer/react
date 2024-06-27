import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import Link from '../Link'
import {Banner} from '../Banner'
import {PageLayout} from '../PageLayout'
import {action} from '@storybook/addon-actions'

const meta = {
  title: 'Drafts/Components/Banner',
  component: Banner,
} satisfies Meta<typeof Banner>

export default meta

export const Default = () => {
  return (
    <Banner
      onDismiss={action('onDismiss')}
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
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
    />
  )
}

export const Playground: StoryObj<typeof Banner> = {
  render: ({onDismiss, primaryAction, secondaryAction, ...rest}) => {
    return (
      <PageLayout>
        <PageLayout.Pane divider="line" position="start">
          <Banner
            onDismiss={onDismiss ? action('onDismiss') : undefined}
            primaryAction={primaryAction ? <Banner.PrimaryAction>{primaryAction}</Banner.PrimaryAction> : null}
            secondaryAction={
              secondaryAction ? <Banner.SecondaryAction>{secondaryAction}</Banner.SecondaryAction> : null
            }
            {...rest}
          />
        </PageLayout.Pane>

        <PageLayout.Content>
          <Banner
            onDismiss={onDismiss ? action('onDismiss') : undefined}
            primaryAction={primaryAction ? <Banner.PrimaryAction>{primaryAction}</Banner.PrimaryAction> : null}
            secondaryAction={
              secondaryAction ? <Banner.SecondaryAction>{secondaryAction}</Banner.SecondaryAction> : null
            }
            {...rest}
          />
        </PageLayout.Content>
      </PageLayout>
    )
  },
  args: {
    title: 'Banner title',
    description:
      'GitHub users are now required to en able two-factor authentication as an additional security measure.',
    variant: 'info',
  },
  argTypes: {
    title: {
      control: 'text',
      defaultValue: 'Banner title',
    },
    description: {
      control: 'text',
    },
    onDismiss: {
      control: 'boolean',
      defaultValue: false,
    },
    primaryAction: {
      control: 'text',
    },
    secondaryAction: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['critical', 'info', 'success', 'upsell', 'warning'],
    },
  },
}

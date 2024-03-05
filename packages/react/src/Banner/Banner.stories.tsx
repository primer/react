import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import Link from '../Link'
import {Banner} from '../Banner'
import {action} from '@storybook/addon-actions'

const meta = {
  title: 'Drafts/Components/Banner',
  component: Banner,
} satisfies Meta<typeof Banner>

export default meta

export const Default = () => {
  return (
    <Banner onDismiss={action('onDismiss')}>
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
      <Banner.Actions
        primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
      />
    </Banner>
  )
}

export const Playground: StoryObj<typeof Banner> = {
  render: ({onDismiss, variant, ...rest}) => {
    return (
      <Banner {...rest} onDismiss={onDismiss ? action('onDismiss') : undefined} variant={variant}>
        <Banner.Content>
          <Banner.Title>Banner title</Banner.Title>
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
  },
  argTypes: {
    onDismiss: {
      controls: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    variant: {
      controls: {
        type: 'radio',
      },
      options: ['critical', 'info', 'success', 'upsell', 'warning'],
    },
  },
}

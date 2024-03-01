import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {Button} from '../Button'
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
    <Banner title="This is a title" onDismiss={action('onDismiss')}>
      <Banner.Description>
        GitHub users are{' '}
        <Link inline href="#">
          now required
        </Link>{' '}
        to enable two-factor authentication as an additional security measure.
      </Banner.Description>
      <Banner.Actions>
        <Button>Button</Button>
        <Button variant="invisible">Button</Button>
      </Banner.Actions>
    </Banner>
  )
}

export const Playground: StoryObj<typeof Banner> = {
  render: ({onDismiss, variant, ...rest}) => {
    return (
      <Banner
        {...rest}
        title="This is the title"
        onDismiss={onDismiss ? action('onDismiss') : undefined}
        variant={variant}
      >
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
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

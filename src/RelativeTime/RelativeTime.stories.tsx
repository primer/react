import {RelativeTime} from './RelativeTime'
import React from 'react'
import {Meta, Story} from '@storybook/react'

const meta: Meta = {
  title: 'Components/RelativeTime',
  component: RelativeTime,
  parameters: {
    layout: 'fullscreen',
    controls: {
      exclude: /^(getFormatted.*|datetime|sx|as|theme|forwardedAs|.*Callback)$/g
    }
  },
  args: {
    date: new Date('2020-01-01T00:00:00Z'),
    day: 'numeric',
    month: 'short',
    year: '',
    timeZoneName: ''
  },
  argTypes: {
    hour: {
      type: {
        name: 'enum',
        value: ['', 'numeric', '2-digit']
      },
      control: {
        type: 'select',
        labels: {
          '': '(None)'
        }
      }
    },
    minute: {
      type: {
        name: 'enum',
        value: ['', 'numeric', '2-digit']
      },
      control: {
        type: 'select',
        labels: {
          '': '(None)'
        }
      }
    },
    day: {
      type: {
        name: 'enum',
        value: ['', 'numeric', '2-digit']
      },
      control: {
        type: 'select',
        labels: {
          '': '(None)'
        }
      }
    },
    month: {
      type: {
        name: 'enum',
        value: ['', 'numeric', '2-digit', 'long', 'short', 'narrow']
      },
      control: {
        type: 'select',
        labels: {
          '': '(None)'
        }
      }
    },
    year: {
      type: {
        name: 'enum',
        value: ['', 'numeric', '2-digit']
      },
      control: {
        type: 'select',
        labels: {
          '': '(None)'
        }
      }
    },
    timeZoneName: {
      type: {
        name: 'enum',
        value: ['', 'long', 'short', 'longOffset', 'shortOffset', 'longGeneric', 'shortGeneric']
      },
      control: {
        type: 'select',
        labels: {
          '': '(None)'
        }
      }
    },
    date: {
      control: 'date'
    }
  }
}

export const Default: Story = args => {
  const {date, ...rest} = args
  return <RelativeTime {...rest} date={new Date(date)} sx={{color: 'accent.fg'}} />
}

export default meta

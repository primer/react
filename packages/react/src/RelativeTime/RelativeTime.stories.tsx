import RelativeTime from './RelativeTime'
import type {Meta, StoryFn} from '@storybook/react-vite'

const meta: Meta = {
  title: 'Components/RelativeTime',
  component: RelativeTime,
  parameters: {
    layout: 'fullscreen',
    controls: {
      // StoryBook infers from type info of the component which includes CE Lifecycle,
      // SX props, and methods we want to otherwise ignore
      exclude: /^(getFormatted.*|datetime|as|theme|forwardedAs|.*Callback|update)$/g,
    },
  },
}

export const Default: StoryFn = () => <RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={true} />

export const Playground: StoryFn = args => {
  const {date, ...rest} = args
  return <RelativeTime noTitle={true} {...rest} date={new Date(date)} />
}

Playground.args = {
  date: new Date('2020-01-01T00:00:00Z'),
  second: '',
  minute: '',
  hour: '',
  weekday: '',
  day: 'numeric',
  month: 'short',
  year: '',
  timeZoneName: '',
}

Playground.argTypes = {
  hour: {
    type: {
      name: 'enum',
      value: ['', 'numeric', '2-digit'],
    },
    control: {
      type: 'select',
      labels: {
        '': '(None)',
      },
    },
  },
  minute: {
    type: {
      name: 'enum',
      value: ['', 'numeric', '2-digit'],
    },
    control: {
      type: 'select',
      labels: {
        '': '(None)',
      },
    },
  },
  second: {
    type: {
      name: 'enum',
      value: ['', 'numeric', '2-digit'],
    },
    control: {
      type: 'select',
      labels: {
        '': '(None)',
      },
    },
  },
  weekday: {
    type: {
      name: 'enum',
      value: ['', 'short', 'long', 'narrow'],
    },
    control: {
      type: 'select',
      labels: {
        '': '(None)',
      },
    },
  },
  day: {
    type: {
      name: 'enum',
      value: ['', 'numeric', '2-digit'],
    },
    control: {
      type: 'select',
      labels: {
        '': '(None)',
      },
    },
  },
  month: {
    type: {
      name: 'enum',
      value: ['', 'numeric', '2-digit', 'long', 'short', 'narrow'],
    },
    control: {
      type: 'select',
      labels: {
        '': '(None)',
      },
    },
  },
  year: {
    type: {
      name: 'enum',
      value: ['', 'numeric', '2-digit'],
    },
    control: {
      type: 'select',
      labels: {
        '': '(None)',
      },
    },
  },
  timeZoneName: {
    type: {
      name: 'enum',
      value: ['', 'long', 'short', 'longOffset', 'shortOffset', 'longGeneric', 'shortGeneric'],
    },
    control: {
      type: 'select',
      labels: {
        '': '(None)',
      },
    },
  },
  date: {
    control: 'date',
  },
  format: {
    control: 'text',
  },
}

export default meta

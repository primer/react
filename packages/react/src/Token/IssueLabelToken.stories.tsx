import React, {useEffect, useState} from 'react'
import IssueLabelToken from './IssueLabelToken'
import Box from '../Box'
import {action} from '@storybook/addon-actions'
import type {ReactNode} from 'react'
import type {StoryObj} from '@storybook/react'
import type {hexString} from '../utils/isHex'

const variants = [
  'pink',
  'plum',
  'purple',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'pine',
  'green',
  'lime',
  'olive',
  'lemon',
  'yellow',
  'orange',
  'amber',
  'red',
  'coral',
  'gray',
  'brown',
  'auburn',
] as const

type Variants = typeof variants
type Variant = Variants[number]

export default {
  title: 'Components/IssueLabelToken',
  component: IssueLabelToken,
  args: {
    text: 'Token',
    variant: 'blue',
  },
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: [...variants, undefined],
    },
  },
}

export const Default: StoryObj = ({variant, text, ...args}: {variant: Variant; text: string}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <IssueLabelToken {...args} text={text} variant={variant} />
    </Box>
  )
}
Default.args = {
  variant: variants[0],
  text: 'Issue Label',
}

const getRandomLabels = (amount: number, asVariant = true, args: {interactive?: boolean}): React.ReactNode[] => {
  const labels: {
    variant: Variant
    hex: hexString
    text: string
    interactive?: boolean
  }[] = [
    {
      variant: 'red',
      hex: '#ff1212',
      text: '🐛 bug',
    },
    {
      variant: 'coral',
      hex: '#ff8b31',
      text: 'deep dive 🐙',
    },
    {
      variant: 'orange',
      hex: '#5a5939',
      text: 'figma',
    },
    {
      variant: 'amber',
      hex: '#ffa411',
      text: '🔥 hot',
    },
    {
      variant: 'yellow',
      hex: '#ff8600',
      text: 'question',
    },
    {
      variant: 'brown',
      hex: '#fff100',
      text: 'boring',
    },
    {
      variant: 'auburn',
      hex: '#c0fa00',
      text: 'sustainable',
    },
    {
      variant: 'blue',
      hex: '#00faf6',
      text: 'new',
    },
    {
      variant: 'purple',
      hex: '#003ba8',
      text: 'info needed',
    },
    {
      variant: 'gray',
      hex: '#000000',
      text: 'wontfix',
    },
    {
      variant: 'olive',
      hex: '#699909',
      text: '🫒 lunch',
    },
    {
      variant: 'cyan',
      hex: '#00fac2',
      text: '📥 Inbox',
    },
    {
      variant: 'pine',
      hex: '#518c5c',
      text: 'documentation',
    },
    {
      variant: 'teal',
      hex: '#37ff00',
      text: '✅ Done',
    },
    {
      variant: 'green',
      hex: '#aaf88a',
      text: 'enhancement',
    },
    {
      variant: 'lemon',
      hex: '#fff100',
      text: 'squeeze 🍋',
    },
    {
      variant: 'lime',
      hex: '#26ff00',
      text: 'lame 🍈',
    },
    {
      variant: 'pink',
      hex: '#fa00ce',
      text: 'unicorn',
    },
    {
      variant: 'plum',
      hex: '#2f00ff',
      text: 'beautify',
    },
    {
      variant: 'indigo',
      hex: '#c100ff',
      text: 'mysterious',
    },
  ]

  let substract = 0
  const result: ReactNode[] = []
  for (let i = 0; amount > i; i++) {
    if (i - substract > labels.length - 1) {
      substract += labels.length
    }
    const {variant, hex, text} = labels[i - substract]
    result.push(
      (
        <IssueLabelToken
          key={i}
          variant={asVariant ? variant : undefined}
          fillColor={!asVariant ? hex : undefined}
          text={text}
          onClick={args.interactive ? () => action('label clicked') : undefined}
        />
      ) as ReactNode,
    )
  }
  return result
}

export const Playground: StoryObj = ({
  variant,
  numberOfTokens,
  text,
  interactive,
  ...args
}: {
  variant: Variant
  numberOfTokens: number
  text: string
  interactive: boolean
}) => {
  const [tokens, setTokens] = useState<React.ReactNode[] | null>(null)

  useEffect(() => {
    setTokens(getRandomLabels(numberOfTokens - 1, true, {interactive}))
  }, [numberOfTokens, interactive])

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <IssueLabelToken {...args} text={text} variant={variant} onClick={interactive ? () => {} : undefined} />
      {tokens}
    </Box>
  )
}
Playground.args = {
  variant: variants[0],
  text: 'New Token',
  numberOfTokens: 3,
  interactive: false,
}

Playground.argTypes = {
  variant: {
    control: {
      type: 'select',
    },
    options: [...variants, undefined],
  },
  numberOfTokens: {control: {type: 'range', min: 1, max: 30, step: 1}},
  interactive: {control: {type: 'boolean'}},
}

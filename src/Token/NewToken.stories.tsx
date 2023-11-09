import React, {useEffect, useState} from 'react'
import NewToken, {TokenVariants} from './NewToken'
import Box from '../Box'
import {TokenSizeKeys} from './TokenBase'
import {action} from '@storybook/addon-actions'
import {hexString} from '../utils/isHex'

const variants: TokenVariants[] = [
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
]

const getRandomLabels = (amount: number, size: TokenSizeKeys, asVariant = true): React.ReactNode[] => {
  const labels: {
    variant: TokenVariants
    hex: hexString
    text: string
  }[] = [
    {
      variant: 'coral',
      hex: '#ff8b31',
      text: 'deep dive 🐙',
    },
    {
      variant: 'red',
      hex: '#ff1212',
      text: '🐛 bug',
    },
    {
      variant: 'amber',
      hex: '#ffa411',
      text: '🔥 hot',
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
      variant: 'yellow',
      hex: '#ff8600',
      text: 'question',
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
      variant: 'orange',
      hex: '#5a5939',
      text: 'figma',
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
  const result = []
  for (let i = 0; amount > i; i++) {
    if (i - substract > labels.length - 1) {
      substract += labels.length
    }
    const {variant, hex, text} = labels[i - substract]
    result.push(
      <NewToken
        key={i}
        size={size}
        variant={asVariant ? variant : undefined}
        fillColor={!asVariant ? hex : undefined}
        text={text}
      />,
    )
  }
  return result
}

export default {
  title: 'Components/NewToken',
  component: NewToken,
  args: {
    text: 'Token',
    size: 'medium',
    variant: 'blue',
    numberOfTokens: 3,
  },
  argTypes: {
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    variant: {
      control: {
        type: 'select',
      },
      options: [...variants, undefined],
    },
    numberOfTokens: {control: {type: 'range', min: 1, max: 30, step: 1}},
  },
}

export const Default = ({
  variant,
  numberOfTokens,
  text,
  size,
  ...args
}: {
  variant: TokenVariants
  numberOfTokens: number
  size: TokenSizeKeys
  text: string
}) => {
  const [tokens, setTokens] = useState<React.ReactNode[] | null>(null)

  useEffect(() => {
    setTokens(getRandomLabels(numberOfTokens - 1, size))
  }, [numberOfTokens, size])

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
      <NewToken {...args} size={size} text={text} variant={variant} />
      {tokens}
    </Box>
  )
}
Default.args = {
  variant: variants[0],
  text: 'New Token',
}

export const Hex = ({
  hex,
  numberOfTokens,
  text,
  size,
  interactive,
  ...args
}: {
  hex: hexString
  numberOfTokens: number
  size: TokenSizeKeys
  interactive: boolean
  text: string
}) => {
  const [tokens, setTokens] = useState<React.ReactNode[] | null>(null)

  useEffect(() => {
    setTokens(getRandomLabels(numberOfTokens - 1, size, false))
  }, [numberOfTokens, size])

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
      <NewToken {...args} size={size} text={text} fillColor={hex} onClick={interactive ? () => {} : undefined} />
      {tokens}
    </Box>
  )
}
Hex.args = {
  hex: '#59B200',
  text: 'New Token',
  variant: undefined,
  numberOfTokens: 1,
  interactive: true,
}
Hex.argTypes = {
  hex: {control: {type: 'color'}},
  variant: {control: {disable: true}},
  interactive: {control: {type: 'boolean'}},
}

export const Sizes = ({text, variant, ...args}: {numberOfTokens: number; variant: TokenVariants; text: string}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <NewToken {...args} size={'small'} text={text} variant={variant} />
      <NewToken {...args} size={'medium'} text={text} variant={variant} />
      <NewToken {...args} size={'large'} text={text} variant={variant} />
      <NewToken {...args} size={'xlarge'} text={text} variant={variant} />
    </Box>
  )
}
Sizes.args = {
  text: 'New Token',
  variant: variants[0],
}
Sizes.argTypes = {
  size: {control: {disable: true}},
  numberOfTokens: {control: {disable: true}},
}

export const OnRemove = ({
  text,
  variant,
  size,
  ...args
}: {
  numberOfTokens: number
  variant: TokenVariants
  size: TokenSizeKeys
  text: string
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <NewToken {...args} size={size} text={text} variant={variant} onRemove={action('remove me')} />
    </Box>
  )
}
OnRemove.args = {
  text: 'New Token',
  variant: variants[0],
}
OnRemove.argTypes = {
  numberOfTokens: {control: {disable: true}},
}

export const InteractiveToken = ({variant, size}: {variant: TokenVariants; size: TokenSizeKeys}) => {
  return (
    <Box
      sx={{
        alignItems: 'start',
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <NewToken
        as="a"
        href="/?path=/story/components-newtoken--interactive-token"
        variant={variant}
        size={size}
        text="Link"
      />
      <NewToken as="button" onClick={action('clicked')} variant={variant} size={size} text="Button" />
      <NewToken
        as="span"
        tabIndex={0}
        onFocus={action('focused')}
        variant={variant}
        size={size}
        text="Focusable Span"
      />
      <NewToken
        as="button"
        onClick={action('clicked')}
        variant={variant}
        text="Removable Button"
        size={size}
        onRemove={action('remove me')}
      />
    </Box>
  )
}

InteractiveToken.args = {
  variant: variants[0],
}
InteractiveToken.argTypes = {
  numberOfTokens: {control: {disable: true}},
  text: {control: {disable: true}},
}

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

const getRandomLabels = (amount: number, size: TokenSizeKeys): React.ReactNode[] => {
  const labels: {
    variant: TokenVariants
    text: string
  }[] = [
    {
      variant: 'red',
      text: '🐛 bug',
    },
    {
      variant: 'amber',
      text: '🔥 hot',
    },
    {
      variant: 'brown',
      text: 'boring',
    },
    {
      variant: 'auburn',
      text: 'susainable',
    },
    {
      variant: 'blue',
      text: 'new',
    },
    {
      variant: 'purple',
      text: 'info needed',
    },
    {
      variant: 'gray',
      text: 'wontfix',
    },
    {
      variant: 'olive',
      text: '🫒 lunch',
    },
    {
      variant: 'cyan',
      text: '📥 Inbox',
    },
    {
      variant: 'yellow',
      text: 'question',
    },
    {
      variant: 'pine',
      text: 'documentation',
    },
    {
      variant: 'teal',
      text: '✅ Done',
    },
    {
      variant: 'green',
      text: 'enhancement',
    },
    {
      variant: 'orange',
      text: 'figma',
    },
    {
      variant: 'lemon',
      text: 'squeeze 🍋',
    },
    {
      variant: 'lime',
      text: 'lame 🍈',
    },
    {
      variant: 'pink',
      text: 'unicorn',
    },
    {
      variant: 'plum',
      text: 'beautify',
    },
    {
      variant: 'coral',
      text: 'deep dive 🐙',
    },
    {
      variant: 'indigo',
      text: 'mysterious',
    },
  ]

  let substract = 0
  const result = []
  for (let i = 0; amount > i; i++) {
    if (i - substract > labels.length - 1) {
      substract += labels.length
    }
    const {variant, text} = labels[i - substract]
    result.push(<NewToken key={i} size={size} variant={variant} text={text} />)
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
  return <NewToken {...args} size={size} text={text} fillColor={hex} onClick={interactive ? () => {} : undefined} />
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
  numberOfTokens: {control: {disable: true}},
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

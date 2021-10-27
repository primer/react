import React, {useCallback, useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'
import TextInputWithTokens from '../TextInputWithTokens'
import IssueLabelToken from '../Token/IssueLabelToken'

export default {
  title: 'Forms/Text Input with Tokens',
  component: TextInputWithTokens,
  decorators: [
    Story => {
      const [lastKey, setLastKey] = useState('none')
      const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        setLastKey(event.key)
      }, [])

      return (
        <ThemeProvider>
          <BaseStyles>
            <Box onKeyDownCapture={reportKey}>
              <Box position="absolute" right={5} top={2}>
                Last key pressed: {lastKey}
              </Box>
              <Box paddingTop={5}>
                <Story />
              </Box>
            </Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

const mockTokens = [
  {text: 'zero', id: 0},
  {text: 'one', id: 1},
  {text: 'two', id: 2},
  {text: 'three', id: 3},
  {text: 'four', id: 4},
  {text: 'five', id: 5},
  {text: 'six', id: 6},
  {text: 'seven', id: 7},
  {text: 'twenty', id: 20},
  {text: 'twentyone', id: 21}
]

export const Default = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} />
}

export const UsingIssueLabelTokens = () => {
  const [tokens, setTokens] = useState([
    {text: 'enhancement', id: 1, fillColor: '#a2eeef'},
    {text: 'bug', id: 2, fillColor: '#d73a4a'},
    {text: 'good first issue', id: 3, fillColor: '#0cf478'}
  ])
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return <TextInputWithTokens tokenComponent={IssueLabelToken} tokens={tokens} onTokenRemove={onTokenRemove} />
}

export const TokenSizeVariants = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 2))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box display="flex" flexDirection="column" sx={{gap: '1em'}}>
      <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} size="small" />
      <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} size="medium" />
      <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} size="large" />
      <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} size="extralarge" />
    </Box>
  )
}

export const MaxHeight = () => {
  const [tokens, setTokens] = useState(mockTokens)
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box maxWidth="300px">
      <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} maxHeight="100px" />
    </Box>
  )
}

MaxHeight.storyName = 'maxHeight 200px'

export const TokenWrappingPrevented = () => {
  const [tokens, setTokens] = useState(mockTokens)
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box maxWidth="500px">
      <TextInputWithTokens preventTokenWrapping block tokens={tokens} onTokenRemove={onTokenRemove} />
    </Box>
  )
}

export const TokenRemoveButtonsHidden = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 2))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return <TextInputWithTokens hideTokenRemoveButtons tokens={tokens} onTokenRemove={onTokenRemove} />
}

export const WithVisibleTokenCount = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 5))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} visibleTokenCount={2} />
}

export const Unstyled = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 2))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <TextInputWithTokens
      tokens={tokens}
      onTokenRemove={onTokenRemove}
      // TODO: come up with a nicer way to unstyle an input component
      sx={{
        border: '0',
        padding: '0',
        boxShadow: 'none',
        ':focus-within': {
          border: '0',
          boxShadow: 'none'
        }
      }}
    />
  )
}

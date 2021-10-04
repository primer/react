import React, { useCallback, useState } from 'react'
import {Meta} from '@storybook/react'

import { BaseStyles, Box, ThemeProvider } from '..'
import TextInputWithTokens from '../TextInputWithTokens';
import TokenLabel from '../Token/TokenLabel';

export default {
  title: 'Prototyping/Text Input with Tokens',

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
  { text: 'zero', id: 0 },
  { text: 'one', id: 1 },
];

export const Default = () => {
    const [tokens, setTokens] = useState(mockTokens)
    const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
        setTokens(tokens.filter(token => token.id !== tokenId))
    };

    return (
      <TextInputTokens
          tokens={tokens}
          onTokenRemove={onTokenRemove}
      />
    )
};

export const TokenSizeVariants = () => {
  const [tokens, setTokens] = useState(mockTokens)
  const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
      setTokens(tokens.filter(token => token.id !== tokenId))
  };

  return (
    <Box display="flex" flexDirection="column" sx={{'gap': '1em'}}>
      <TextInputTokens
          tokens={tokens}
          onTokenRemove={onTokenRemove}
          tokenSizeVariant="sm"
      />
      <TextInputTokens
          tokens={tokens}
          onTokenRemove={onTokenRemove}
          tokenSizeVariant="md"
      />
      <TextInputTokens
          tokens={tokens}
          onTokenRemove={onTokenRemove}
          tokenSizeVariant="lg"
      />
      <TextInputTokens
          tokens={tokens}
          onTokenRemove={onTokenRemove}
          tokenSizeVariant="xl"
      />
    </Box>
  )
};

export const UsingIssueLabelTokens = () => {
  const [tokens, setTokens] = useState(mockTokens)
  const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
      setTokens(tokens.filter(token => token.id !== tokenId))
  };

  return (
    <TextInputTokens
        tokenComponent={TokenLabel}
        tokens={[
          { text: 'enhancement', id: 1, fillColor: '#a2eeef' },
          { text: 'bug', id: 2, fillColor: '#d73a4a' },
          { text: 'good first issue', id: 3, fillColor: '#0cf478' }
        ]}
        onTokenRemove={onTokenRemove}
    />
  )
};


export const Unstyled = () => {
  const [tokens, setTokens] = useState(mockTokens)
  const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
      setTokens(tokens.filter(token => token.id !== tokenId))
  };

  return (
    <TextInputTokens
        tokens={tokens}
        onTokenRemove={onTokenRemove}
        onChange={(e) => {
          console.log(e)
        }}
        // TODO: come up with a nicer way to unstyle an input component
        sx={{
          'border': '0',
          'padding': '0',
          'boxShadow': 'none',
          ':focus-within': {
            'border': '0',
            'boxShadow': 'none',
          }
        }}
    />
  )
};

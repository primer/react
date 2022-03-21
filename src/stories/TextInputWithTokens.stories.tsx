import React, {useCallback, useState} from 'react'
import {Meta} from '@storybook/react'
import {CheckIcon, NumberIcon} from '@primer/octicons-react'

import {BaseStyles, Box, FormControl, ThemeProvider} from '..'
import TextInputWithTokens, {TextInputWithTokensProps} from '../TextInputWithTokens'
import IssueLabelToken from '../Token/IssueLabelToken'

const excludedControls = ['tokens', 'onTokenRemove', 'tokenComponent']

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
  ],
  argTypes: {
    maxHeight: {
      defaultValue: undefined,
      control: {
        type: 'text'
      }
    },
    preventTokenWrapping: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    loading: {
      name: 'loading',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    loaderPosition: {
      name: 'loaderPosition',
      defaultValue: 'auto',
      options: ['auto', 'leading', 'trailing'],
      control: {
        type: 'radio'
      }
    },
    size: {
      name: 'size (token size)',
      defaultValue: 'extralarge',
      options: ['small', 'medium', 'large', 'extralarge'],
      control: {
        type: 'radio'
      }
    },
    hideTokenRemoveButtons: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    visibleTokenCount: {
      defaultValue: undefined,
      control: {
        type: 'number'
      }
    },
    validationStatus: {
      options: ['warning', 'error', 'success', undefined],
      control: {type: 'radio'}
    }
  },
  parameters: {controls: {exclude: excludedControls}}
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

export const Default = (args: TextInputWithTokensProps) => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return <TextInputWithTokens {...args} tokens={tokens} onTokenRemove={onTokenRemove} />
}

Default.parameters = {controls: {exclude: [excludedControls, 'maxHeight']}}

export const WithLeadingVisual = (args: TextInputWithTokensProps) => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return <TextInputWithTokens {...args} leadingVisual={NumberIcon} tokens={tokens} onTokenRemove={onTokenRemove} />
}

WithLeadingVisual.parameters = {controls: {exclude: [excludedControls, 'maxHeight']}}

export const WithTrailingVisual = (args: TextInputWithTokensProps) => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return <TextInputWithTokens {...args} trailingVisual={CheckIcon} tokens={tokens} onTokenRemove={onTokenRemove} />
}

WithTrailingVisual.parameters = {controls: {exclude: [excludedControls, 'maxHeight']}}

export const WithLoadingIndicator = (args: TextInputWithTokensProps) => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const [loading, setLoading] = useState(true)
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }
  const toggleLoadingState = () => {
    setLoading(!loading)
  }

  return (
    <form>
      <Box mb={5} display="flex" justifyContent="flex-end">
        <button type="button" onClick={toggleLoadingState}>
          Toggle loading state {loading ? 'off' : 'on'}
        </button>
      </Box>

      <Box display="grid" sx={{gap: 3}}>
        <FormControl>
          <FormControl.Label>No visual</FormControl.Label>
          <TextInputWithTokens {...args} tokens={tokens} onTokenRemove={onTokenRemove} loading={loading} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Leading visual</FormControl.Label>
          <TextInputWithTokens
            {...args}
            tokens={tokens}
            onTokenRemove={onTokenRemove}
            loading={loading}
            leadingVisual={NumberIcon}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Both visuals</FormControl.Label>
          <TextInputWithTokens
            {...args}
            tokens={tokens}
            onTokenRemove={onTokenRemove}
            loading={loading}
            leadingVisual={NumberIcon}
            trailingVisual={CheckIcon}
          />
        </FormControl>
      </Box>
    </form>
  )
}

WithLoadingIndicator.parameters = {controls: {exclude: [excludedControls, 'maxHeight', 'loading']}}

export const UsingIssueLabelTokens = (args: TextInputWithTokensProps) => {
  const [tokens, setTokens] = useState([
    {text: 'enhancement', id: 1, fillColor: '#a2eeef'},
    {text: 'bug', id: 2, fillColor: '#d73a4a'},
    {text: 'good first issue', id: 3, fillColor: '#0cf478'}
  ])
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <TextInputWithTokens {...args} tokenComponent={IssueLabelToken} tokens={tokens} onTokenRemove={onTokenRemove} />
  )
}

UsingIssueLabelTokens.parameters = {controls: {exclude: [excludedControls, 'maxHeight']}}

export const MaxHeight = (args: TextInputWithTokensProps) => {
  const [tokens, setTokens] = useState(mockTokens)
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box maxWidth="300px">
      <TextInputWithTokens {...args} tokens={tokens} onTokenRemove={onTokenRemove} maxHeight="100px" />
    </Box>
  )
}

MaxHeight.storyName = 'maxHeight 200px'

export const Unstyled = (args: TextInputWithTokensProps) => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 2))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <TextInputWithTokens
      {...args}
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

Unstyled.parameters = {controls: {exclude: [excludedControls, 'maxHeight', 'validationStatus']}}

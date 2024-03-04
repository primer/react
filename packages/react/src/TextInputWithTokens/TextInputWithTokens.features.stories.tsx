import React, {useState} from 'react'
import {CheckIcon, NumberIcon} from '@primer/octicons-react'
import {Box, FormControl} from '..'
import type {TextInputWithTokensProps} from '../TextInputWithTokens'
import TextInputWithTokens from '../TextInputWithTokens'
import IssueLabelToken from '../Token/IssueLabelToken'
import type {FormControlArgs} from '../utils/story-helpers'
import {formControlArgTypes, textInputExcludedControlKeys} from '../utils/story-helpers'

const excludedControls = ['tokens', 'onTokenRemove', 'tokenComponent', ...textInputExcludedControlKeys]

export default {
  title: 'Components/TextInputWithTokens/Features',
}

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
  {text: 'twentyone', id: 21},
]

export const WithLeadingVisual = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInputWithTokens leadingVisual={NumberIcon} tokens={tokens} onTokenRemove={onTokenRemove} />
    </FormControl>
  )
}

export const WithTrailingVisual = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInputWithTokens trailingVisual={CheckIcon} tokens={tokens} onTokenRemove={onTokenRemove} />
    </FormControl>
  )
}

export const WithLoadingIndicator = (args: FormControlArgs<TextInputWithTokensProps>) => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box display="grid" sx={{gap: 3}} as="form">
      <FormControl>
        <FormControl.Label>No visual</FormControl.Label>
        <TextInputWithTokens {...args} tokens={tokens} onTokenRemove={onTokenRemove} />
      </FormControl>

      <FormControl>
        <FormControl.Label>Leading visual</FormControl.Label>
        <TextInputWithTokens {...args} tokens={tokens} onTokenRemove={onTokenRemove} leadingVisual={NumberIcon} />
      </FormControl>

      <FormControl>
        <FormControl.Label>Both visuals</FormControl.Label>
        <TextInputWithTokens
          {...args}
          tokens={tokens}
          onTokenRemove={onTokenRemove}
          leadingVisual={NumberIcon}
          trailingVisual={CheckIcon}
        />
      </FormControl>
    </Box>
  )
}

WithLoadingIndicator.args = {
  loading: true,
}
WithLoadingIndicator.parameters = {
  controls: {
    exclude: [...excludedControls, 'loaderPosition', ...Object.keys(formControlArgTypes), 'children'],
  },
}

export const UsingIssueLabelTokens = () => {
  const [tokens, setTokens] = useState([
    {text: 'enhancement', id: 1, fillColor: '#a2eeef'},
    {text: 'bug', id: 2, fillColor: '#d73a4a'},
    {text: 'good first issue', id: 3, fillColor: '#0cf478'},
  ])
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box as="form">
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInputWithTokens tokenComponent={IssueLabelToken} tokens={tokens} onTokenRemove={onTokenRemove} />
      </FormControl>
    </Box>
  )
}

export const Unstyled = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 2))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box as="form">
      <FormControl>
        <FormControl.Label visuallyHidden>Default label</FormControl.Label>
        <TextInputWithTokens
          tokens={tokens}
          onTokenRemove={onTokenRemove}
          sx={{
            border: '0',
            padding: '0',
            boxShadow: 'none',
            ':focus-within': {
              border: '0',
              boxShadow: 'none',
            },
          }}
        />
      </FormControl>
    </Box>
  )
}

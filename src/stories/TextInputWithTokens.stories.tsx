import React, {useCallback, useState} from 'react'
import {Meta} from '@storybook/react'
import {CheckIcon, NumberIcon} from '@primer/octicons-react'

import {BaseStyles, Box, FormControl, ThemeProvider} from '..'
import TextInputWithTokens, {TextInputWithTokensProps} from '../TextInputWithTokens'
import IssueLabelToken from '../Token/IssueLabelToken'
import {
  FormControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
  textInputExcludedControlKeys,
  textInputWithTokensArgTypes
} from '../utils/story-helpers'

const excludedControls = ['tokens', 'onTokenRemove', 'tokenComponent', ...textInputExcludedControlKeys]

export default {
  title: 'Forms/Form Controls/Text Input with Tokens',
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
    ...getTextInputArgTypes('TextInput props'),
    ...textInputWithTokensArgTypes,
    ...formControlArgTypes
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

export const Default = (args: FormControlArgs<TextInputWithTokensProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <FormControl {...parentArgs}>
      <FormControl.Label {...labelArgs} />
      <TextInputWithTokens {...args} tokens={tokens} onTokenRemove={onTokenRemove} />
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      {validationArgs.children && validationArgs.variant && (
        <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
      )}
    </FormControl>
  )
}

export const WithLeadingVisual = (args: FormControlArgs<TextInputWithTokensProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <FormControl {...parentArgs}>
      <FormControl.Label {...labelArgs} />
      <TextInputWithTokens {...args} leadingVisual={NumberIcon} tokens={tokens} onTokenRemove={onTokenRemove} />
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      {validationArgs.children && validationArgs.variant && (
        <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
      )}
    </FormControl>
  )
}

export const WithTrailingVisual = (args: FormControlArgs<TextInputWithTokensProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInputWithTokens {...args} trailingVisual={CheckIcon} tokens={tokens} onTokenRemove={onTokenRemove} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
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
  loading: true
}
WithLoadingIndicator.parameters = {
  controls: {
    exclude: [...excludedControls, 'loaderPosition', ...Object.keys(formControlArgTypes), 'children']
  }
}

export const UsingIssueLabelTokens = (args: FormControlArgs<TextInputWithTokensProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [tokens, setTokens] = useState([
    {text: 'enhancement', id: 1, fillColor: '#a2eeef'},
    {text: 'bug', id: 2, fillColor: '#d73a4a'},
    {text: 'good first issue', id: 3, fillColor: '#0cf478'}
  ])
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInputWithTokens {...args} tokenComponent={IssueLabelToken} tokens={tokens} onTokenRemove={onTokenRemove} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

export const Unstyled = (args: FormControlArgs<TextInputWithTokensProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 2))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
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
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

Unstyled.parameters = {
  controls: {exclude: [...excludedControls, 'maxHeight', 'validationStatus']}
}

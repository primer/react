import type React from 'react'
import {useCallback, useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {FormControl} from '..'
import type {TextInputWithTokensProps} from '../TextInputWithTokens'
import TextInputWithTokens from '../TextInputWithTokens'
import type {FormControlArgs} from '../utils/story-helpers'
import {
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
  textInputExcludedControlKeys,
  textInputWithTokensArgTypes,
} from '../utils/story-helpers'
import classes from './TextInputWithTokens.stories.module.css'

const excludedControls = ['tokens', 'onTokenRemove', 'tokenComponent', ...textInputExcludedControlKeys]

export default {
  title: 'Components/TextInputWithTokens',
  component: TextInputWithTokens,
  parameters: {controls: {exclude: excludedControls}},
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
  {text: 'twentyone', id: 21},
]

export const Playground = (args: FormControlArgs<TextInputWithTokensProps>) => {
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

Playground.args = {
  ...formControlArgs,
}
Playground.argTypes = {
  ...getTextInputArgTypes('TextInput props'),
  ...textInputWithTokensArgTypes,
  ...formControlArgTypes,
}
Playground.decorators = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Story: any) => {
    const [lastKey, setLastKey] = useState('none')
    const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
      setLastKey(event.key)
    }, [])

    return (
      <div onKeyDownCapture={reportKey}>
        <div className={classes.LastKeyIndicator}>Last key pressed: {lastKey}</div>
        <div className={classes.StoryContainer}>
          <Story />
        </div>
      </div>
    )
  },
]

export const Default = () => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 3))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} />
    </FormControl>
  )
}

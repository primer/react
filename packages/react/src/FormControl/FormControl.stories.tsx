import {useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {Checkbox, FormControl, TextInput} from '..'
import {TextInputWithTokens} from '../deprecated'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'

export default {
  title: 'Components/FormControl',
  argTypes: {
    disabled: {
      type: 'boolean',
    },
    required: {
      type: 'boolean',
    },
    label: {
      type: 'string',
    },
    caption: {
      type: 'string',
    },
    variant: {
      control: {
        type: 'radio',
      },
      options: ['error', 'success', 'warning'],
    },
    variantMessage: {type: 'string'},
  },
} as Meta

interface ArgTypes {
  disabled: boolean
  required: boolean
  label: string
  caption: string
  variant: FormValidationStatus
  variantMessage: string
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

export const Default = () => (
  <FormControl required={true}>
    <FormControl.Label>Form Input Label</FormControl.Label>
    <FormControl.Caption>This is a caption</FormControl.Caption>
    <Checkbox />
  </FormControl>
)

export const Playground = ({
  label = 'Input',
  caption = 'This is the caption',
  required = false,
  disabled = false,
  variant = 'success',
  variantMessage = 'Success!',
}: ArgTypes) => {
  const [tokens, setTokens] = useState([...mockTokens].slice(0, 5))
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
  }

  return (
    <form>
      <FormControl disabled={disabled} required={required}>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />

        <FormControl.Label>{label}</FormControl.Label>
        {caption && <FormControl.Caption>{caption}</FormControl.Caption>}
        <Checkbox />

        {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          variantMessage !== '' && variant && (
            <FormControl.Validation variant={variant}>{variantMessage}</FormControl.Validation>
          )
        }
      </FormControl>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} />
      </FormControl>
    </form>
  )
}

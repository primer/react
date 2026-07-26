import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import React from 'react'
import {FormControl} from '../FormControl'
import {Autocomplete, type AutocompleteContentProps, type AutocompleteRootProps} from './Autocomplete'

interface AutocompleteStoryArgs
  extends Pick<AutocompleteRootProps<string>, 'autoHighlight' | 'mode' | 'openOnInputClick'>,
    Pick<AutocompleteContentProps, 'align' | 'side' | 'sideOffset'> {}

const meta = {
  title: 'React Tailwind/Components/Autocomplete',
  decorators: [
    Story => {
      const [lastKey, setLastKey] = React.useState('none')

      return (
        <div onKeyDownCapture={event => setLastKey(event.key)}>
          <p className="absolute top-2 right-8 m-0">Last key pressed: {lastKey}</p>
          <div className="pt-8">
            <Story />
          </div>
        </div>
      )
    },
  ],
  args: {
    align: 'start',
    autoHighlight: false,
    mode: 'both',
    openOnInputClick: false,
    side: 'bottom',
    sideOffset: 4,
  },
  argTypes: {
    align: {control: 'select', options: ['start', 'center', 'end']},
    autoHighlight: {control: 'select', options: [false, true, 'always']},
    mode: {control: 'select', options: ['list', 'both', 'inline', 'none']},
    openOnInputClick: {control: 'boolean'},
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    },
    sideOffset: {control: {type: 'number', min: 0}},
  },
} satisfies Meta<AutocompleteStoryArgs>

export default meta

type Story = StoryObj<AutocompleteStoryArgs>
const fruits = ['Apple', 'Banana', 'Orange']

export const Default: Story = {
  render: () => (
    <form className="p-4" onSubmit={event => event.preventDefault()}>
      <FormControl>
        <FormControl.Label>Label</FormControl.Label>
        <Autocomplete items={fruits}>
          <Autocomplete.Input className="w-[182px]" />
          <Autocomplete.Content>
            <Autocomplete.List>
              {(fruit: string) => (
                <Autocomplete.Item key={fruit} value={fruit}>
                  {fruit}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Content>
        </Autocomplete>
      </FormControl>
    </form>
  ),
}
export const Playground: Story = {
  render: args => (
    <form className="p-4" onSubmit={event => event.preventDefault()}>
      <FormControl>
        <FormControl.Label>Label</FormControl.Label>
        <Autocomplete
          items={fruits}
          autoHighlight={args.autoHighlight}
          mode={args.mode}
          openOnInputClick={args.openOnInputClick}
        >
          <Autocomplete.Input className="w-[182px]" />
          <Autocomplete.Content align={args.align} side={args.side} sideOffset={args.sideOffset}>
            <Autocomplete.List>
              {(fruit: string) => (
                <Autocomplete.Item key={fruit} value={fruit}>
                  {fruit}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Content>
        </Autocomplete>
      </FormControl>
    </form>
  ),
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole<HTMLInputElement>('combobox', {
      name: 'Label',
    })
    await userEvent.click(input)
    await userEvent.type(input, 'App')
    await userEvent.click(await within(document.body).findByRole('option', {name: 'Apple'}))
    await expect(input).toHaveValue('Apple')
    input.value = ''
  },
}

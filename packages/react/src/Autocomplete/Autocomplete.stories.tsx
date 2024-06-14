import React, {useCallback, useState} from 'react'
import type {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'

import Autocomplete from './Autocomplete'
import FormControl from '../FormControl'

import type {ComponentProps} from '../utils/types'
import type {FormControlArgs} from '../utils/story-helpers'
import {
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
} from '../utils/story-helpers'
import {within, userEvent, expect} from '@storybook/test'

type AutocompleteOverlayArgs = ComponentProps<typeof Autocomplete.Overlay>
type AutocompleteMenuArgs = ComponentProps<typeof Autocomplete.Menu>
type AutocompleteArgs = AutocompleteOverlayArgs & AutocompleteMenuArgs

const excludedControlKeys = ['id', 'sx']

const getArgsByChildComponent = ({
  // Autocomplete.Menu
  emptyStateText,
  menuLoading,
  selectionVariant,

  // Autocomplete.Input
  openOnFocus,

  // Autocomplete.Overlay
  anchorSide,
  height,
  overlayMaxHeight,
  width,

  // TextInput
  block,
  contrast,
  disabled,
  inputSize,
  loading,
  loaderPosition,
  placeholder,
  validationStatus,

  // TextInputWithTokens
  hideTokenRemoveButtons,
  maxHeight: textInputWithTokensMaxHeight,
  preventTokenWrapping,
  size: tokenSize,
  visibleTokenCount,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const textInputArgs = {
    block,
    contrast,
    disabled,
    inputSize,
    loading,
    loaderPosition,
    placeholder,
    validationStatus,
  }
  return {
    menuArgs: {emptyStateText, loading: menuLoading, selectionVariant},
    inputArgs: {openOnFocus},
    overlayArgs: {anchorSide, height, maxHeight: overlayMaxHeight, width},
    textInputArgs,
    textInputWithTokensArgs: {
      hideTokenRemoveButtons,
      maxHeight: textInputWithTokensMaxHeight,
      preventTokenWrapping,
      size: tokenSize,
      visibleTokenCount,
      ...textInputArgs,
      // ...formControlArgTypes
    },
  }
}

type ItemMetadata = {
  fillColor: React.CSSProperties['backgroundColor']
}

type Datum = {
  id: string
  text: string
  selected?: boolean
  metadata?: ItemMetadata
}

const items: Datum[] = [
  {text: 'css', id: '0'},
  {text: 'css-in-js', id: '1'},
  {text: 'styled-system', id: '2'},
  {text: 'javascript', id: '3'},
  {text: 'typescript', id: '4'},
  {text: 'react', id: '5'},
  {text: 'design-systems', id: '6'},
]

const autocompleteStoryMeta: Meta = {
  title: 'Components/Autocomplete',
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
    },
  ],
  parameters: {controls: {exclude: excludedControlKeys}},
  args: {
    ...formControlArgs,
    emptyStateText: 'No selectable options',
    menuLoading: false,
    selectionVariant: 'single',
    openOnFocus: true,
    anchorSide: undefined,
    height: 'auto',
    overlayMaxHeight: undefined,
    width: 'auto',
  },
  argTypes: {
    // Autocomplete.Menu
    emptyStateText: {
      control: {type: 'text'},
      table: {
        category: 'Autocomplete.Menu',
      },
    },
    menuLoading: {
      name: 'loading',
      control: {type: 'boolean'},
      table: {
        category: 'Autocomplete.Menu',
      },
    },
    selectionVariant: {
      control: {
        type: 'radio',
      },
      options: ['single', 'multiple'],
      table: {
        category: 'Autocomplete.Menu',
      },
    },

    // Autocomplete.Input
    openOnFocus: {
      control: {
        type: 'boolean',
      },
      table: {
        category: 'Autocomplete.Input',
      },
    },

    // Autocomplete.Overlay
    anchorSide: {
      control: {
        type: 'select',
      },
      options: [
        'inside-top',
        'inside-bottom',
        'inside-left',
        'inside-right',
        'inside-center',
        'outside-top',
        'outside-bottom',
        'outside-left',
        'outside-right',
      ],
      table: {
        category: 'Autocomplete.Overlay',
      },
    },
    height: {
      control: {
        type: 'select',
      },
      options: ['auto', 'initial', 'small', 'medium', 'large', 'xlarge', 'xsmall'],
      table: {
        category: 'Autocomplete.Overlay',
      },
    },
    // needs a key other than 'maxHeight' because TextInputWithTokens also has a maxHeight prop
    overlayMaxHeight: {
      name: 'maxHeight',
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large', 'xlarge', 'xsmall', undefined],
      table: {
        category: 'Autocomplete.Overlay',
      },
    },
    width: {
      control: {
        type: 'select',
      },
      options: ['auto', 'small', 'medium', 'large', 'xlarge', 'xxlarge'],
      table: {
        category: 'Autocomplete.Overlay',
      },
    },
    ...getTextInputArgTypes('TextInput props'),
    ...formControlArgTypes,
  },
} as Meta

export const Default = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, inputArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const isMultiselect = menuArgs.selectionVariant === 'multiple'
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string>>([])
  const onSelectedChange = (newlySelectedItems: Datum | Datum[]) => {
    if (!Array.isArray(newlySelectedItems)) {
      return
    }

    setSelectedItemIds(newlySelectedItems.map(item => item.id))
  }

  const autocompleteInput = {...inputArgs, ...textInputArgs}
  const formValidationId = 'validation-field'
  return (
    <Box as="form" sx={{p: 3}} onSubmit={event => event.preventDefault()}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input
            aria-describedby={formValidationId}
            {...autocompleteInput}
            size={textInputArgs.inputSize}
            data-testid="autocompleteInput"
          />
          <Autocomplete.Overlay {...overlayArgs}>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={isMultiselect ? selectedItemIds : []}
              onSelectedChange={isMultiselect ? onSelectedChange : undefined}
              aria-labelledby="autocompleteLabel"
              {...menuArgs}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation id={formValidationId} {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

Default.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const inputBox = canvas.getByTestId('autocompleteInput')
  await userEvent.click(inputBox)
  const firstAutoCompleteOption = canvas.getByText('css')
  expect(firstAutoCompleteOption).toBeInTheDocument()
  await userEvent.type(firstAutoCompleteOption, '{enter}')
  expect(inputBox).toHaveValue('css')
}

export default autocompleteStoryMeta

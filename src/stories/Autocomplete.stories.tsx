import React, {ChangeEventHandler, RefObject, useCallback, useEffect, useRef, useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, Dialog, ThemeProvider, registerPortalRoot} from '..'
import TextInputTokens from '../TextInputWithTokens'
import Autocomplete from '../Autocomplete/Autocomplete'
import {AnchoredOverlay} from '../AnchoredOverlay'
import FormControl from '../FormControl'
import {Button} from '../Button'
import {ComponentProps} from '../utils/types'
import {
  FormControlArgs,
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
  textInputWithTokensArgTypes,
} from '../utils/story-helpers'
import {within, userEvent} from '@storybook/testing-library'
import {expect} from '@storybook/jest'

type AutocompleteOverlayArgs = ComponentProps<typeof Autocomplete.Overlay>
type AutocompleteMenuArgs = ComponentProps<typeof Autocomplete.Menu>
type AutocompleteArgs = AutocompleteOverlayArgs & AutocompleteMenuArgs

const excludedControlKeys = ['id', 'sx']

const getArgsByChildComponent = ({
  // Autocomplete.Menu
  emptyStateText,
  menuLoading,
  selectionVariant,

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
  id: string | number
  text: string
  selected?: boolean
  metadata?: ItemMetadata
}

const items: Datum[] = [
  {text: 'css', id: 0},
  {text: 'css-in-js', id: 1},
  {text: 'styled-system', id: 2},
  {text: 'javascript', id: 3},
  {text: 'typescript', id: 4},
  {text: 'react', id: 5},
  {text: 'design-systems', id: 6},
]

const mockTokens: Datum[] = [...items].slice(0, 3)

const autocompleteStoryMeta: Meta = {
  title: 'Components/Forms/Autocomplete',
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
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const isMultiselect = menuArgs.selectionVariant === 'multiple'
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>([])
  const onSelectedChange = (newlySelectedItems: Datum | Datum[]) => {
    if (!Array.isArray(newlySelectedItems)) {
      return
    }

    setSelectedItemIds(newlySelectedItems.map(item => item.id))
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} data-testid="autocompleteInput" />
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
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

Default.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const inputBox = await canvas.getByTestId('autocompleteInput')
  await userEvent.click(inputBox)
  const firstAutoCompleteOption = canvas.getByText('css')
  await expect(firstAutoCompleteOption).toBeInTheDocument()
  await userEvent.type(firstAutoCompleteOption, '{enter}')
  await expect(inputBox).toHaveValue('css')
}

export const WithTokenInput = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, overlayArgs, textInputWithTokensArgs} = getArgsByChildComponent(args)
  const [tokens, setTokens] = useState<Datum[]>([]) // [items[0], items[2]]
  const selectedTokenIds = tokens.map(token => token.id)
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>(selectedTokenIds)
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
    setSelectedItemIds(selectedItemIds.filter(id => id !== tokenId))
  }
  const onSelectedChange = (newlySelectedItems: Datum | Datum[]) => {
    if (!Array.isArray(newlySelectedItems)) {
      return
    }

    setSelectedItemIds(newlySelectedItems.map(item => item.id))

    if (newlySelectedItems.length < selectedItemIds.length) {
      const newlySelectedItemIds = newlySelectedItems.map(({id}) => id)
      const removedItemIds = selectedTokenIds.filter(id => !newlySelectedItemIds.includes(id))

      for (const removedItemId of removedItemIds) {
        onTokenRemove(removedItemId)
      }

      return
    }

    setTokens(newlySelectedItems.map(({id, text}) => ({id, text})))
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input
            as={TextInputTokens}
            tokens={tokens}
            onTokenRemove={onTokenRemove}
            {...textInputWithTokensArgs}
          />
          <Autocomplete.Overlay {...menuArgs}>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={selectedItemIds}
              onSelectedChange={onSelectedChange}
              selectionVariant="multiple"
              aria-labelledby="autocompleteLabel"
              {...overlayArgs}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
WithTokenInput.argTypes = {
  ...autocompleteStoryMeta.argTypes,
  ...getTextInputArgTypes('TextInput props'),
  ...textInputWithTokensArgTypes,
}
WithTokenInput.args = {
  block: true,
  selectionVariant: 'multiple',
}
WithTokenInput.parameters = {
  controls: {
    exclude: [...excludedControlKeys, 'size'],
  },
}

export const AddNewItem = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [localItemsState, setLocalItemsState] = useState<Datum[]>(items)
  const [filterVal, setFilterVal] = useState<string>('')
  const [tokens, setTokens] = useState<Datum[]>(mockTokens)
  const selectedTokenIds = tokens.map(token => token.id)
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>(selectedTokenIds)
  const onTokenRemove: (tokenId: string | number) => void = tokenId => {
    setTokens(tokens.filter(token => token.id !== tokenId))
    setSelectedItemIds(selectedItemIds.filter(id => id !== tokenId))
  }
  const onSelectedChange = (newlySelectedItems: Datum | Datum[]) => {
    if (!Array.isArray(newlySelectedItems)) {
      return
    }

    setSelectedItemIds(newlySelectedItems.map(item => item.id))

    if (newlySelectedItems.length < selectedItemIds.length) {
      const newlySelectedItemIds = newlySelectedItems.map(({id}) => id)
      const removedItemIds = selectedTokenIds.filter(id => !newlySelectedItemIds.includes(id))

      for (const removedItemId of removedItemIds) {
        onTokenRemove(removedItemId)
      }

      return
    }

    setTokens(newlySelectedItems.map(({id, text}) => ({id, text})))
  }

  const onItemSelect: (item: Datum) => void = item => {
    onSelectedChange([...selectedItemIds.map(id => items.find(selectedItem => selectedItem.id === id) as Datum), item])

    if (!localItemsState.some(localItem => localItem.id === item.id)) {
      setLocalItemsState([...localItemsState, item])
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFilterVal(e.currentTarget.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input
            as={TextInputTokens}
            tokens={[]}
            onTokenRemove={onTokenRemove}
            onChange={handleChange}
            {...textInputArgs}
          />
          <Autocomplete.Overlay {...overlayArgs}>
            <Autocomplete.Menu
              addNewItem={
                filterVal && !localItemsState.map(localItem => localItem.text).includes(filterVal)
                  ? {
                      text: `Add '${filterVal}'`,
                      handleAddItem: item => {
                        onItemSelect({
                          ...item,
                          text: filterVal,
                          selected: true,
                        })
                        setFilterVal('')
                      },
                    }
                  : undefined
              }
              items={localItemsState}
              selectedItemIds={selectedItemIds}
              onSelectedChange={onSelectedChange}
              aria-labelledby="autocompleteLabel"
              {...menuArgs}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
AddNewItem.args = {
  block: true,
  selectionVariant: 'multiple',
}
AddNewItem.argTypes = {
  ...autocompleteStoryMeta.argTypes,
  ...getTextInputArgTypes('TextInput props'),
  ...textInputWithTokensArgTypes,
}
AddNewItem.parameters = {
  controls: {
    exclude: [...excludedControlKeys, 'size'],
  },
}

export const CustomSearchFilterFn = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [filterVal, setFilterVal] = useState<string>('')
  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFilterVal(e.currentTarget.value)
  }
  const customFilterFn = (item: Datum) => item.text.includes(filterVal)

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input onChange={handleChange} {...textInputArgs} size={textInputArgs.inputSize} />
          <Autocomplete.Overlay {...overlayArgs}>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={[]}
              filterFn={customFilterFn}
              aria-labelledby="autocompleteLabel"
              {...menuArgs}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
CustomSearchFilterFn.args = {
  captionChildren: 'Items in dropdown are filtered if their text has no part that matches the input value',
}

export const CustomSortAfterMenuClose = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>([])
  const isItemSelected = (itemId: string | number) => selectedItemIds.includes(itemId)
  const onSelectedChange = (newlySelectedItems: Datum | Datum[]) => {
    if (!Array.isArray(newlySelectedItems)) {
      return
    }

    setSelectedItemIds(newlySelectedItems.map(item => item.id))
  }
  const customSortFn = (itemIdA: string | number, itemIdB: string | number) =>
    isItemSelected(itemIdA) === isItemSelected(itemIdB) ? 0 : isItemSelected(itemIdA) ? 1 : -1

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
          <Autocomplete.Overlay {...overlayArgs}>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={selectedItemIds}
              onSelectedChange={onSelectedChange}
              sortOnCloseFn={customSortFn}
              aria-labelledby="autocompleteLabel"
              {...menuArgs}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
CustomSortAfterMenuClose.args = {
  captionChildren: 'When the dropdown closes, selected items are sorted to the end',
}

export const WithCallbackWhenOverlayOpenStateChanges = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const onOpenChange = (isOpen: boolean) => {
    setIsMenuOpen(isOpen)
  }

  return (
    <Box as="form" display="flex" sx={{gap: '1em', p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
          <Autocomplete.Overlay {...overlayArgs}>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={[]}
              onOpenChange={onOpenChange}
              aria-labelledby="autocompleteLabel"
              {...menuArgs}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
      <div>
        The menu is <strong>{isMenuOpen ? 'opened' : 'closed'}</strong>
      </div>
    </Box>
  )
}

export const AsyncLoadingOfItems = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [loadedItems, setLoadedItems] = useState<Datum[]>([])
  const onOpenChange = () => {
    setTimeout(() => {
      setLoadedItems(items)
    }, 1500)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
          <Autocomplete.Overlay {...overlayArgs}>
            <Autocomplete.Menu
              items={loadedItems}
              selectedItemIds={[]}
              onOpenChange={onOpenChange}
              aria-labelledby="autocompleteLabel"
              {...menuArgs}
              loading={loadedItems.length === 0}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
AsyncLoadingOfItems.parameters = {controls: {exclude: [...excludedControlKeys, 'loading']}}

export const RenderingTheMenuOutsideAnOverlay = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, textInputArgs} = getArgsByChildComponent(args)

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label id="autocompleteLabel" {...labelArgs} />
        <Autocomplete>
          <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
          <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" {...menuArgs} />
        </Autocomplete>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
RenderingTheMenuOutsideAnOverlay.parameters = {
  controls: {
    exclude: [...excludedControlKeys, 'anchorSide', 'height', 'maxHeight', 'width'],
  },
}

export const CustomOverlayMenuAnchor = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const menuAnchorRef = useRef<HTMLElement>(null)
  const anchorWrapperStyles = {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '25%',
    border: '1px solid black',
    padding: '1em',
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label htmlFor="autocompleteInput" id="autocompleteLabel" {...labelArgs} />
        <Box {...anchorWrapperStyles} ref={menuAnchorRef as React.RefObject<HTMLDivElement>}>
          <Autocomplete>
            <Autocomplete.Input
              id="autocompleteInput"
              aria-describedby="autocompleteCaption autocompleteValidation"
              sx={{
                border: '0',
                padding: '0',
                boxShadow: 'none',
                ':focus-within': {
                  border: '0',
                  boxShadow: 'none',
                },
              }}
              {...textInputArgs}
              size={textInputArgs.inputSize}
            />
            <Autocomplete.Overlay menuAnchorRef={menuAnchorRef} {...overlayArgs}>
              <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" {...menuArgs} />
            </Autocomplete.Overlay>
          </Autocomplete>
        </Box>
        {captionArgs.children && <FormControl.Caption id="autocompleteCaption" {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation id="autocompleteValidation" {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
CustomOverlayMenuAnchor.args = {
  captionChildren: `The overlay menu's position is anchored to the div with the black border instead of to the text input`,
}

export const InOverlayWithCustomScrollContainerRef = (args: FormControlArgs<AutocompleteArgs>) => {
  const {menuArgs, textInputArgs} = getArgsByChildComponent(args)
  const scrollContainerRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
    inputRef.current && inputRef.current.focus()
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <AnchoredOverlay
        open={isOpen}
        onOpen={handleOpen}
        onClose={() => setIsOpen(false)}
        width="large"
        height="xsmall"
        focusTrapSettings={{initialFocusRef: inputRef}}
        side="inside-top"
        renderAnchor={props => <Button {...props}>open overlay</Button>}
      >
        <Autocomplete>
          <Box display="flex" flexDirection="column" height="100%">
            <Box borderWidth={0} borderBottomWidth={1} borderColor="border.default" borderStyle="solid">
              <Autocomplete.Input
                ref={inputRef}
                sx={{
                  display: 'flex',
                  border: '0',
                  paddingX: 3,
                  paddingY: 1,
                  boxShadow: 'none',
                  ':focus-within': {
                    border: '0',
                    boxShadow: 'none',
                  },
                }}
                {...textInputArgs}
                size={textInputArgs.inputSize}
                block
              />
            </Box>
            <Box overflow="auto" flexGrow={1} ref={scrollContainerRef as RefObject<HTMLDivElement>}>
              <Autocomplete.Menu
                items={items}
                selectedItemIds={[]}
                customScrollContainerRef={scrollContainerRef}
                aria-labelledby="autocompleteLabel"
                {...menuArgs}
              />
            </Box>
          </Box>
        </Autocomplete>
      </AnchoredOverlay>
    </Box>
  )
}

InOverlayWithCustomScrollContainerRef.parameters = {
  controls: {
    exclude: [
      ...excludedControlKeys,
      ...Object.keys(formControlArgTypes),
      'anchorSide',
      'height',
      'maxHeight',
      'width',
      'children',
    ],
  },
}

export const InADialog = (args: FormControlArgs<AutocompleteArgs>) => {
  const {overlayArgs} = getArgsByChildComponent(args)
  const outerContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (outerContainerRef.current instanceof HTMLElement) {
      registerPortalRoot(outerContainerRef.current, 'outerContainer')
      setMounted(true)
    }
  }, [isDialogOpen])

  return (
    <>
      <Button onClick={() => setIsDialogOpen(!isDialogOpen)}>Show dialog</Button>
      <Dialog id="dialog-with-autocomplete" isOpen={isDialogOpen}>
        <div ref={outerContainerRef}>
          <Box as="form" sx={{p: 3}}>
            {mounted ? (
              <FormControl>
                <FormControl.Label id="autocompleteLabel" />
                <Autocomplete>
                  <Autocomplete.Input data-testid="autocompleteInput" />
                  <Autocomplete.Overlay {...overlayArgs} portalContainerName="outerContainer">
                    <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
                  </Autocomplete.Overlay>
                </Autocomplete>
              </FormControl>
            ) : null}
          </Box>
        </div>
      </Dialog>
      <p>
        The Autocomplete.Overlay is portalled to a div inside the Dialog to ensure it appears above the dialog in the
        stacking context.
      </p>
    </>
  )
}

InADialog.parameters = {
  controls: {
    exclude: [
      ...excludedControlKeys,
      ...Object.keys(formControlArgTypes),
      ...Object.keys(getTextInputArgTypes()),
      'input (size)',
      'children',
      'emptyStateText',
      'selectionVariant',
    ],
  },
}

export default autocompleteStoryMeta

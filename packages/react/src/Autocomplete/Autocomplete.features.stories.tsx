import type {ChangeEventHandler, RefObject} from 'react'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import type {Meta} from '@storybook/react'

import {BaseStyles, Box, Stack, ThemeProvider, registerPortalRoot} from '..'
import {Dialog} from '../DialogV1'
import TextInputTokens from '../TextInputWithTokens'
import Autocomplete from './Autocomplete'
import {AnchoredOverlay} from '../AnchoredOverlay'
import FormControl from '../FormControl'
import {Button} from '../Button'
import type {ComponentProps} from '../utils/types'
import type {FormControlArgs} from '../utils/story-helpers'
import {
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
} from '../utils/story-helpers'

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
  title: 'Components/Autocomplete/Features',
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
              <Box as="p" position="absolute" right={5} top={2} id="key-press-label">
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

export const WithTokenInput = () => {
  const [tokens, setTokens] = useState<Datum[]>([])
  const selectedTokenIds = tokens.map(token => token.id)
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string>>(selectedTokenIds)
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
      <FormControl>
        <FormControl.Label id="autocompleteLabel">Default label</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input as={TextInputTokens} tokens={tokens} onTokenRemove={onTokenRemove} block />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={selectedItemIds}
              onSelectedChange={onSelectedChange}
              selectionVariant="multiple"
              aria-labelledby="autocompleteLabel"
            />
          </Autocomplete.Overlay>
        </Autocomplete>
      </FormControl>
    </Box>
  )
}

export const AddNewItem = () => {
  const [inputValue, setInputValue] = React.useState<string>('')

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl>
        <FormControl.Label id="autocompleteLabel-add-new">Label</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input
            value={inputValue}
            onChange={e => {
              setInputValue(e.currentTarget.value)
            }}
          />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              selectedItemIds={[]}
              aria-labelledby="autocompleteLabel-add-new"
              addNewItem={
                inputValue && !items.map(item => item.text).includes(inputValue)
                  ? {
                      text: inputValue,
                      id: inputValue,
                      // `handleAddItem` callback isn't needed for this specific example,
                      // but it's included here to show that it exists
                      handleAddItem: selectedItem => {
                        // eslint-disable-next-line no-console
                        console.log('added item:', selectedItem)
                        return
                      },
                    }
                  : undefined
              }
              items={items}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
      </FormControl>
    </Box>
  )
}

export const CustomSearchFilterFn = () => {
  const [filterVal, setFilterVal] = useState<string>('')
  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFilterVal(e.currentTarget.value)
  }
  const customFilterFn = (item: Datum) => item.text.includes(filterVal)

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl>
        <FormControl.Label id="autocompleteLabel">Default label</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input onChange={handleChange} />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={[]}
              filterFn={customFilterFn}
              aria-labelledby="autocompleteLabel"
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        <FormControl.Caption>
          Items in dropdown are filtered if their text has no part that matches the input value
        </FormControl.Caption>
      </FormControl>
    </Box>
  )
}

export const CustomSortAfterMenuClose = () => {
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string>>([])
  const isItemSelected = (itemId: string) => selectedItemIds.includes(itemId)
  const onSelectedChange = (newlySelectedItems: Datum | Datum[]) => {
    if (!Array.isArray(newlySelectedItems)) {
      return
    }

    setSelectedItemIds(newlySelectedItems.map(item => item.id))
  }
  const customSortFn = (itemIdA: string, itemIdB: string) =>
    isItemSelected(itemIdA) === isItemSelected(itemIdB) ? 0 : isItemSelected(itemIdA) ? 1 : -1

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl>
        <FormControl.Label id="autocompleteLabel">Default label</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={selectedItemIds}
              onSelectedChange={onSelectedChange}
              sortOnCloseFn={customSortFn}
              aria-labelledby="autocompleteLabel"
            />
          </Autocomplete.Overlay>
        </Autocomplete>
        <FormControl.Caption>When the dropdown closes, selected items are sorted to the end</FormControl.Caption>
      </FormControl>
    </Box>
  )
}

export const WithCallbackWhenOverlayOpenStateChanges = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const onOpenChange = (isOpen: boolean) => {
    setIsMenuOpen(isOpen)
  }

  return (
    <Stack as="form" padding="normal">
      <FormControl>
        <FormControl.Label id="autocompleteLabel">Default label</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={[]}
              onOpenChange={onOpenChange}
              aria-labelledby="autocompleteLabel"
            />
          </Autocomplete.Overlay>
        </Autocomplete>
      </FormControl>
      <div>
        The menu is <strong>{isMenuOpen ? 'opened' : 'closed'}</strong>
      </div>
    </Stack>
  )
}

export const AsyncLoadingOfItems = (args: FormControlArgs<AutocompleteArgs>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [loadedItems, setLoadedItems] = useState<Datum[]>([])
  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTimeout(() => {
        setLoadedItems(items)
      }, 1500)
    }
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

export const RenderingTheMenuOutsideAnOverlay = () => {
  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl>
        <FormControl.Label id="autocompleteLabel">Default label</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input />
          <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
        </Autocomplete>
      </FormControl>
    </Box>
  )
}

export const CustomOverlayMenuAnchor = () => {
  const menuAnchorRef = useRef<HTMLElement>(null)

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl>
        <FormControl.Label htmlFor="autocompleteInput" id="autocompleteLabel">
          Default label
        </FormControl.Label>
        <Box
          ref={menuAnchorRef as React.RefObject<HTMLDivElement>}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            flexShrink: 0,
            flexBasis: '25%',
            border: '1px solid black',
            padding: '1em',
          }}
        >
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
            />
            <Autocomplete.Overlay menuAnchorRef={menuAnchorRef}>
              <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
            </Autocomplete.Overlay>
          </Autocomplete>
        </Box>
        <FormControl.Caption>
          The overlay menu position is anchored to the div with the black border instead of to the text input
        </FormControl.Caption>
      </FormControl>
    </Box>
  )
}

export const InOverlayWithCustomScrollContainerRef = () => {
  const scrollContainerRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Datum>()

  const handleOpen = () => {
    setIsOpen(true)
    inputRef.current && inputRef.current.focus()
  }

  const selectChange = (item: Datum[] | Datum) => {
    setIsOpen(false)

    if (Array.isArray(item) && item.length) setSelectedItem(item[0])

    triggerRef.current?.focus()
  }

  return (
    <Box as="form" sx={{p: 3}}>
      Selected item: {selectedItem ? selectedItem.text : 'none'}
      <AnchoredOverlay
        open={isOpen}
        onOpen={handleOpen}
        onClose={() => setIsOpen(false)}
        width="large"
        focusTrapSettings={{initialFocusRef: inputRef}}
        side="inside-top"
        anchorRef={triggerRef}
        renderAnchor={props => <Button {...props}>open overlay</Button>}
      >
        <Autocomplete>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box
              sx={{
                borderWidth: 0,
                borderBottomWidth: 1,
                borderColor: 'var(--borderColor-default)',
                borderStyle: 'solid',
              }}
            >
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
                block
                aria-label="Search"
              />
            </Box>
            <Box
              ref={scrollContainerRef as RefObject<HTMLDivElement>}
              sx={{
                overflow: 'auto',
                flexGrow: 1,
              }}
            >
              <Autocomplete.Menu
                items={items}
                selectedItemIds={[]}
                customScrollContainerRef={scrollContainerRef}
                aria-labelledby="autocompleteLabel"
                onSelectedChange={selectChange}
              />
            </Box>
          </Box>
        </Autocomplete>
      </AnchoredOverlay>
    </Box>
  )
}

export const InADialog = () => {
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
      <Button onClick={() => setIsDialogOpen(true)}>Show dialog</Button>
      <Dialog
        aria-label="Dialog with autocomplete"
        id="dialog-with-autocomplete"
        isOpen={isDialogOpen}
        onDismiss={() => setIsDialogOpen(false)}
      >
        <div ref={outerContainerRef}>
          <Box as="form" sx={{p: 3}}>
            {mounted ? (
              <FormControl>
                <FormControl.Label id="autocompleteLabel">Default label</FormControl.Label>
                <Autocomplete>
                  <Autocomplete.Input data-testid="autocompleteInput" />
                  <Autocomplete.Overlay portalContainerName="outerContainer">
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

export default autocompleteStoryMeta

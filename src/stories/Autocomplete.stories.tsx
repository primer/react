import React, {ChangeEventHandler, RefObject, useCallback, useRef, useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'
import TextInputTokens from '../TextInputWithTokens'
import Autocomplete from '../Autocomplete/Autocomplete'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {ButtonInvisible} from '../deprecated/Button'
import FormControl from '../FormControl'
import {ComponentProps} from '../utils/types'
import {getTextInputArgTypes, textInputWithTokensArgTypes} from '../utils/story-helpers'

type AutocompleteOverlayArgs = ComponentProps<typeof Autocomplete.Overlay>
type AutocompleteMenuArgs = ComponentProps<typeof Autocomplete.Menu>
type Args = AutocompleteOverlayArgs & AutocompleteMenuArgs

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
  visibleTokenCount
}: Args) => {
  const textInputArgs = {
    block,
    contrast,
    disabled,
    inputSize,
    loading,
    loaderPosition,
    placeholder,
    validationStatus
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
      ...textInputArgs
    }
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
  {text: 'design-systems', id: 6}
]

const mockTokens: Datum[] = [...items].slice(0, 3)

const autocompleteStoryMeta: Meta = {
  title: 'Forms/Autocomplete',
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
  parameters: {controls: {exclude: excludedControlKeys}},
  argTypes: {
    // Autocomplete.Menu
    emptyStateText: {
      defaultValue: 'No selectable options',
      control: {type: 'text'},
      table: {
        category: 'Autocomplete.Menu'
      }
    },
    menuLoading: {
      name: 'loading',
      defaultValue: false,
      control: {type: 'boolean'},
      table: {
        category: 'Autocomplete.Menu'
      }
    },
    selectionVariant: {
      defaultValue: 'single',
      control: {
        type: 'radio',
        options: ['single', 'multiple']
      },
      table: {
        category: 'Autocomplete.Menu'
      }
    },

    // Autocomplete.Overlay
    anchorSide: {
      defaultValue: undefined,
      control: {
        type: 'select',
        options: [
          'inside-top',
          'inside-bottom',
          'inside-left',
          'inside-right',
          'inside-center',
          'outside-top',
          'outside-bottom',
          'outside-left',
          'outside-right'
        ]
      },
      table: {
        category: 'Autocomplete.Overlay'
      }
    },
    height: {
      defaultValue: 'auto',
      control: {
        type: 'select',
        options: ['auto', 'initial', 'small', 'medium', 'large', 'xlarge', 'xsmall']
      },
      table: {
        category: 'Autocomplete.Overlay'
      }
    },
    // needs a key other than 'maxHeight' because TextInputWithTokens also has a maxHeight prop
    overlayMaxHeight: {
      name: 'maxHeight',
      defaultValue: undefined,
      control: {
        type: 'select',
        options: ['small', 'medium', 'large', 'xlarge', 'xsmall', undefined]
      },
      table: {
        category: 'Autocomplete.Overlay'
      }
    },
    width: {
      defaultValue: 'auto',
      control: {
        type: 'select',
        options: ['auto', 'small', 'medium', 'large', 'xlarge', 'xxlarge']
      },
      table: {
        category: 'Autocomplete.Overlay'
      }
    },
    ...getTextInputArgTypes('TextInput props')
  }
} as Meta

export const Default = (args: Args) => {
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
    <FormControl>
      <FormControl.Label>Pick a tag</FormControl.Label>
      <Autocomplete>
        <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
        <Autocomplete.Overlay {...overlayArgs}>
          <Autocomplete.Menu
            items={items}
            selectedItemIds={isMultiselect ? selectedItemIds : []}
            onSelectedChange={isMultiselect ? onSelectedChange : undefined}
            {...menuArgs}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </FormControl>
  )
}

export const WithTokenInput = (args: Args) => {
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
    <FormControl>
      <FormControl.Label>Pick a tag</FormControl.Label>
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
            {...overlayArgs}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </FormControl>
  )
}
WithTokenInput.argTypes = {
  ...autocompleteStoryMeta.argTypes,
  ...textInputWithTokensArgTypes,
  ...getTextInputArgTypes('TextInput props')
}
WithTokenInput.args = {
  block: true,
  selectionVariant: 'multiple'
}
WithTokenInput.parameters = {
  controls: {
    exclude: [...excludedControlKeys, 'size']
  }
}

export const AddNewItem = (args: Args) => {
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
    <FormControl>
      <FormControl.Label>Pick tags</FormControl.Label>
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
                        selected: true
                      })
                      setFilterVal('')
                    }
                  }
                : undefined
            }
            items={localItemsState}
            selectedItemIds={selectedItemIds}
            onSelectedChange={onSelectedChange}
            {...menuArgs}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </FormControl>
  )
}
AddNewItem.args = {
  block: true,
  selectionVariant: 'multiple'
}
AddNewItem.argTypes = {
  ...autocompleteStoryMeta.argTypes,
  ...textInputWithTokensArgTypes,
  ...getTextInputArgTypes('TextInput props')
}
AddNewItem.parameters = {
  controls: {
    exclude: [...excludedControlKeys, 'size']
  }
}

export const CustomSearchFilterFn = (args: Args) => {
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [filterVal, setFilterVal] = useState<string>('')
  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFilterVal(e.currentTarget.value)
  }
  const customFilterFn = (item: Datum) => item.text.includes(filterVal)

  return (
    <FormControl>
      <FormControl.Label>Pick tags</FormControl.Label>
      <Autocomplete>
        <Autocomplete.Input onChange={handleChange} {...textInputArgs} size={textInputArgs.inputSize} />
        <Autocomplete.Overlay {...overlayArgs}>
          <Autocomplete.Menu
            items={items}
            selectedItemIds={[]}
            aria-labelledby="autocompleteLabel"
            filterFn={customFilterFn}
            {...menuArgs}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
      <FormControl.Caption>
        Items in dropdown are filtered if their text has no part that matches the input value
      </FormControl.Caption>
    </FormControl>
  )
}

export const CustomSortAfterMenuClose = (args: Args) => {
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
    <FormControl>
      <FormControl.Label>Pick tags</FormControl.Label>
      <Autocomplete>
        <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
        <Autocomplete.Overlay {...overlayArgs}>
          <Autocomplete.Menu
            items={items}
            selectedItemIds={selectedItemIds}
            aria-labelledby="autocompleteLabel"
            onSelectedChange={onSelectedChange}
            sortOnCloseFn={customSortFn}
            {...menuArgs}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
      <FormControl.Caption>When the dropdown closes, selected items are sorted to the end</FormControl.Caption>
    </FormControl>
  )
}

export const WithCallbackWhenOverlayOpenStateChanges = (args: Args) => {
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const onOpenChange = (isOpen: boolean) => {
    setIsMenuOpen(isOpen)
  }

  return (
    <Box display="flex" sx={{gap: '1em'}}>
      <FormControl>
        <FormControl.Label>Pick tags</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
          <Autocomplete.Overlay {...overlayArgs}>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={[]}
              aria-labelledby="autocompleteLabel"
              onOpenChange={onOpenChange}
              {...menuArgs}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
      </FormControl>
      <div>
        The menu is <strong>{isMenuOpen ? 'opened' : 'closed'}</strong>
      </div>
    </Box>
  )
}

export const AsyncLoadingOfItems = (args: Args) => {
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const [loadedItems, setLoadedItems] = useState<Datum[]>([])
  const onOpenChange = () => {
    setTimeout(() => {
      setLoadedItems(items)
    }, 1500)
  }

  return (
    <FormControl>
      <FormControl.Label>Pick tags</FormControl.Label>
      <Autocomplete>
        <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
        <Autocomplete.Overlay {...overlayArgs}>
          <Autocomplete.Menu
            items={loadedItems}
            selectedItemIds={[]}
            aria-labelledby="autocompleteLabel"
            onOpenChange={onOpenChange}
            {...menuArgs}
            loading={loadedItems.length === 0}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </FormControl>
  )
}
AsyncLoadingOfItems.parameters = {controls: {exclude: [...excludedControlKeys, 'loading']}}

export const RenderingTheMenuOutsideAnOverlay = (args: Args) => {
  const {menuArgs, textInputArgs} = getArgsByChildComponent(args)

  return (
    <FormControl>
      <FormControl.Label>Pick tags</FormControl.Label>
      <Autocomplete>
        <Autocomplete.Input {...textInputArgs} size={textInputArgs.inputSize} />
        <Autocomplete.Menu items={items} selectedItemIds={[]} {...menuArgs} />
      </Autocomplete>
    </FormControl>
  )
}
RenderingTheMenuOutsideAnOverlay.parameters = {
  controls: {
    exclude: [...excludedControlKeys, 'anchorSide', 'height', 'maxHeight', 'width']
  }
}

export const CustomOverlayMenuAnchor = (args: Args) => {
  const {menuArgs, overlayArgs, textInputArgs} = getArgsByChildComponent(args)
  const menuAnchorRef = useRef<HTMLElement>(null)
  const anchorWrapperStyles = {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '25%',
    border: '1px solid black',
    padding: '1em'
  }

  return (
    <FormControl>
      <FormControl.Label htmlFor="autocompleteInput">Pick tags</FormControl.Label>
      <Box {...anchorWrapperStyles} ref={menuAnchorRef as React.RefObject<HTMLDivElement>}>
        <Autocomplete>
          <Autocomplete.Input
            id="autocompleteInput"
            aria-describedby="aria-describedBy"
            sx={{
              border: '0',
              padding: '0',
              boxShadow: 'none',
              ':focus-within': {
                border: '0',
                boxShadow: 'none'
              }
            }}
            {...textInputArgs}
            size={textInputArgs.inputSize}
          />
          <Autocomplete.Overlay menuAnchorRef={menuAnchorRef} {...overlayArgs}>
            <Autocomplete.Menu items={items} selectedItemIds={[]} {...menuArgs} />
          </Autocomplete.Overlay>
        </Autocomplete>
      </Box>
      <FormControl.Caption id="autocompleteCaption">
        The overlay menu&apos;s position is anchored to the div with the black border instead of to the text input
      </FormControl.Caption>
    </FormControl>
  )
}

export const InOverlayWithCustomScrollContainerRef = (args: Args) => {
  const {menuArgs, textInputArgs} = getArgsByChildComponent(args)
  const scrollContainerRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
    inputRef.current && inputRef.current.focus()
  }

  return (
    <AnchoredOverlay
      open={isOpen}
      onOpen={handleOpen}
      onClose={() => setIsOpen(false)}
      width="large"
      height="xsmall"
      focusTrapSettings={{initialFocusRef: inputRef}}
      side="inside-top"
      renderAnchor={props => <ButtonInvisible {...props}>open overlay</ButtonInvisible>}
    >
      <FormControl.Label htmlFor="autocompleteInput" visuallyHidden>
        Pick tags
      </FormControl.Label>
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
                  boxShadow: 'none'
                }
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
              {...menuArgs}
            />
          </Box>
        </Box>
      </Autocomplete>
    </AnchoredOverlay>
  )
}

InOverlayWithCustomScrollContainerRef.parameters = {
  controls: {
    exclude: [...excludedControlKeys, 'anchorSide', 'height', 'maxHeight', 'width']
  }
}

export default autocompleteStoryMeta

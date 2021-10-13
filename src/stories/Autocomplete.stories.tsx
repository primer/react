import React, {ChangeEventHandler, RefObject, useCallback, useRef, useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, Text, TextInput, ThemeProvider} from '..'
import TextInputTokens from '../TextInputWithTokens'
import Autocomplete from '../Autocomplete/Autocomplete'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {ButtonInvisible} from '../Button'

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

const mockTokens: Datum[] = [
  {text: 'zero', id: 0},
  {text: 'one', id: 1},
  {text: 'three', id: 3},
  {text: 'four', id: 4}
]

export default {
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
  ]
} as Meta

export const SingleSelect = () => {
  return (
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick an option
      </Box>
      <Autocomplete>
        <Autocomplete.Input id="autocompleteInput" />
        <Autocomplete.Overlay>
          <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
        </Autocomplete.Overlay>
      </Autocomplete>
    </>
  )
}

export const MultiSelect = () => {
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>([])
  const onSelectedChange = (newlySelectedItems: Datum | Datum[]) => {
    if (!Array.isArray(newlySelectedItems)) {
      return
    }

    setSelectedItemIds(newlySelectedItems.map(item => item.id))
  }

  const getItemById = (id: string | number) => items.find(item => item.id === id)

  return (
    <Box display="flex" sx={{gap: '1em'}}>
      <div>
        <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
          Pick an option
        </Box>
        <Autocomplete>
          <Autocomplete.Input id="autocompleteInput" />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={selectedItemIds}
              aria-labelledby="autocompleteLabel"
              onSelectedChange={onSelectedChange}
              selectionVariant="multiple"
            />
          </Autocomplete.Overlay>
        </Autocomplete>
      </div>
      <div>
        <div>Selected items:</div>
        <Box as="ul" my={0}>
          {selectedItemIds.map(selectedItemId => (
            <li key={selectedItemId}>{getItemById(selectedItemId)?.text}</li>
          ))}
        </Box>
      </div>
    </Box>
  )
}

export const MultiSelectWithTokenInput = () => {
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

  return (
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick options
      </Box>
      <Autocomplete>
        <Autocomplete.Input as={TextInputTokens} tokens={tokens} onTokenRemove={onTokenRemove} id="autocompleteInput" />
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
    </>
  )
}

export const MultiSelectAddNewItem = () => {
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
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick options
      </Box>
      <Autocomplete>
        <Autocomplete.Input
          as={TextInputTokens}
          tokens={tokens}
          onTokenRemove={onTokenRemove}
          onChange={handleChange}
          id="autocompleteInput"
        />
        <Autocomplete.Overlay>
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
            selectionVariant="multiple"
            aria-labelledby="autocompleteLabel"
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </>
  )
}

export const CustomEmptyStateMessage = () => {
  return (
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick an option
      </Box>
      <Autocomplete>
        <Autocomplete.Input id="autocompleteInput" />
        <Autocomplete.Overlay>
          <Autocomplete.Menu
            items={items}
            selectedItemIds={[]}
            aria-labelledby="autocompleteLabel"
            emptyStateText="Sorry, no matches"
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </>
  )
}

export const CustomSearchFilter = () => {
  const [filterVal, setFilterVal] = useState<string>('')
  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFilterVal(e.currentTarget.value)
  }
  const customFilterFn = (item: Datum) => item.text.includes(filterVal)

  return (
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick an option
      </Box>
      <Autocomplete>
        <Autocomplete.Input id="autocompleteInput" onChange={handleChange} />
        <Autocomplete.Overlay>
          <Autocomplete.Menu
            items={items}
            selectedItemIds={[]}
            aria-labelledby="autocompleteLabel"
            filterFn={customFilterFn}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
      <Text fontSize={0} display="block" color="fg.subtle" mt={2}>
        Items in dropdown are filtered if their text has no part that matches the input value
      </Text>
    </>
  )
}

export const CustomSortAfterMenuClose = () => {
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
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick an option
      </Box>
      <Autocomplete>
        <Autocomplete.Input id="autocompleteInput" />
        <Autocomplete.Overlay>
          <Autocomplete.Menu
            items={items}
            selectedItemIds={selectedItemIds}
            aria-labelledby="autocompleteLabel"
            onSelectedChange={onSelectedChange}
            sortOnCloseFn={customSortFn}
            selectionVariant="multiple"
          />
        </Autocomplete.Overlay>
      </Autocomplete>
      <Text fontSize={0} display="block" color="fg.subtle" mt={2}>
        When the dropdown closes, selected items are sorted to the end
      </Text>
    </>
  )
}

export const WithCallbackWhenOverlayOpenStateChanges = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const onOpenChange = (isOpen: boolean) => {
    setIsMenuOpen(isOpen)
  }

  return (
    <Box display="flex" sx={{gap: '1em'}}>
      <div>
        <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
          Pick an option
        </Box>
        <Autocomplete>
          <Autocomplete.Input id="autocompleteInput" />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={[]}
              aria-labelledby="autocompleteLabel"
              onOpenChange={onOpenChange}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
      </div>
      <div>
        The menu is <strong>{isMenuOpen ? 'opened' : 'closed'}</strong>
      </div>
    </Box>
  )
}

export const AsyncLoadingOfItems = () => {
  const [loadedItems, setLoadedItems] = useState<Datum[]>([])
  const onOpenChange = () => {
    setTimeout(() => {
      setLoadedItems(items)
    }, 1500)
  }

  return (
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick an option
      </Box>
      <Autocomplete>
        <Autocomplete.Input id="autocompleteInput" />
        <Autocomplete.Overlay>
          <Autocomplete.Menu
            items={loadedItems}
            selectedItemIds={[]}
            aria-labelledby="autocompleteLabel"
            onOpenChange={onOpenChange}
            loading={loadedItems.length === 0}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </>
  )
}

export const RenderingTheMenuOutsideAnOverlay = () => {
  return (
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick an option
      </Box>
      <Autocomplete>
        <Autocomplete.Input id="autocompleteInput" />
        <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
      </Autocomplete>
    </>
  )
}

export const CustomOverlayMenuAnchor = () => {
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
    <>
      <Box as="label" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick labels
      </Box>
      <Box {...anchorWrapperStyles} ref={menuAnchorRef as React.RefObject<HTMLDivElement>}>
        <Autocomplete>
          <Autocomplete.Input
            as={TextInput}
            id="autocompleteInput"
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
          <Autocomplete.Overlay menuAnchorRef={menuAnchorRef}>
            <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
          </Autocomplete.Overlay>
        </Autocomplete>
      </Box>
      <Text fontSize={0} display="block" color="fg.subtle" mt={2}>
        The overlay menu&apos;s position is anchored to the div with the black border instead of to the text input
      </Text>
    </>
  )
}

export const WithCustomOverlayProps = () => {
  return (
    <>
      <Box as="label" display="block" htmlFor="autocompleteInput" id="autocompleteLabel">
        Pick an option
      </Box>
      <Autocomplete>
        <Autocomplete.Input id="autocompleteInput" />
        <Autocomplete.Overlay
          overlayProps={{
            width: 'large',
            height: 'xsmall'
          }}
        >
          <Autocomplete.Menu items={items} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
        </Autocomplete.Overlay>
      </Autocomplete>
    </>
  )
}

export const InOverlayWithCustomScrollContainerRef = () => {
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
      <Box
        as="label"
        display="block"
        htmlFor="autocompleteInput"
        id="autocompleteLabel"
        sx={{
          // visually hides this label for sighted users
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0'
        }}
      >
        Pick options
      </Box>
      <Autocomplete>
        <Box display="flex" flexDirection="column" height="100%">
          <Box
            paddingX="3"
            paddingY="1"
            borderWidth={0}
            borderBottomWidth={1}
            borderColor="border.default"
            borderStyle="solid"
          >
            <Autocomplete.Input
              block
              as={TextInput}
              ref={inputRef}
              id="autocompleteInput"
              sx={{
                display: 'flex',
                border: '0',
                padding: '0',
                boxShadow: 'none',
                ':focus-within': {
                  border: '0',
                  boxShadow: 'none'
                }
              }}
            />
          </Box>
          <Box overflow="auto" flexGrow={1} ref={scrollContainerRef as RefObject<HTMLDivElement>}>
            <Autocomplete.Menu
              items={items}
              selectedItemIds={[]}
              // onSelectedChange={onSelectedChange}
              customScrollContainerRef={scrollContainerRef}
              aria-labelledby="autocompleteLabel"
            />
          </Box>
        </Box>
      </Autocomplete>
    </AnchoredOverlay>
  )
}

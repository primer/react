import React from 'react'
import {render} from '../utils/testing'
import {render as HTMLRender, fireEvent} from '@testing-library/react'
import {toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import Autocomplete, {AutocompleteInputProps} from '../Autocomplete'
import {SSRProvider} from '../index'
import theme from '../theme'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'
import userEvent from '@testing-library/user-event'
import {AutocompleteMenuInternalProps} from '../Autocomplete/AutocompleteMenu'
import {ItemProps} from '../ActionList'
import {MandateProps} from '../utils/types'
expect.extend(toHaveNoViolations)

const mockItems = [
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AutocompleteItemProps<T = Record<string, any>> = MandateProps<ItemProps, 'id'> & {metadata?: T}

const AUTOCOMPLETE_LABEL = 'Autocomplete field'
const LabelledAutocomplete = <T extends AutocompleteItemProps>({
  inputProps = {},
  menuProps
}: {
  inputProps?: AutocompleteInputProps
  menuProps: AutocompleteMenuInternalProps<T>
}) => {
  const {['aria-labelledby']: ariaLabelledBy = 'autocompleteLabel', ...menuPropsRest} = menuProps
  const {id = 'autocompleteInput', ...inputPropsRest} = inputProps
  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
        <BaseStyles>
          {/* eslint-disable-next-line jsx-a11y/label-has-for */}
          <label htmlFor={id} id={ariaLabelledBy}>
            Autocomplete field
          </label>
          <Autocomplete id="autocompleteId">
            <Autocomplete.Input id={id} {...inputPropsRest} />
            <Autocomplete.Overlay>
              <Autocomplete.Menu aria-labelledby={ariaLabelledBy} {...menuPropsRest} />
            </Autocomplete.Overlay>
          </Autocomplete>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('Autocomplete', () => {
  describe('snapshots', () => {
    it('renders a single select input', () => {
      expect(
        render(
          <SSRProvider>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input />
              <Autocomplete.Menu aria-labelledby="labelId" items={mockItems} selectedItemIds={[]} />
            </Autocomplete>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })

    it('renders a multiselect input', () => {
      expect(
        render(
          <SSRProvider>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input />
              <Autocomplete.Menu
                aria-labelledby="labelId"
                items={mockItems}
                selectedItemIds={[]}
                selectionVariant="multiple"
              />
            </Autocomplete>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })

    it('renders a multiselect input with selected menu items', () => {
      expect(
        render(
          <SSRProvider>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input />
              <Autocomplete.Menu
                aria-labelledby="labelId"
                items={mockItems}
                selectedItemIds={[0, 1, 2]}
                selectionVariant="multiple"
              />
            </Autocomplete>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })

    it('renders a menu that contains an item to add to the menu', () => {
      const handleAddItemMock = jest.fn()
      expect(
        render(
          <SSRProvider>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input />
              <Autocomplete.Menu
                aria-labelledby="labelId"
                items={mockItems}
                selectionVariant="multiple"
                selectedItemIds={[]}
                addNewItem={{
                  text: 'Add new item',
                  handleAddItem: handleAddItemMock
                }}
              />
            </Autocomplete>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })

    it('renders a custom empty state message', () => {
      expect(
        render(
          <SSRProvider>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input />
              <Autocomplete.Menu
                aria-labelledby="labelId"
                items={[]}
                selectedItemIds={[]}
                emptyStateText="No results"
              />
            </Autocomplete>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })

    it('renders a loading state', () => {
      expect(
        render(
          <SSRProvider>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input />
              <Autocomplete.Menu aria-labelledby="labelId" loading items={[]} selectedItemIds={[]} />
            </Autocomplete>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })

    it('renders with a custom text input component', () => {
      expect(
        render(
          <SSRProvider>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input as={() => <input type="text" id="customInput" />} />
              <Autocomplete.Menu aria-labelledby="labelId" items={mockItems} selectedItemIds={[]} />
            </Autocomplete>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })

    it('renders with an input value', () => {
      expect(
        render(
          <SSRProvider>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input value="test" />
              <Autocomplete.Menu aria-labelledby="labelId" items={mockItems} selectedItemIds={[]} />
            </Autocomplete>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
  })

  describe('Autocomplete.Input', () => {
    it('calls onChange', () => {
      const onChangeMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete
          inputProps={{onChange: onChangeMock}}
          menuProps={{items: mockItems, selectedItemIds: []}}
        />
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect(onChangeMock).not.toHaveBeenCalled()
      inputNode && userEvent.type(inputNode, 'z')
      expect(onChangeMock).toHaveBeenCalled()
    })

    it('calls onFocus', () => {
      const onFocusMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete inputProps={{onFocus: onFocusMock}} menuProps={{items: mockItems, selectedItemIds: []}} />
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect(onFocusMock).not.toHaveBeenCalled()
      inputNode && fireEvent.focus(inputNode)
      expect(onFocusMock).toHaveBeenCalled()
    })

    it('calls onKeyDown', () => {
      const onKeyDownMock = jest.fn()
      const {getByLabelText} = HTMLRender(
        <LabelledAutocomplete inputProps={{onKeyDown: onKeyDownMock}} menuProps={{items: [], selectedItemIds: []}} />
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyDownMock).not.toHaveBeenCalled()
      fireEvent.keyDown(inputNode, {key: 'Shift'})
      expect(onKeyDownMock).toHaveBeenCalled()
    })

    it('calls onKeyUp', () => {
      const onKeyUpMock = jest.fn()
      const {getByLabelText} = HTMLRender(
        <LabelledAutocomplete inputProps={{onKeyUp: onKeyUpMock}} menuProps={{items: [], selectedItemIds: []}} />
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyUpMock).not.toHaveBeenCalled()
      fireEvent.keyUp(inputNode, {key: 'Shift'})
      expect(onKeyUpMock).toHaveBeenCalled()
    })

    it('calls onKeyPress', () => {
      const onKeyPressMock = jest.fn()
      const {getByLabelText} = HTMLRender(
        <LabelledAutocomplete inputProps={{onKeyPress: onKeyPressMock}} menuProps={{items: [], selectedItemIds: []}} />
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyPressMock).not.toHaveBeenCalled()
      userEvent.type(inputNode, '{enter}')
      expect(onKeyPressMock).toHaveBeenCalled()
    })

    it('opens the menu when the input is focused', () => {
      const {getByLabelText} = HTMLRender(<LabelledAutocomplete menuProps={{items: [], selectedItemIds: []}} />)
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
      fireEvent.focus(inputNode)
      expect(inputNode.getAttribute('aria-expanded')).toBe('true')
    })

    it('closes the menu when the input is blurred', () => {
      const {getByLabelText} = HTMLRender(<LabelledAutocomplete menuProps={{items: [], selectedItemIds: []}} />)
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
      fireEvent.focus(inputNode)
      expect(inputNode.getAttribute('aria-expanded')).toBe('true')
      // eslint-disable-next-line github/no-blur
      fireEvent.blur(inputNode)

      // wait a tick for blur to finish
      setTimeout(() => {
        expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
      }, 0)
    })

    it('sets the input value to the suggested item text and highlights the untyped part of the word', () => {
      const {container, getByDisplayValue} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: []}} />
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && userEvent.type(inputNode, 'ze')
      expect(getByDisplayValue('zero')).toBeDefined()
    })

    it('does not show or highlight suggestion text after the user hits Backspace until they hit another key', () => {
      const {container, getByDisplayValue} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: []}} />
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect((inputNode as HTMLInputElement).selectionStart).toBe(0)
      inputNode && userEvent.type(inputNode, 'ze')
      expect(getByDisplayValue('zero')).toBeDefined()
      expect((inputNode as HTMLInputElement).selectionStart).toBe(2)
      expect((inputNode as HTMLInputElement).selectionEnd).toBe(4)
      inputNode && userEvent.type(inputNode, '{backspace}')
      expect((inputNode as HTMLInputElement).selectionStart).toBe(2)
      expect(getByDisplayValue('ze')).toBeDefined()
      inputNode && userEvent.type(inputNode, 'r')
      expect((inputNode as HTMLInputElement).selectionStart).toBe(3)
      expect((inputNode as HTMLInputElement).selectionEnd).toBe(4)
      expect(getByDisplayValue('zero')).toBeDefined()
    })

    it('clears the input value when when the user hits Escape', () => {
      const {container} = HTMLRender(<LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: []}} />)
      const inputNode = container.querySelector('#autocompleteInput')

      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
      inputNode && userEvent.type(inputNode, 'ze')
      expect(inputNode?.getAttribute('aria-expanded')).toBe('true')
      inputNode && userEvent.type(inputNode, '{esc}')
      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
    })
  })

  describe('Autocomplete.Menu', () => {
    it('calls a custom filter function', () => {
      const filterFnMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], filterFn: filterFnMock}} />
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && userEvent.type(inputNode, 'ze')
      expect(filterFnMock).toHaveBeenCalled()
    })

    it('calls a custom sort function when the menu closes', () => {
      const sortOnCloseFnMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], sortOnCloseFn: sortOnCloseFnMock}} />
      )
      const inputNode = container.querySelector('#autocompleteInput')

      // `sortOnCloseFnMock` will be called in a `.sort()` on render to check if the
      // current sort order matches the result of `sortOnCloseFnMock`
      expect(sortOnCloseFnMock).toHaveBeenCalledTimes(mockItems.length - 1)
      if (inputNode) {
        userEvent.type(inputNode, 'ze')
        // eslint-disable-next-line github/no-blur
        fireEvent.blur(inputNode)
      }

      // wait a tick for blur to finish
      setTimeout(() => {
        expect(sortOnCloseFnMock).toHaveBeenCalledTimes(mockItems.length)
      }, 0)
    })

    it("calls onOpenChange with the menu's open state", () => {
      const onOpenChangeMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], onOpenChange: onOpenChangeMock}} />
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && userEvent.type(inputNode, 'ze')
      expect(onOpenChangeMock).toHaveBeenCalled()
    })

    it('calls onSelectedChange with the data for the selected items', () => {
      const onSelectedChangeMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], onSelectedChange: onSelectedChangeMock}}
        />
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect(onSelectedChangeMock).not.toHaveBeenCalled()
      if (inputNode) {
        fireEvent.focus(inputNode)
        userEvent.type(inputNode, '{enter}')
      }

      // wait a tick for the keyboard event to be dispatched to the menu item
      setTimeout(() => {
        expect(onSelectedChangeMock).toHaveBeenCalledWith([mockItems[0]])
      }, 0)
    })

    it('does not close the menu when clicking an item in the menu if selectionVariant=multiple', () => {
      const {getByText, container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], selectionVariant: 'multiple'}} />
      )
      const inputNode = container.querySelector('#autocompleteInput')
      const itemToClickNode = getByText(mockItems[1].text)

      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
      inputNode && fireEvent.focus(inputNode)
      expect(inputNode?.getAttribute('aria-expanded')).toBe('true')
      fireEvent.click(itemToClickNode)
      inputNode && userEvent.type(inputNode, '{enter}')
      expect(inputNode?.getAttribute('aria-expanded')).toBe('true')
    })

    it('closes the menu when clicking an item in the menu if selectionVariant=single', () => {
      const {getByText, container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], selectionVariant: 'single'}} />
      )
      const inputNode = container.querySelector('#autocompleteInput')
      const itemToClickNode = getByText(mockItems[1].text)

      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
      inputNode && fireEvent.focus(inputNode)
      expect(inputNode?.getAttribute('aria-expanded')).toBe('true')
      fireEvent.click(itemToClickNode)
      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
    })

    it('calls handleAddItem with new item data when passing addNewItem', () => {
      const handleAddItemMock = jest.fn()
      const {getByText} = HTMLRender(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            selectionVariant: 'multiple',
            addNewItem: {
              text: 'Add new item',
              handleAddItem: handleAddItemMock
            }
          }}
        />
      )

      const addNewItemNode = getByText('Add new item')

      expect(handleAddItemMock).not.toHaveBeenCalled()
      fireEvent.click(addNewItemNode)
      expect(handleAddItemMock).toHaveBeenCalled()
    })
  })
})

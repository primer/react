import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import type {AutocompleteInputProps} from '../Autocomplete'
import Autocomplete from '../Autocomplete'
import type {AutocompleteMenuInternalProps, AutocompleteMenuItem} from '../Autocomplete/AutocompleteMenu'
import BaseStyles from '../BaseStyles'

const mockItems = [
  {text: 'zero', id: '0'},
  {text: 'one', id: '1'},
  {text: 'two', id: '2'},
  {text: 'three', id: '3'},
  {text: 'four', id: '4'},
  {text: 'five', id: '5'},
  {text: 'six', id: '6'},
  {text: 'seven', id: '7'},
  {text: 'twenty', id: '20'},
  {text: 'twentyone', id: '21'},
]

const AUTOCOMPLETE_LABEL = 'Autocomplete field'
const LabelledAutocomplete = <T extends AutocompleteMenuItem>({
  inputProps = {},
  menuProps,
}: {
  inputProps?: AutocompleteInputProps
  menuProps: AutocompleteMenuInternalProps<T>
}) => {
  const {['aria-labelledby']: ariaLabelledBy, ...menuPropsRest} = menuProps
  const {id = 'autocompleteInput', ...inputPropsRest} = inputProps
  return (
    <BaseStyles>
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
  )
}

describe('Autocomplete', () => {
  describe('Autocomplete.Input', () => {
    it('calls onChange', async () => {
      const user = userEvent.setup()
      const onChangeMock = vi.fn()
      const {container} = render(
        <LabelledAutocomplete
          inputProps={{onChange: onChangeMock}}
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')
      expect(onChangeMock).not.toHaveBeenCalled()
      inputNode && (await user.type(inputNode, 'z'))
      expect(onChangeMock).toHaveBeenCalled()
    })

    it('calls onFocus', () => {
      const onFocusMock = vi.fn()
      const {container} = render(
        <LabelledAutocomplete
          inputProps={{onFocus: onFocusMock}}
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect(onFocusMock).not.toHaveBeenCalled()
      inputNode && fireEvent.focus(inputNode)
      expect(onFocusMock).toHaveBeenCalled()
    })

    it('calls onKeyDown', () => {
      const onKeyDownMock = vi.fn()
      const {getByLabelText} = render(
        <LabelledAutocomplete
          inputProps={{onKeyDown: onKeyDownMock}}
          menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyDownMock).not.toHaveBeenCalled()
      fireEvent.keyDown(inputNode, {key: 'Shift'})
      expect(onKeyDownMock).toHaveBeenCalled()
    })

    it('calls onKeyUp', () => {
      const onKeyUpMock = vi.fn()
      const {getByLabelText} = render(
        <LabelledAutocomplete
          inputProps={{onKeyUp: onKeyUpMock}}
          menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyUpMock).not.toHaveBeenCalled()
      fireEvent.keyUp(inputNode, {key: 'Shift'})
      expect(onKeyUpMock).toHaveBeenCalled()
    })

    it('calls onKeyPress', async () => {
      const user = userEvent.setup()
      const onKeyPressMock = vi.fn()
      const {getByLabelText} = render(
        <LabelledAutocomplete
          inputProps={{onKeyPress: onKeyPressMock}}
          menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyPressMock).not.toHaveBeenCalled()
      await user.type(inputNode, '{enter}')
      expect(onKeyPressMock).toHaveBeenCalled()
    })

    it('opens the menu when the input is focused and arrow key is pressed', () => {
      const {getByLabelText} = render(
        <LabelledAutocomplete menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}} />,
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
      fireEvent.click(inputNode)
      fireEvent.keyDown(inputNode, {key: 'ArrowDown'})
      expect(inputNode.getAttribute('aria-expanded')).toBe('true')
    })

    it('closes the menu when the input is blurred', async () => {
      const {getByLabelText} = render(
        <LabelledAutocomplete menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}} />,
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
      fireEvent.click(inputNode)
      fireEvent.keyDown(inputNode, {key: 'ArrowDown'})

      expect(inputNode.getAttribute('aria-expanded')).toBe('true')

      await userEvent.tab()

      expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
    })

    it('sets the input value to the suggested item text and highlights the untyped part of the word', async () => {
      const user = userEvent.setup()
      const {container, getByDisplayValue} = render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && (await user.type(inputNode, 'ze'))
      expect(getByDisplayValue('zero')).toBeDefined()
    })

    it('does not show or highlight suggestion text after the user hits Backspace until they hit another key', async () => {
      const user = userEvent.setup()
      const {container, getByDisplayValue} = render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect((inputNode as HTMLInputElement).selectionStart).toBe(0)
      inputNode && (await user.type(inputNode, 'ze'))
      expect(getByDisplayValue('zero')).toBeDefined()
      expect((inputNode as HTMLInputElement).selectionStart).toBe(2)
      expect((inputNode as HTMLInputElement).selectionEnd).toBe(4)
      inputNode && (await user.keyboard('{backspace}'))
      expect((inputNode as HTMLInputElement).selectionStart).toBe(2)
      expect(getByDisplayValue('ze')).toBeDefined()
      inputNode && (await user.keyboard('r'))
      expect((inputNode as HTMLInputElement).selectionStart).toBe(3)
      expect((inputNode as HTMLInputElement).selectionEnd).toBe(4)
      expect(getByDisplayValue('zero')).toBeDefined()
    })

    it('clears the input value when the user hits Escape', async () => {
      const user = userEvent.setup()
      const {container} = render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
      inputNode && (await user.type(inputNode, 'ze'))
      expect(inputNode?.getAttribute('aria-expanded')).toBe('true')
      inputNode && (await user.keyboard('{escape}'))
      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
    })

    it('allows the value to be 0', () => {
      const {getByDisplayValue} = render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
          inputProps={{value: 0}}
        />,
      )

      expect(getByDisplayValue('0')).toBeDefined()
    })

    it('should support `className` on the outermost element', () => {
      const Element = () => (
        <Autocomplete>
          <Autocomplete.Input className={'test-class-name'} />
        </Autocomplete>
      )
      expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
    })
  })

  describe('Autocomplete.Menu', () => {
    it('calls a custom filter function', async () => {
      const user = userEvent.setup()
      const filterFnMock = vi.fn()
      const {container} = render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            filterFn: filterFnMock,
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && (await user.type(inputNode, 'ze'))
      expect(filterFnMock).toHaveBeenCalled()
    })

    it('calls a custom sort function when the menu closes', async () => {
      const user = userEvent.setup()
      const sortOnCloseFnMock = vi.fn()
      const {container} = render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            sortOnCloseFn: sortOnCloseFnMock,
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      // `sortOnCloseFnMock` will be called in a `.sort()` on render to check if the
      // current sort order matches the result of `sortOnCloseFnMock`
      expect(sortOnCloseFnMock).toHaveBeenCalledTimes(mockItems.length - 1)
      if (inputNode) {
        await user.type(inputNode, 'ze')
        // eslint-disable-next-line github/no-blur
        fireEvent.blur(inputNode)
      }

      // wait a tick for blur to finish
      await waitFor(() => expect(sortOnCloseFnMock).toHaveBeenCalled())
    })

    it("calls onOpenChange with the menu's open state", async () => {
      const user = userEvent.setup()
      const onOpenChangeMock = vi.fn()
      const {container} = render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            onOpenChange: onOpenChangeMock,
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && (await user.type(inputNode, 'ze'))
      expect(onOpenChangeMock).toHaveBeenCalled()
    })

    it('calls onSelectedChange with the data for the selected items', async () => {
      const user = userEvent.setup()
      const onSelectedChangeMock = vi.fn()
      const {container} = render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            onSelectedChange: onSelectedChangeMock,
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect(onSelectedChangeMock).not.toHaveBeenCalled()
      if (inputNode) {
        fireEvent.focus(inputNode)
        await user.type(inputNode, '{arrowdown}{enter}')
      }

      expect(onSelectedChangeMock).toHaveBeenCalledWith([mockItems[0]])
    })

    it('does not close the menu when clicking an item in the menu if selectionVariant=multiple', async () => {
      const user = userEvent.setup()
      const {getByText, container} = render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            selectionVariant: 'multiple',
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      if (inputNode) {
        expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
        await user.click(inputNode)

        fireEvent.keyDown(inputNode, {key: 'ArrowDown'})
        expect(inputNode.getAttribute('aria-expanded')).toBe('true')
        await user.click(getByText(mockItems[1].text))
        expect(inputNode.getAttribute('aria-expanded')).toBe('true')
      }
    })

    it('closes the menu when clicking an item in the menu if selectionVariant=single', async () => {
      const user = userEvent.setup()
      const {getByText, container} = render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            selectionVariant: 'single',
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      if (inputNode) {
        expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
        await user.click(inputNode)
        fireEvent.keyDown(inputNode, {key: 'ArrowDown'})
        expect(inputNode.getAttribute('aria-expanded')).toBe('true')
        await user.click(getByText(mockItems[1].text))
        expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
      }
    })

    it('calls handleAddItem with new item data when passing addNewItem', () => {
      const handleAddItemMock = vi.fn()
      const {getByText} = render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            selectionVariant: 'multiple',
            addNewItem: {
              id: 'add-new-item',
              text: 'Add new item',
              handleAddItem: handleAddItemMock,
            },
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )

      const addNewItemNode = getByText('Add new item')

      expect(handleAddItemMock).not.toHaveBeenCalled()
      fireEvent.click(addNewItemNode)
      expect(handleAddItemMock).toHaveBeenCalled()
    })

    it('throws an error when passing multiple items when selection="single"', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <Autocomplete>
            <Autocomplete.Menu
              items={mockItems}
              selectedItemIds={['1', '2', '3']}
              selectionVariant="single"
              aria-labelledby="autocompleteLabel"
            />
          </Autocomplete>,
        )
      }).toThrow('Autocomplete: selectionVariant "single" cannot be used with multiple selected items')

      spy.mockRestore()
    })

    it('renders items with the `children` field', () => {
      render(
        <>
          <span id="label">test-label</span>
          <Autocomplete>
            <Autocomplete.Menu
              filterFn={() => true}
              items={[
                {
                  id: '0',
                  children: <span>One</span>,
                },
                {
                  id: '1',
                  children: <span>Two</span>,
                },
                {
                  id: '2',
                  children: <span>Three</span>,
                },
              ]}
              selectedItemIds={[]}
              selectionVariant="single"
              aria-labelledby="label"
            />
          </Autocomplete>
        </>,
      )

      expect(screen.getByText('One')).toBeInTheDocument()
      expect(screen.getByText('Two')).toBeInTheDocument()
      expect(screen.getByText('Three')).toBeInTheDocument()
    })
  })

  describe('Autocomplete.Overlay', () => {
    it('should support `className` on the outermost element', async () => {
      const Element = ({className}: {className: string}) => (
        <Autocomplete id="autocompleteId">
          <Autocomplete.Input />
          <Autocomplete.Overlay className={className} visibility="visible">
            hi
          </Autocomplete.Overlay>
        </Autocomplete>
      )
      const {container: elementContainer, getByRole} = render(<Element className="test-class-name" />)
      const inputNode = getByRole('combobox')
      await userEvent.click(inputNode)
      await userEvent.keyboard('{ArrowDown}')
      // overlay is a sibling of elementContainer
      expect(elementContainer.parentElement?.querySelectorAll('.test-class-name')).toHaveLength(1)
    })
  })

  describe('null context', () => {
    it('throws errors when Autocomplete context is null', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => render(<Autocomplete.Overlay />)).toThrow('AutocompleteContext returned null values')
      expect(() => render(<Autocomplete.Input />)).toThrow('AutocompleteContext returned null values')
      expect(() =>
        render(<Autocomplete.Menu items={mockItems} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />),
      ).toThrow('AutocompleteContext returned null values')

      spy.mockRestore()
    })
  })
})

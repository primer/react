import {act, render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {createRef} from 'react'
import {describe, expect, it, vi} from 'vitest'
import type {AutocompleteInputProps} from '../Autocomplete'
import Autocomplete from '../Autocomplete'
import type {AutocompleteMenuInternalProps, AutocompleteMenuItem} from '../Autocomplete/AutocompleteMenu'
import BaseStyles from '../BaseStyles'
import {implementsClassName} from '../utils/testing'
import classes from './AutocompleteOverlay.module.css'
import {AutocompleteContext} from './AutocompleteContext'

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
    implementsClassName(props => (
      <Autocomplete>
        <Autocomplete.Input {...props} />
      </Autocomplete>
    ))

    it('renders data-component attributes for Autocomplete parts when menu is shown', async () => {
      const {container} = render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )

      const input = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})
      await expect.element(input).toHaveAttribute('data-component', 'Autocomplete.Input')

      await userEvent.type(input, 'z')

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="Autocomplete.Overlay"]'))
        .toBeInTheDocument()
      await expect
        .element(container.querySelector<HTMLElement>('[data-component="Autocomplete.Menu"]'))
        .toBeInTheDocument()
    })

    it('calls onChange', async () => {
      const onChangeMock = vi.fn()
      render(
        <LabelledAutocomplete
          inputProps={{onChange: onChangeMock}}
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})
      expect(onChangeMock).not.toHaveBeenCalled()
      await userEvent.type(inputNode, 'z')
      expect(onChangeMock).toHaveBeenCalled()
    })

    it('calls onFocus', () => {
      const onFocusMock = vi.fn()
      render(
        <LabelledAutocomplete
          inputProps={{onFocus: onFocusMock}}
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      expect(onFocusMock).not.toHaveBeenCalled()
      act(() => inputNode.element().focus())
      expect(onFocusMock).toHaveBeenCalled()
    })

    it('calls onKeyDown', async () => {
      const onKeyDownMock = vi.fn()
      render(
        <LabelledAutocomplete
          inputProps={{onKeyDown: onKeyDownMock}}
          menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      expect(onKeyDownMock).not.toHaveBeenCalled()
      await userEvent.click(inputNode)
      await userEvent.keyboard('{Shift}')
      expect(onKeyDownMock).toHaveBeenCalled()
    })

    it('calls onKeyUp', async () => {
      const onKeyUpMock = vi.fn()
      render(
        <LabelledAutocomplete
          inputProps={{onKeyUp: onKeyUpMock}}
          menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      expect(onKeyUpMock).not.toHaveBeenCalled()
      await userEvent.click(inputNode)
      await userEvent.keyboard('{Shift}')
      expect(onKeyUpMock).toHaveBeenCalled()
    })

    it('calls onKeyPress', async () => {
      const onKeyPressMock = vi.fn()
      render(
        <LabelledAutocomplete
          inputProps={{onKeyPress: onKeyPressMock}}
          menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      expect(onKeyPressMock).not.toHaveBeenCalled()
      await userEvent.click(inputNode)
      await userEvent.keyboard('{Enter}')
      expect(onKeyPressMock).toHaveBeenCalled()
    })

    it('opens the menu when the input is focused and arrow key is pressed', async () => {
      render(
        <LabelledAutocomplete menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}} />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      await expect.element(inputNode).not.toHaveAttribute('aria-expanded', 'true')
      await userEvent.click(inputNode)
      await userEvent.keyboard('{ArrowDown}')
      await expect.element(inputNode).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes the menu when the input is blurred', async () => {
      render(
        <LabelledAutocomplete menuProps={{items: [], selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}} />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      await expect.element(inputNode).not.toHaveAttribute('aria-expanded', 'true')
      await userEvent.click(inputNode)
      await userEvent.keyboard('{ArrowDown}')

      await expect.element(inputNode).toHaveAttribute('aria-expanded', 'true')

      // eslint-disable-next-line github/no-blur
      act(() => inputNode.element().blur())

      await expect.element(inputNode).not.toHaveAttribute('aria-expanded', 'true')
    })

    it('sets the input value to the suggested item text and highlights the untyped part of the word', async () => {
      render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      await userEvent.type(inputNode, 'ze')
      await expect.element(inputNode).toHaveValue('zero')
    })

    it('does not show or highlight suggestion text after the user hits Backspace until they hit another key', async () => {
      render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      expect((inputNode.element() as HTMLInputElement).selectionStart).toBe(0)
      await userEvent.type(inputNode, 'ze')
      await expect.element(inputNode).toHaveValue('zero')
      expect((inputNode.element() as HTMLInputElement).selectionStart).toBe(2)
      expect((inputNode.element() as HTMLInputElement).selectionEnd).toBe(4)
      await userEvent.keyboard('{backspace}')
      expect((inputNode.element() as HTMLInputElement).selectionStart).toBe(2)
      await expect.element(inputNode).toHaveValue('ze')
      await userEvent.keyboard('r')
      expect((inputNode.element() as HTMLInputElement).selectionStart).toBe(3)
      expect((inputNode.element() as HTMLInputElement).selectionEnd).toBe(4)
      await expect.element(inputNode).toHaveValue('zero')
    })

    it('clears the input value when the user hits Escape', async () => {
      render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      await expect.element(inputNode).not.toHaveAttribute('aria-expanded', 'true')
      await userEvent.type(inputNode, 'ze')
      await expect.element(inputNode).toHaveAttribute('aria-expanded', 'true')
      await userEvent.keyboard('{escape}')
      await expect.element(inputNode).not.toHaveAttribute('aria-expanded', 'true')
    })

    it('does not restore the autocomplete suggestion when the input is blurred', async () => {
      render(
        <>
          <LabelledAutocomplete
            menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
          />
          <button type="button">outside</button>
        </>,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})
      const outsideButton = page.getByRole('button', {name: 'outside'})

      // Type 'ze' which gets the inline autocomplete suggestion 'zero'
      await userEvent.type(inputNode, 'ze')
      await expect.element(inputNode).toHaveValue('zero')

      // Move focus elsewhere on the page, like clicking outside the Autocomplete
      await userEvent.click(outsideButton)

      // The input should retain the text the user typed rather than the full suggestion
      await expect.element(inputNode).toHaveValue('ze')
    })

    it('allows the value to be 0', async () => {
      render(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], ['aria-labelledby']: 'autocompleteLabel'}}
          inputProps={{value: 0}}
        />,
      )

      await expect.element(page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})).toHaveValue('0')
    })
  })

  describe('Autocomplete.Menu', () => {
    it('only sets an active descendant while a menu rendered without an overlay is open', async () => {
      const ancestorRef = createRef<HTMLDivElement>()
      const handleAncestorKeyDown = (event: KeyboardEvent) => {
        if (!event.defaultPrevented && event.key === 'ArrowDown') {
          ancestorRef.current?.querySelector<HTMLElement>('[role="option"]')?.focus()
        }
      }

      render(
        <BaseStyles>
          <div ref={ancestorRef}>
            <label htmlFor="autocompleteInput" id="autocompleteLabel">
              Autocomplete field
            </label>
            <Autocomplete id="autocompleteId">
              <Autocomplete.Input id="autocompleteInput" />
              <Autocomplete.Menu items={mockItems} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
            </Autocomplete>
          </div>
        </BaseStyles>,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})
      ancestorRef.current?.addEventListener('keydown', handleAncestorKeyDown)

      await expect.element(inputNode).toHaveAttribute('aria-expanded', 'false')
      await expect
        .element(page.getByRole('listbox', {includeHidden: true}).element().closest<HTMLElement>('[hidden]'))
        .toBeInTheDocument()

      await userEvent.click(inputNode)
      await expect.element(inputNode).not.toHaveAttribute('aria-activedescendant')

      await userEvent.keyboard('{ArrowDown}')
      await expect.element(inputNode).toHaveFocus()
      await expect.element(inputNode).toHaveAttribute('aria-activedescendant', mockItems[0].id)
      await expect.element(page.getByRole('option', {name: mockItems[0].text})).not.toHaveFocus()

      // eslint-disable-next-line github/no-blur
      act(() => inputNode.element().blur())
      await expect.element(inputNode).not.toHaveAttribute('aria-activedescendant')
    })

    it('calls a custom filter function', async () => {
      const filterFnMock = vi.fn()
      render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            filterFn: filterFnMock,
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      await userEvent.type(inputNode, 'ze')
      expect(filterFnMock).toHaveBeenCalled()
    })

    it('calls a custom sort function when the menu closes', async () => {
      const sortOnCloseFnMock = vi.fn()
      render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            sortOnCloseFn: sortOnCloseFnMock,
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      // `sortOnCloseFnMock` will be called in a `.sort()` on render to check if the
      // current sort order matches the result of `sortOnCloseFnMock`
      expect(sortOnCloseFnMock).toHaveBeenCalledTimes(mockItems.length - 1)
      await userEvent.type(inputNode, 'ze')
      // eslint-disable-next-line github/no-blur
      act(() => inputNode.element().blur())

      // wait a tick for blur to finish
      await expect.poll(() => sortOnCloseFnMock).toHaveBeenCalled()
    })

    it("calls onOpenChange with the menu's open state", async () => {
      const onOpenChangeMock = vi.fn()
      render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            onOpenChange: onOpenChangeMock,
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      await userEvent.type(inputNode, 'ze')
      expect(onOpenChangeMock).toHaveBeenCalled()
    })

    it('calls onSelectedChange with the data for the selected items', async () => {
      const onSelectedChangeMock = vi.fn()
      render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            onSelectedChange: onSelectedChangeMock,
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      expect(onSelectedChangeMock).not.toHaveBeenCalled()
      await userEvent.click(inputNode)
      await userEvent.keyboard('{ArrowDown}{Enter}')

      expect(onSelectedChangeMock).toHaveBeenCalledWith([mockItems[0]])
    })

    it('does not close the menu when clicking an item in the menu if selectionVariant=multiple', async () => {
      render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            selectionVariant: 'multiple',
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      await expect.element(inputNode).not.toHaveAttribute('aria-expanded', 'true')
      await userEvent.click(inputNode)

      await userEvent.keyboard('{ArrowDown}')
      await expect.element(inputNode).toHaveAttribute('aria-expanded', 'true')
      await userEvent.click(page.getByRole('option', {name: mockItems[1].text, exact: true}))
      await expect.element(inputNode).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes the menu when clicking an item in the menu if selectionVariant=single', async () => {
      render(
        <LabelledAutocomplete
          menuProps={{
            items: mockItems,
            selectedItemIds: [],
            selectionVariant: 'single',
            ['aria-labelledby']: 'autocompleteLabel',
          }}
        />,
      )
      const inputNode = page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL})

      await expect.element(inputNode).not.toHaveAttribute('aria-expanded', 'true')
      await userEvent.click(inputNode)
      await userEvent.keyboard('{ArrowDown}')
      await expect.element(inputNode).toHaveAttribute('aria-expanded', 'true')
      await userEvent.click(page.getByRole('option', {name: mockItems[1].text, exact: true}))
      await expect.element(inputNode).not.toHaveAttribute('aria-expanded', 'true')
    })

    it('calls handleAddItem with new item data when passing addNewItem', async () => {
      const handleAddItemMock = vi.fn()
      render(
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

      const addNewItemNode = page.getByText('Add new item', {exact: true})

      expect(handleAddItemMock).not.toHaveBeenCalled()
      await userEvent.click(page.getByRole('combobox', {name: AUTOCOMPLETE_LABEL}))
      await userEvent.keyboard('{ArrowDown}')
      await userEvent.click(addNewItemNode)
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

    it('renders items with the `children` field', async () => {
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

      await expect.element(page.getByText('One')).toBeInTheDocument()
      await expect.element(page.getByText('Two')).toBeInTheDocument()
      await expect.element(page.getByText('Three')).toBeInTheDocument()
    })
  })
  describe('Autocomplete.Overlay', () => {
    implementsClassName(props => {
      // Create a context with showMenu set to true
      const mockContext = {
        activeDescendantRef: {current: null},
        autocompleteSuggestion: '',
        id: 'test-id',
        inputRef: {current: document.createElement('input')},
        inputValue: '',
        isMenuDirectlyActivated: false,
        scrollContainerRef: {current: null},
        selectedItemLength: 0,
        setAutocompleteSuggestion: () => {},
        setInputValue: () => {},
        setIsMenuDirectlyActivated: () => {},
        setSelectedItemLength: () => {},
        setShowMenu: () => {},
        showMenu: true, // Force the menu to show
      }

      return (
        <AutocompleteContext.Provider value={mockContext}>
          <Autocomplete.Overlay {...props}>hi</Autocomplete.Overlay>
        </AutocompleteContext.Provider>
      )
    }, classes.Overlay)
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

import {render as HTMLRender, fireEvent, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Autocomplete, {AutocompleteInputProps} from '../Autocomplete'
import {AutocompleteMenuInternalProps} from '../Autocomplete/AutocompleteMenu'
import BaseStyles from '../BaseStyles'
import theme from '../theme'
import {ThemeProvider} from '../ThemeProvider'
import {ItemProps} from '../deprecated/ActionList'
import {SSRProvider} from '../utils/ssr'
import {render} from '../utils/testing'
import {MandateProps} from '../utils/types'

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
  {text: 'twentyone', id: 21},
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AutocompleteItemProps<T = Record<string, any>> = MandateProps<ItemProps, 'id'> & {metadata?: T}

const AUTOCOMPLETE_LABEL = 'Autocomplete field'
const LabelledAutocomplete = <T extends AutocompleteItemProps>({
  inputProps = {},
  menuProps,
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
  describe('Autocomplete.Input', () => {
    it('calls onChange', async () => {
      const user = userEvent.setup()
      const onChangeMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete
          inputProps={{onChange: onChangeMock}}
          menuProps={{items: mockItems, selectedItemIds: []}}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')
      expect(onChangeMock).not.toHaveBeenCalled()
      inputNode && (await user.type(inputNode, 'z'))
      expect(onChangeMock).toHaveBeenCalled()
    })

    it('calls onFocus', () => {
      const onFocusMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete
          inputProps={{onFocus: onFocusMock}}
          menuProps={{items: mockItems, selectedItemIds: []}}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect(onFocusMock).not.toHaveBeenCalled()
      inputNode && fireEvent.focus(inputNode)
      expect(onFocusMock).toHaveBeenCalled()
    })

    it('calls onKeyDown', () => {
      const onKeyDownMock = jest.fn()
      const {getByLabelText} = HTMLRender(
        <LabelledAutocomplete inputProps={{onKeyDown: onKeyDownMock}} menuProps={{items: [], selectedItemIds: []}} />,
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyDownMock).not.toHaveBeenCalled()
      fireEvent.keyDown(inputNode, {key: 'Shift'})
      expect(onKeyDownMock).toHaveBeenCalled()
    })

    it('calls onKeyUp', () => {
      const onKeyUpMock = jest.fn()
      const {getByLabelText} = HTMLRender(
        <LabelledAutocomplete inputProps={{onKeyUp: onKeyUpMock}} menuProps={{items: [], selectedItemIds: []}} />,
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyUpMock).not.toHaveBeenCalled()
      fireEvent.keyUp(inputNode, {key: 'Shift'})
      expect(onKeyUpMock).toHaveBeenCalled()
    })

    it('calls onKeyPress', async () => {
      const user = userEvent.setup()
      const onKeyPressMock = jest.fn()
      const {getByLabelText} = HTMLRender(
        <LabelledAutocomplete inputProps={{onKeyPress: onKeyPressMock}} menuProps={{items: [], selectedItemIds: []}} />,
      )
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(onKeyPressMock).not.toHaveBeenCalled()
      await user.type(inputNode, '{enter}')
      expect(onKeyPressMock).toHaveBeenCalled()
    })

    it('opens the menu when the input is focused', () => {
      const {getByLabelText} = HTMLRender(<LabelledAutocomplete menuProps={{items: [], selectedItemIds: []}} />)
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
      fireEvent.focus(inputNode)
      expect(inputNode.getAttribute('aria-expanded')).toBe('true')
    })

    it('closes the menu when the input is blurred', async () => {
      const {getByLabelText} = HTMLRender(<LabelledAutocomplete menuProps={{items: [], selectedItemIds: []}} />)
      const inputNode = getByLabelText(AUTOCOMPLETE_LABEL)

      expect(inputNode.getAttribute('aria-expanded')).not.toBe('true')
      fireEvent.focus(inputNode)
      expect(inputNode.getAttribute('aria-expanded')).toBe('true')
      // eslint-disable-next-line github/no-blur
      fireEvent.blur(inputNode)

      // wait a tick for blur to finish
      await waitFor(() => expect(inputNode.getAttribute('aria-expanded')).not.toBe('true'))
    })

    it('sets the input value to the suggested item text and highlights the untyped part of the word', async () => {
      const user = userEvent.setup()
      const {container, getByDisplayValue} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: []}} />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && (await user.type(inputNode, 'ze'))
      expect(getByDisplayValue('zero')).toBeDefined()
    })

    it('does not show or highlight suggestion text after the user hits Backspace until they hit another key', async () => {
      const user = userEvent.setup()
      const {container, getByDisplayValue} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: []}} />,
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
      const {container} = HTMLRender(<LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: []}} />)
      const inputNode = container.querySelector('#autocompleteInput')

      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
      inputNode && (await user.type(inputNode, 'ze'))
      expect(inputNode?.getAttribute('aria-expanded')).toBe('true')
      inputNode && (await user.keyboard('{escape}'))
      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
    })

    it('allows the value to be 0', () => {
      const {getByDisplayValue} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: []}} inputProps={{value: 0}} />,
      )

      expect(getByDisplayValue('0')).toBeDefined()
    })
  })

  describe('Autocomplete.Menu', () => {
    it('calls a custom filter function', async () => {
      const user = userEvent.setup()
      const filterFnMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], filterFn: filterFnMock}} />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && (await user.type(inputNode, 'ze'))
      expect(filterFnMock).toHaveBeenCalled()
    })

    it('calls a custom sort function when the menu closes', async () => {
      const user = userEvent.setup()
      const sortOnCloseFnMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], sortOnCloseFn: sortOnCloseFnMock}} />,
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
      const onOpenChangeMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], onOpenChange: onOpenChangeMock}} />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      inputNode && (await user.type(inputNode, 'ze'))
      expect(onOpenChangeMock).toHaveBeenCalled()
    })

    it('calls onSelectedChange with the data for the selected items', async () => {
      const user = userEvent.setup()
      const onSelectedChangeMock = jest.fn()
      const {container} = HTMLRender(
        <LabelledAutocomplete
          menuProps={{items: mockItems, selectedItemIds: [], onSelectedChange: onSelectedChangeMock}}
        />,
      )
      const inputNode = container.querySelector('#autocompleteInput')

      expect(onSelectedChangeMock).not.toHaveBeenCalled()
      if (inputNode) {
        fireEvent.focus(inputNode)
        await user.type(inputNode, '{enter}')
      }

      expect(onSelectedChangeMock).toHaveBeenCalledWith([mockItems[0]])
    })

    it('does not close the menu when clicking an item in the menu if selectionVariant=multiple', async () => {
      const user = userEvent.setup()
      const {getByText, container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], selectionVariant: 'multiple'}} />,
      )
      const inputNode = container.querySelector('#autocompleteInput')
      const itemToClickNode = getByText(mockItems[1].text)

      expect(inputNode?.getAttribute('aria-expanded')).not.toBe('true')
      inputNode && fireEvent.focus(inputNode)
      expect(inputNode?.getAttribute('aria-expanded')).toBe('true')
      fireEvent.click(itemToClickNode)
      inputNode && (await user.type(inputNode, '{enter}'))
      expect(inputNode?.getAttribute('aria-expanded')).toBe('true')
    })

    it('closes the menu when clicking an item in the menu if selectionVariant=single', () => {
      const {getByText, container} = HTMLRender(
        <LabelledAutocomplete menuProps={{items: mockItems, selectedItemIds: [], selectionVariant: 'single'}} />,
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
              handleAddItem: handleAddItemMock,
            },
          }}
        />,
      )

      const addNewItemNode = getByText('Add new item')

      expect(handleAddItemMock).not.toHaveBeenCalled()
      fireEvent.click(addNewItemNode)
      expect(handleAddItemMock).toHaveBeenCalled()
    })
  })

  describe('null context', () => {
    it('throws errors when Autocomplete context is null', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => HTMLRender(<Autocomplete.Overlay />)).toThrow('AutocompleteContext returned null values')
      expect(() => HTMLRender(<Autocomplete.Input />)).toThrow('AutocompleteContext returned null values')
      expect(() => HTMLRender(<Autocomplete.Menu items={mockItems} selectedItemIds={[]} />)).toThrow(
        'AutocompleteContext returned null values',
      )

      spy.mockRestore()
    })
  })
})

describe('snapshots', () => {
  it('renders a single select input', () => {
    expect(
      render(
        <SSRProvider>
          <Autocomplete id="autocompleteId">
            <Autocomplete.Input />
            <Autocomplete.Menu aria-labelledby="labelId" items={mockItems} selectedItemIds={[]} />
          </Autocomplete>
        </SSRProvider>,
      ),
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
        </SSRProvider>,
      ),
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
        </SSRProvider>,
      ),
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
                handleAddItem: handleAddItemMock,
              }}
            />
          </Autocomplete>
        </SSRProvider>,
      ),
    ).toMatchSnapshot()
  })

  it('renders a custom empty state message', () => {
    expect(
      render(
        <SSRProvider>
          <Autocomplete id="autocompleteId">
            <Autocomplete.Input />
            <Autocomplete.Menu aria-labelledby="labelId" items={[]} selectedItemIds={[]} emptyStateText="No results" />
          </Autocomplete>
        </SSRProvider>,
      ),
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
        </SSRProvider>,
      ),
    ).toMatchSnapshot()
  })

  it('renders with a custom text input component', () => {
    const CustomInput = React.forwardRef<HTMLInputElement>(function CustomInput(_props, ref) {
      return <input ref={ref} type="text" id="customInput" />
    })

    expect(
      render(
        <SSRProvider>
          <Autocomplete id="autocompleteId">
            <Autocomplete.Input as={CustomInput} />
            <Autocomplete.Menu aria-labelledby="labelId" items={mockItems} selectedItemIds={[]} />
          </Autocomplete>
        </SSRProvider>,
      ),
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
        </SSRProvider>,
      ),
    ).toMatchSnapshot()
  })
})

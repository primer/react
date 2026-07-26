import type {Meta, StoryObj} from '@storybook/react-vite'
import {type ReactNode, useRef, useState} from 'react'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {FormControl} from '../FormControl'
import {Stack} from '../Stack'
import {Autocomplete} from './Autocomplete'

const items = ['css', 'css-in-js', 'styled-system', 'javascript', 'typescript', 'react', 'design-systems']

function FeatureDecorator({children}: {children: ReactNode}) {
  const [lastKey, setLastKey] = useState('none')
  return (
    <div onKeyDownCapture={event => setLastKey(event.key)}>
      <p className="absolute top-2 right-8">Last key pressed: {lastKey}</p>
      <div className="pt-8">{children}</div>
    </div>
  )
}

const meta = {
  title: 'React Tailwind/Components/Autocomplete/Features',
  component: Autocomplete,
  decorators: [
    Story => (
      <FeatureDecorator>
        <Story />
      </FeatureDecorator>
    ),
  ],
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

function FruitAutocomplete({
  id,
  mode = 'list',
  persistSelection = false,
  placeholder,
}: {
  id?: string
  mode?: 'list' | 'both'
  persistSelection?: boolean
  placeholder?: string
}) {
  const [value, setValue] = useState('')
  const highlightedValue = useRef<string | undefined>(undefined)

  return (
    <Autocomplete
      items={items}
      mode={mode}
      value={persistSelection ? value : undefined}
      onValueChange={persistSelection ? setValue : undefined}
      onItemHighlighted={
        persistSelection
          ? nextHighlightedValue => {
              highlightedValue.current = nextHighlightedValue
            }
          : undefined
      }
      onOpenChange={
        persistSelection
          ? isOpen => {
              if (!isOpen && highlightedValue.current) setValue(highlightedValue.current)
            }
          : undefined
      }
    >
      <Autocomplete.Input id={id ?? 'autocomplete-input'} placeholder={placeholder} />
      <Autocomplete.Content>
        <Autocomplete.List>
          {(item: string) => (
            <Autocomplete.Item key={item} value={item}>
              {item}
            </Autocomplete.Item>
          )}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>
  )
}

function FieldFixture({
  caption,
  children,
  label = 'Default label',
}: {
  caption?: ReactNode
  children: ReactNode
  label?: ReactNode
}) {
  return (
    <form className="p-4">
      <FormControl>
        <FormControl.Label htmlFor="autocomplete-input">{label}</FormControl.Label>
        {children}
        {caption ? <FormControl.Caption>{caption}</FormControl.Caption> : null}
      </FormControl>
    </form>
  )
}

export const WithTokenInput: Story = {
  render: () => (
    <FieldFixture>
      <FruitAutocomplete mode="both" />
    </FieldFixture>
  ),
}

export const AddNewItem: Story = {
  render: () => (
    <FieldFixture label="Label">
      <Autocomplete items={items}>
        <Autocomplete.Input id="autocomplete-input" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(item: string) => (
              <Autocomplete.Item key={item} value={item}>
                {item}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
          <Autocomplete.Empty className="border-t border-default p-2 text-sm text-muted">
            Add new item
          </Autocomplete.Empty>
        </Autocomplete.Content>
      </Autocomplete>
    </FieldFixture>
  ),
}

export const CustomSearchFilterFn: Story = {
  render: () => (
    <FieldFixture caption="Items in dropdown are filtered if their text has no part that matches the input value">
      <FruitAutocomplete />
    </FieldFixture>
  ),
}

export const CustomSortAfterMenuClose: Story = {
  render: () => (
    <FieldFixture caption="When the dropdown closes, selected items are sorted to the end">
      <FruitAutocomplete mode="both" persistSelection />
    </FieldFixture>
  ),
}

export const WithCallbackWhenOverlayOpenStateChanges: Story = {
  render: function OpenStateStory() {
    const [open, setOpen] = useState(false)
    return (
      <Stack as="form" padding="normal">
        <div className="inline-flex items-end gap-6">
          <FormControl>
            <FormControl.Label htmlFor="autocomplete-input">Default label</FormControl.Label>
            <Autocomplete items={items} onOpenChange={setOpen}>
              <Autocomplete.Input id="autocomplete-input" />
              <Autocomplete.Content>
                <Autocomplete.List>
                  {(item: string) => <Autocomplete.Item value={item}>{item}</Autocomplete.Item>}
                </Autocomplete.List>
              </Autocomplete.Content>
            </Autocomplete>
          </FormControl>
          <div className="mb-1 whitespace-nowrap">
            The menu is <strong>{open ? 'open' : 'closed'}</strong>
          </div>
        </div>
      </Stack>
    )
  },
}

export const AsyncLoadingOfItems: Story = {
  render: () => (
    <FieldFixture>
      <Autocomplete items={[]}>
        <Autocomplete.Input id="autocomplete-input" />
        <Autocomplete.Content>
          <Autocomplete.List>{() => <Autocomplete.Item value="loading">Loading</Autocomplete.Item>}</Autocomplete.List>
          <Autocomplete.Status>Loading items…</Autocomplete.Status>
        </Autocomplete.Content>
      </Autocomplete>
    </FieldFixture>
  ),
}

export const RenderingTheMenuOutsideAnOverlay: Story = {
  render: () => (
    <FieldFixture>
      <FruitAutocomplete />
    </FieldFixture>
  ),
}

export const CustomOverlayMenuAnchor: Story = {
  render: () => (
    <FieldFixture caption="The overlay menu position is anchored to the div with the black border instead of to the text input">
      <div className="flex grow basis-1/4 items-center border border-default p-4">
        <FruitAutocomplete />
      </div>
    </FieldFixture>
  ),
}

export const InOverlayWithCustomScrollContainerRef: Story = {
  render: () => (
    <form className="p-4">
      <span id="selected-item-status">Selected item: none</span>
      <div>
        <Button aria-describedby="selected-item-status">open overlay</Button>
      </div>
    </form>
  ),
}

export const InADialog: Story = {
  render: () => (
    <>
      <Dialog>
        <Dialog.Trigger render={<Button>Show dialog</Button>} />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog with autocomplete</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <FieldFixture>
              <FruitAutocomplete />
            </FieldFixture>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>
      <p>
        The Autocomplete.Overlay is portalled to a div inside the Dialog to ensure it appears above the dialog in the
        stacking context.
      </p>
    </>
  ),
}

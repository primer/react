import {act, render, waitFor} from '@testing-library/react'
import {describe, expect, it, beforeEach, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import React from 'react'
import {SelectPanel, type SelectPanelProps, type ItemInput, type GroupedListProps} from '../SelectPanel'
import {FeatureFlags} from '../FeatureFlags'
import type {InitialLoadingType} from './SelectPanel'
import type {LiveRegionElement} from '@primer/live-region-element'
import {Button, IconButton} from '../Button'
import {Tooltip} from '../TooltipV2'
import {ArrowLeftIcon} from '@primer/octicons-react'
import classes from './SelectPanel.test.module.css'
import {implementsClassName} from '../utils/testing'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition} from '@primer/behaviors'
import {createRenderCounter} from '../utils/testing/profiler'

// Mock getAnchoredPosition to verify displayInViewport is forwarded
vi.mock('@primer/behaviors', async () => {
  const actual = await vi.importActual('@primer/behaviors')
  return {
    ...actual,
    getAnchoredPosition: vi.fn(
      (
        _floatingElement: Element,
        _anchorElement: Element | DOMRect,
        _settings?: Partial<{displayInViewport?: boolean}>,
      ) =>
        ({
          top: 100,
          left: 100,
          anchorSide: 'outside-bottom',
          anchorAlign: 'start',
        }) as AnchorPosition,
    ),
  }
})

// Instead of importing from live-region/__tests__/test-helpers.ts, we define our own getLiveRegion function
export function getLiveRegion(): LiveRegionElement {
  const liveRegion = document.querySelector<HTMLElement>('live-region')
  if (liveRegion) {
    return liveRegion as LiveRegionElement
  }
  throw new Error('No live-region found')
}

const getFocusManagement = (flag?: boolean) => {
  // true = 'use roving tabindex'
  // false = 'use aria-activedescendant'
  return flag ? 'roving-tabindex' : 'active-descendant'
}

const renderWithProp = (element: React.ReactElement, flag?: boolean) => {
  return render(React.cloneElement(element, {_PrivateFocusManagement: getFocusManagement(flag)}))
}

const items: SelectPanelProps['items'] = [
  {
    text: 'item one',
  },
  {
    text: 'item two',
  },
  {
    text: 'item three',
  },
]

function BasicSelectPanel(passthroughProps: Record<string, unknown>) {
  const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
  const [filter, setFilter] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const onSelectedChange = (selected: SelectPanelProps['items']) => {
    setSelected(selected)
  }

  return (
    <SelectPanel
      title="test title"
      subtitle="test subtitle"
      items={items}
      placeholder="Select items"
      placeholderText="Filter items"
      selected={selected}
      onSelectedChange={onSelectedChange}
      filterValue={filter}
      onFilterChange={value => {
        setFilter(value)
      }}
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
      }}
      {...passthroughProps}
    />
  )
}

globalThis.Element.prototype.scrollTo = vi.fn()

describe('SelectPanel renderAnchor context', () => {
  it('forwards the unchanged object ref so a tooltip can compose with its trigger', async () => {
    const anchorRef = React.createRef<HTMLElement>()
    const renderAnchor = vi.fn<NonNullable<SelectPanelProps['renderAnchor']>>((props, context) => (
      <Tooltip
        ref={context?.ref}
        text="Choose items"
        renderAnchor={tooltipProps => (
          <Button {...props} {...tooltipProps}>
            Select items
          </Button>
        )}
      />
    ))
    const {unmount} = render(<BasicSelectPanel anchorRef={anchorRef} renderAnchor={renderAnchor} />)
    const button = page.getByRole('button', {name: 'Select items', exact: true})
    expect(renderAnchor.mock.calls[0][1]?.ref).toBe(anchorRef)
    expect(anchorRef.current).toBe(button.element())
    const description = button.element().getAttribute('aria-describedby')
    expect(document.getElementById(description ?? '')).toHaveTextContent('Choose items')
    expect(document.querySelectorAll('button')).toHaveLength(1)
    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    await expect.element(button).toHaveAttribute('aria-expanded', 'false')
    await expect.element(button).toHaveFocus()
    unmount()
    expect(anchorRef.current).toBeNull()
  })
})

describe('SelectPanel state synchronization', () => {
  const synchronizedItems: ItemInput[] = [
    {id: 'one', text: 'item one'},
    {id: 'two', text: 'item two'},
    {id: 'three', text: 'item three'},
  ]
  const selectedItems = [synchronizedItems[1]]

  function MultiSelectPanel({
    items: panelItems,
    loading,
    onOpenChange = () => {},
    open,
  }: {
    items: ItemInput[]
    loading?: boolean
    onOpenChange?: SelectPanelProps['onOpenChange']
    open: boolean
  }) {
    return (
      <SelectPanel
        title="test title"
        items={panelItems}
        placeholder="Select items"
        placeholderText="Filter items"
        selected={selectedItems}
        onSelectedChange={() => {}}
        onFilterChange={() => {}}
        loading={loading}
        open={open}
        onOpenChange={onOpenChange}
      />
    )
  }

  function SingleSelectModal({
    onSelectedChange = () => {},
    open,
    selected,
  }: {
    onSelectedChange?: (selected: ItemInput | undefined) => void
    open: boolean
    selected: ItemInput | undefined
  }) {
    return (
      <SelectPanel
        title="test title"
        items={synchronizedItems}
        placeholder="Select an item"
        placeholderText="Filter items"
        selected={selected}
        onSelectedChange={onSelectedChange}
        onFilterChange={() => {}}
        open={open}
        onOpenChange={() => {}}
        variant="modal"
        onCancel={() => {}}
      />
    )
  }

  it('does not commit a follow-up update when mounted closed with preloaded items', async () => {
    const [Wrap, counter] = createRenderCounter()

    render(
      <Wrap>
        <MultiSelectPanel items={synchronizedItems} open={false} />
      </Wrap>,
    )
    await act(async () => {})

    expect(counter.mountCount).toBe(1)
    expect(counter.updateCount).toBe(0)
  })

  it('orders the selected item in the opening commit and focuses the filter input', async () => {
    const committedOrders: string[][] = []
    const recordOrder = () => {
      const order = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'), option =>
        option.textContent.trim(),
      )

      if (order.length > 0) {
        committedOrders.push(order)
      }
    }
    const renderPanel = (open: boolean) => (
      <React.Profiler id="select-panel-open" onRender={recordOrder}>
        <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
          <MultiSelectPanel items={synchronizedItems} open={open} />
        </FeatureFlags>
      </React.Profiler>
    )
    const {rerender} = render(renderPanel(false))

    await act(async () => {})
    committedOrders.length = 0
    rerender(renderPanel(true))
    await act(async () => {})

    expect(committedOrders.length).toBeGreaterThan(0)
    expect(committedOrders.every(order => order[0] === 'item two')).toBe(true)
    await expect.element(page.getByLabelText('Filter items')).toHaveFocus()
  })

  it('commits item arrival once while closed', async () => {
    const [Wrap, counter] = createRenderCounter()
    const renderPanel = (panelItems: ItemInput[]) => (
      <Wrap>
        <MultiSelectPanel items={panelItems} open={false} />
      </Wrap>
    )
    const {rerender} = render(renderPanel([]))

    await act(async () => {})
    counter.reset()
    rerender(renderPanel(synchronizedItems))
    await act(async () => {})

    expect(counter.updateCount).toBe(1)
    expect(counter.nestedUpdateCount).toBe(0)
  })

  it('orders arriving items without replacing or blurring the filter input', async () => {
    const committedOrders: string[][] = []
    const recordOrder = () => {
      const order = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'), option =>
        option.textContent.trim(),
      )

      if (order.length > 0) {
        committedOrders.push(order)
      }
    }
    const renderPanel = (panelItems: ItemInput[]) => (
      <React.Profiler id="select-panel-items" onRender={recordOrder}>
        <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
          <MultiSelectPanel items={panelItems} loading={false} open />
        </FeatureFlags>
      </React.Profiler>
    )
    const {rerender} = render(renderPanel([]))

    const input = page.getByLabelText('Filter items')
    await expect.element(input).toHaveFocus()
    const inputElement = input.element()
    committedOrders.length = 0
    rerender(renderPanel(synchronizedItems))
    await act(async () => {})

    expect(committedOrders.length).toBeGreaterThan(0)
    expect(committedOrders.every(order => order[0] === 'item two')).toBe(true)
    expect(page.getByLabelText('Filter items').element()).toBe(inputElement)
    await expect.element(input).toHaveFocus()
  })

  it('commits a controlled modal selection change once while closed', async () => {
    const [Wrap, counter] = createRenderCounter()
    const renderPanel = (selected: ItemInput) => (
      <Wrap>
        <SingleSelectModal open={false} selected={selected} />
      </Wrap>
    )
    const {rerender} = render(renderPanel(synchronizedItems[0]))

    await act(async () => {})
    counter.reset()
    rerender(renderPanel(synchronizedItems[1]))
    await act(async () => {})

    expect(counter.updateCount).toBe(1)
    expect(counter.nestedUpdateCount).toBe(0)
  })

  it('resets modal intermediate selection across close and controlled selection changes', async () => {
    const onSelectedChange = vi.fn()
    const renderPanel = (open: boolean, selected: ItemInput) => (
      <SingleSelectModal onSelectedChange={onSelectedChange} open={open} selected={selected} />
    )
    const {rerender} = render(renderPanel(true, synchronizedItems[0]))

    await expect.element(page.getByLabelText('Filter items')).toHaveFocus()
    await userEvent.click(page.getByRole('option', {name: 'item two'}))
    await expect.element(page.getByRole('option', {name: 'item two'})).toHaveAttribute('aria-selected', 'true')
    expect(onSelectedChange).not.toHaveBeenCalled()

    rerender(renderPanel(false, synchronizedItems[0]))
    rerender(renderPanel(true, synchronizedItems[0]))
    await expect.element(page.getByLabelText('Filter items')).toHaveFocus()
    await expect.element(page.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'true')

    const input = page.getByLabelText('Filter items')
    const inputElement = input.element()
    rerender(renderPanel(true, synchronizedItems[2]))
    await expect.element(page.getByRole('option', {name: 'item three'})).toHaveAttribute('aria-selected', 'true')
    expect(page.getByLabelText('Filter items').element()).toBe(inputElement)
    await expect.element(input).toHaveFocus()

    await userEvent.click(page.getByRole('button', {name: 'Save'}))
    expect(onSelectedChange).toHaveBeenCalledWith(synchronizedItems[2])
  })

  it('announces internally managed loading when opened', async () => {
    vi.useFakeTimers()
    for (const element of document.querySelectorAll('live-region')) {
      element.remove()
    }
    const liveRegion = document.createElement('live-region') as LiveRegionElement
    document.body.appendChild(liveRegion)

    try {
      function LoadingPanel() {
        const [open, setOpen] = React.useState(false)
        return <MultiSelectPanel items={[]} open={open} onOpenChange={setOpen} />
      }

      render(<LoadingPanel />)
      await userEvent.click(page.getByRole('button', {name: 'item two'}))
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(liveRegion.getMessage('polite')).toBe('Loading.')
    } finally {
      vi.useRealTimers()
    }
  })
})

for (const usingRemoveActiveDescendant of [false, true]) {
  describe('SelectPanel', () => {
    implementsClassName(props => <BasicSelectPanel open {...props} />, classes.FilteredActionList)
    it('should render an anchor to open the select panel using `placeholder`', async () => {
      renderWithProp(<BasicSelectPanel />)

      await expect.element(page.getByText('Select items', {exact: true})).toBeInTheDocument()

      const trigger = page.getByRole('button', {
        name: 'Select items',
      })
      await expect.element(trigger).toHaveAttribute('aria-haspopup', 'true')
      await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('should call onActiveDescendantChanged when using keyboard while focusing on an item', async () => {
      // jest function
      const onActiveDescendantChanged = vi.fn()

      render(<BasicSelectPanel onActiveDescendantChanged={onActiveDescendantChanged} />)

      await userEvent.click(page.getByText('Select items', {exact: true}))

      await userEvent.keyboard('{ArrowDown}')
      expect(onActiveDescendantChanged).toHaveBeenCalled()
    })

    it('should open the select panel when activating the trigger', async () => {
      renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

      await userEvent.click(page.getByText('Select items', {exact: true}))

      // Verify that the button has `aria-expanded="true"` after opening
      const trigger = page.getByRole('button', {
        name: 'Select items',
      })
      await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')

      // Verify that the input and listbox are in the document
      await expect.element(page.getByPlaceholder('Filter items')).toBeInTheDocument()
      await expect.element(page.getByRole('listbox')).toBeInTheDocument()

      // The input box must have focus
      expect(document.activeElement?.tagName.toLowerCase()).toBe('input')
    })

    it('should close the select panel when pressing Escape', async () => {
      renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

      await userEvent.click(page.getByText('Select items', {exact: true}))
      await userEvent.keyboard('{Escape}')

      await expect.element(page.getByRole('button', {name: 'Select items'})).toHaveFocus()
      await expect.element(page.getByRole('button', {name: 'Select items'})).toHaveAttribute('aria-expanded', 'false')
    })

    it('should close the select panel when clicking outside of the select panel', async () => {
      render(
        <>
          <button type="button">outer button</button>
          <BasicSelectPanel _PrivateFocusManagement={getFocusManagement(usingRemoveActiveDescendant)} />
        </>,
      )

      await userEvent.click(page.getByText('Select items', {exact: true}))
      await userEvent.click(page.getByText('outer button', {exact: true}))

      await expect.element(page.getByRole('button', {name: 'Select items'})).toHaveAttribute('aria-expanded', 'false')
    })

    it('should open a dialog that is labelled by `title` and described by `subtitle`', async () => {
      renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

      await userEvent.click(page.getByText('Select items', {exact: true}))

      await expect
        .element(
          page.getByRole('dialog', {
            name: 'test title',
          }),
        )
        .toBeInTheDocument()
      await expect.element(page.getByRole('dialog', {name: 'test title'})).toHaveAccessibleDescription('test subtitle')
    })

    it('should call `onOpenChange` when opening and closing the dialog', async () => {
      const onOpenChange = vi.fn()

      function SelectPanelOpenChange() {
        const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
        const [filter, setFilter] = React.useState('')
        const [open, setOpen] = React.useState(false)

        const onSelectedChange = (selected: SelectPanelProps['items']) => {
          setSelected(selected)
        }

        return (
          <>
            <button type="button">Outside of select panel</button>
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              items={items}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={onSelectedChange}
              filterValue={filter}
              onFilterChange={value => {
                setFilter(value)
              }}
              open={open}
              onOpenChange={(...args) => {
                onOpenChange(...args)
                setOpen(args[0])
              }}
            />
          </>
        )
      }

      renderWithProp(<SelectPanelOpenChange />, usingRemoveActiveDescendant)

      // Open by click
      await userEvent.click(page.getByText('Select items', {exact: true}))
      expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-click')

      // Close by click on anchor
      await userEvent.click(page.getByText('Select items', {exact: true}))
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'anchor-click')

      // Open by button activation
      // RTL's type() clicked the target before typing.
      await userEvent.click(page.getByText('Select items', {exact: true}))
      await userEvent.keyboard('{Space}')
      expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-click')

      // Close by Escape key
      await userEvent.keyboard('{Escape}')
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'escape')

      // Close by click outside
      await userEvent.click(page.getByText('Select items', {exact: true}))
      await userEvent.click(page.getByText('Outside of select panel', {exact: true}))
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'click-outside')
    })

    it('should label the list by title unless a aria-label is explicitly passed', async () => {
      renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)
      await userEvent.click(page.getByText('Select items', {exact: true}))
      await expect.element(page.getByRole('listbox', {name: 'test title'})).toBeInTheDocument()
    })

    it('should label the list by aria-label when explicitly passed', async () => {
      renderWithProp(<BasicSelectPanel aria-label="Custom label" />, usingRemoveActiveDescendant)
      await userEvent.click(page.getByText('Select items', {exact: true}))
      await expect.element(page.getByRole('listbox', {name: 'Custom label'})).toBeInTheDocument()
    })

    it('should focus the filter input on open', async () => {
      // This panel contains another focusable thing (the IconButton) that should not receive focus
      // when the panel opens.
      renderWithProp(
        <SelectPanel
          onOpenChange={() => {}}
          onFilterChange={() => {}}
          onSelectedChange={() => {}}
          open={true}
          items={items}
          selected={[]}
          placeholder="Select items"
          placeholderText="Filter items"
          title={
            <div className={classes.Title}>
              <IconButton icon={ArrowLeftIcon} aria-label="Back" />
              <span>Title</span>
            </div>
          }
        />,
        usingRemoveActiveDescendant,
      )

      await userEvent.click(page.getByText('Select items', {exact: true}))
      await expect.element(page.getByLabelText('Filter items')).toHaveFocus()
    })

    describe('selection', () => {
      it('should select an active option when activated', async () => {
        renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await userEvent.keyboard('{Enter}')
        await expect
          .element(
            page.getByRole('option', {
              name: 'item one',
            }),
          )
          .toHaveAttribute('aria-selected', 'true')

        await userEvent.keyboard('{Enter}')
        await expect
          .element(
            page.getByRole('option', {
              name: 'item one',
            }),
          )
          .toHaveAttribute('aria-selected', 'false')

        await userEvent.click(page.getByText('item one', {exact: true}))
        await expect
          .element(
            page.getByRole('option', {
              name: 'item one',
            }),
          )
          .toHaveAttribute('aria-selected', 'true')

        await userEvent.click(page.getByRole('option', {name: 'item one'}))
        await expect
          .element(
            page.getByRole('option', {
              name: 'item one',
            }),
          )
          .toHaveAttribute('aria-selected', 'false')
      })

      it('should support navigating through items with ArrowUp and ArrowDown', async () => {
        renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        if (usingRemoveActiveDescendant) {
          await expect.element(page.elementLocator(document.activeElement!)).toHaveAttribute('role', 'combobox')

          await userEvent.keyboard('{ArrowDown}')
          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item one')

          await userEvent.keyboard('{ArrowDown}')
          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item two')

          await userEvent.keyboard('{ArrowDown}')
          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item three')

          // At end of list, should wrap to the beginning
          await userEvent.keyboard('{ArrowDown}')
          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item one')

          // At beginning of list, ArrowUp should wrap to the end
          await userEvent.keyboard('{ArrowUp}')
          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item three')

          await userEvent.keyboard('{ArrowUp}')
          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item two')

          await userEvent.keyboard('{ArrowUp}')
          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item one')
        } else {
          // First item by default should be the active element
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item one'}).element().id)

          await userEvent.keyboard('{ArrowDown}')
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item two'}).element().id)

          await userEvent.keyboard('{ArrowDown}')
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item three'}).element().id)

          // At end of list, should wrap to the beginning
          await userEvent.keyboard('{ArrowDown}')
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item one'}).element().id)

          // At beginning of list, ArrowUp should wrap to the end
          await userEvent.keyboard('{ArrowUp}')
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item three'}).element().id)

          await userEvent.keyboard('{ArrowUp}')
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item two'}).element().id)

          await userEvent.keyboard('{ArrowUp}')
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item one'}).element().id)
        }
      })

      it('should support navigating through items with PageDown and PageUp', async () => {
        renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        if (usingRemoveActiveDescendant) {
          await userEvent.keyboard('{ArrowDown}')

          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item one')

          await userEvent.keyboard('{PageDown}')

          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item three')

          await userEvent.keyboard('{PageUp}')

          await expect.element(page.elementLocator(document.activeElement!)).toHaveAccessibleName('item one')
        } else {
          // First item by default should be the active element
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item one'}).element().id)

          await userEvent.keyboard('{PageDown}')

          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item three'}).element().id)

          await userEvent.keyboard('{PageUp}')
          await expect
            .element(page.elementLocator(document.activeElement!))
            .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'item one'}).element().id)
        }
      })

      it('should select an item (by item.id) even when items are defined in the component', async () => {
        function Fixture() {
          // items are defined in the same scope as selection, so they could rerender and create new object references
          // We use item.id to track selection
          const items: SelectPanelProps['items'] = [
            {id: 'one', text: 'item one'},
            {id: 'two', text: 'item two'},
            {id: 'three', text: 'item three'},
          ]

          const [open, setOpen] = React.useState(false)
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')

          return (
            <SelectPanel
              title="test title"
              items={items}
              placeholder="Select items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
            />
          )
        }

        renderWithProp(<Fixture />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await userEvent.click(page.getByText('item one', {exact: true}))
        await expect.element(page.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'true')

        await userEvent.click(page.getByText('item two', {exact: true}))
        await expect.element(page.getByRole('option', {name: 'item two'})).toHaveAttribute('aria-selected', 'true')

        await userEvent.click(page.getByRole('option', {name: 'item one'}))
        await expect.element(page.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'false')
      })
    })

    function FilterableSelectPanel({textInputProps}: Pick<SelectPanelProps, 'textInputProps'>) {
      const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
      const [filter, setFilter] = React.useState('')
      const [open, setOpen] = React.useState(false)

      const onSelectedChange = (selected: SelectPanelProps['items']) => {
        setSelected(selected)
      }

      return (
        <SelectPanel
          title="test title"
          subtitle="test subtitle"
          items={items.filter(item => item.text?.includes(filter))}
          placeholder="Select items"
          placeholderText="Filter items"
          textInputProps={textInputProps}
          selected={selected}
          onSelectedChange={onSelectedChange}
          filterValue={filter}
          onFilterChange={value => {
            setFilter(value)
          }}
          open={open}
          onOpenChange={isOpen => {
            setOpen(isOpen)
          }}
          _PrivateFocusManagement={usingRemoveActiveDescendant ? 'roving-tabindex' : 'active-descendant'}
        />
      )
    }

    const SelectPanelWithCustomMessages: React.FC<{
      items: SelectPanelProps['items']
      withAction?: boolean
      onAction?: () => void
    }> = ({items, withAction = false, onAction}) => {
      const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
      const [filter, setFilter] = React.useState('')
      const [open, setOpen] = React.useState(false)

      const onSelectedChange = (selected: SelectPanelProps['items']) => {
        setSelected(selected)
      }

      const emptyMessage = {
        variant: 'empty' as const,
        title: "You haven't created any projects yet",
        body: 'Start your first project to organise your issues',
        ...(withAction && {
          action: (
            <button type="button" onClick={onAction} data-testid="create-project-action">
              Create new project
            </button>
          ),
        }),
      }

      const noResultsMessage = (filter: string) => ({
        variant: 'empty' as const,
        title: `No language found for ${filter}`,
        body: 'Adjust your search term to find other languages',
      })

      const filteredItems = items.filter(item => item.text?.includes(filter))

      function getMessage() {
        if (filteredItems.length === 0 && !filter) {
          return emptyMessage
        }
        if (filteredItems.length === 0 && filter) {
          return noResultsMessage(filter)
        }
        return undefined
      }

      return (
        <SelectPanel
          title="test title"
          subtitle="test subtitle"
          items={filteredItems}
          placeholder="Select items"
          placeholderText="Filter items"
          selected={selected}
          onSelectedChange={onSelectedChange}
          filterValue={filter}
          onFilterChange={value => {
            setFilter(value)
          }}
          open={open}
          onOpenChange={isOpen => {
            setOpen(isOpen)
          }}
          message={getMessage()}
        />
      )
    }

    function NoItemAvailableSelectPanel() {
      const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
      const [filter, setFilter] = React.useState('')
      const [open, setOpen] = React.useState(false)

      const onSelectedChange = (selected: SelectPanelProps['items']) => {
        setSelected(selected)
      }

      const items: SelectPanelProps['items'] = []

      return (
        <SelectPanel
          title="test title"
          subtitle="test subtitle"
          items={items.filter(item => item.text?.includes(filter))}
          placeholder="Select items"
          placeholderText="Filter items"
          selected={selected}
          onSelectedChange={onSelectedChange}
          filterValue={filter}
          onFilterChange={value => {
            setFilter(value)
          }}
          open={open}
          onOpenChange={isOpen => {
            setOpen(isOpen)
          }}
        />
      )
    }

    describe('filtering', () => {
      it('should filter the list of items when the user types into the input', async () => {
        renderWithProp(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        expect(page.getByRole('option').elements()).toHaveLength(3)

        await userEvent.type(page.getByRole('combobox'), 'two')
        expect(page.getByRole('option').elements()).toHaveLength(1)
      })
    })

    describe.each([
      {name: 'absent', flags: {}, contrast: false},
      {name: 'false', flags: {primer_react_select_panel_legacy_contrast: false}, contrast: false},
      {name: 'true', flags: {primer_react_select_panel_legacy_contrast: true}, contrast: true},
    ])('legacy contrast flag $name', ({flags, contrast}) => {
      it('should set the default background without changing filtering or focus', async () => {
        render(
          <FeatureFlags flags={flags}>
            <FilterableSelectPanel />
          </FeatureFlags>,
        )

        await userEvent.click(page.getByRole('button', {name: 'Select items'}))

        const input = page.getByLabelText('Filter items')
        const wrapper = input.element().closest<HTMLElement>('[data-component="TextInput"]')
        if (!wrapper) {
          throw new Error('Expected a TextInput wrapper')
        }
        await expect.element(wrapper).toBeInTheDocument()
        expect(wrapper.hasAttribute('data-contrast')).toBe(contrast)
        await expect.element(input).toBeEnabled()
        await expect.element(input).toHaveFocus()

        await userEvent.type(input, 'two')
        await expect.element(input).toHaveValue('two')
        expect(page.getByRole('option').elements()).toHaveLength(1)
        await expect.element(page.getByRole('option', {name: 'item two'})).toBeInTheDocument()

        await userEvent.keyboard('{Escape}')
        await expect.element(input).not.toBeInTheDocument()
        await expect.element(page.getByRole('button', {name: 'Select items'})).toHaveFocus()
      })

      it.each([true, false, undefined])('should preserve explicit contrast=%s', async explicitContrast => {
        render(
          <FeatureFlags flags={flags}>
            <FilterableSelectPanel textInputProps={{contrast: explicitContrast}} />
          </FeatureFlags>,
        )

        await userEvent.click(page.getByRole('button', {name: 'Select items'}))

        const input = page.getByLabelText('Filter items')
        const wrapper = input.element().closest<HTMLElement>('[data-component="TextInput"]')
        if (!wrapper) {
          throw new Error('Expected a TextInput wrapper')
        }
        await expect.element(wrapper).toBeInTheDocument()
        expect(wrapper.hasAttribute('data-contrast')).toBe(explicitContrast === true)
        await expect.element(input).toBeEnabled()
        await expect.element(input).toHaveFocus()
        await userEvent.type(input, 'two')
        await expect.element(input).toHaveValue('two')
        await expect.element(page.getByRole('option', {name: 'item two'})).toBeInTheDocument()
      })
    })

    it('should update contrast with the flag while preserving the input, filter, and focus', async () => {
      const textInputProps = {'aria-label': 'Search items'}
      const panel = <FilterableSelectPanel textInputProps={textInputProps} />
      const {rerender} = render(
        <FeatureFlags flags={{primer_react_select_panel_legacy_contrast: false}}>{panel}</FeatureFlags>,
      )

      await userEvent.click(page.getByRole('button', {name: 'Select items'}))
      const input = page.getByLabelText('Search items')
      const inputElement = input.element()
      const wrapper = inputElement.closest<HTMLElement>('[data-component="TextInput"]')
      if (!wrapper) {
        throw new Error('Expected a TextInput wrapper')
      }
      await expect.element(wrapper).toBeInTheDocument()
      expect(wrapper.hasAttribute('data-contrast')).toBe(false)
      await userEvent.type(input, 'two')

      for (const legacyContrast of [true, false]) {
        rerender(
          <FeatureFlags flags={{primer_react_select_panel_legacy_contrast: legacyContrast}}>{panel}</FeatureFlags>,
        )

        expect(page.getByLabelText('Search items').element()).toBe(inputElement)
        expect(wrapper.hasAttribute('data-contrast')).toBe(legacyContrast)
        await expect.element(input).toBeEnabled()
        await expect.element(input).toHaveValue('two')
        await expect.element(input).toHaveFocus()
        expect(page.getByRole('option').elements()).toHaveLength(1)
        await expect.element(page.getByRole('option', {name: 'item two'})).toBeInTheDocument()
      }

      await userEvent.clear(input)
      expect(page.getByRole('option').elements()).toHaveLength(3)
    })

    describe('screen reader announcements', () => {
      beforeEach(() => {
        const liveRegion = document.createElement('live-region')
        document.body.appendChild(liveRegion)
      })

      function LoadingSelectPanel({
        initialLoadingType = 'spinner',
        items = [],
      }: {
        initialLoadingType?: InitialLoadingType
        items?: SelectPanelProps['items']
      }) {
        const [open, setOpen] = React.useState(false)

        return (
          <SelectPanel
            title="test title"
            subtitle="test subtitle"
            placeholder="Select items"
            open={open}
            items={items}
            onFilterChange={() => {}}
            selected={[]}
            onSelectedChange={() => {}}
            onOpenChange={isOpen => {
              setOpen(isOpen)
            }}
            initialLoadingType={initialLoadingType}
          />
        )
      }

      it('displays a loading spinner on first open', async () => {
        renderWithProp(<LoadingSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect.element(page.getByTestId('filtered-action-list-spinner')).toBeInTheDocument()
      })

      it('displays a loading skeleton on first open', async () => {
        renderWithProp(<LoadingSelectPanel initialLoadingType="skeleton" />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect.element(page.getByTestId('filtered-action-list-skeleton')).toBeInTheDocument()
      })

      it('displays a loading spinner in the text input if items are already loaded', async () => {
        renderWithProp(<LoadingSelectPanel items={items} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        expect(page.getByRole('option').elements()).toHaveLength(3)

        // since the test component never repopulates the panel's list of items, the panel will
        // enter the loading state after the following line executes and stay there indefinitely
        await userEvent.type(page.getByRole('combobox'), 'two')

        // The aria-describedby attribute is only available if the icon is present. The input
        // field has a role of combobox.
        await expect.element(page.getByRole('combobox')).toHaveAttribute('aria-describedby')
      })

      it('should announce initially focused item', async () => {
        renderWithProp(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))
        await expect.element(page.getByLabelText('Filter items')).toHaveFocus()

        // we wait because announcement is intentionally updated after a timeout to not interrupt user input
        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toEqual('3 items available, 0 selected.')
            } else {
              expect(getLiveRegion().getMessage('polite')!.trim()).toEqual(
                'Filter items, filter text box and list of items, Focused item: item one, not selected, 1 of 3',
              )
            }
          },
          {timeout: 3000},
        )
      })

      it('should announce notice text', async () => {
        function SelectPanelWithNotice() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          const onSelectedChange = (selected: SelectPanelProps['items']) => {
            setSelected(selected)
          }

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              items={items}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={onSelectedChange}
              filterValue={filter}
              onFilterChange={value => {
                setFilter(value)
              }}
              open={open}
              onOpenChange={isOpen => {
                setOpen(isOpen)
              }}
              notice={{
                text: 'This is a notice',
                variant: 'warning',
              }}
            />
          )
        }

        renderWithProp(<SelectPanelWithNotice />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))
        await expect.element(page.getByLabelText('Filter items')).toHaveFocus()

        expect(getLiveRegion().getMessage('polite').trim()).toContain('This is a notice')
      })

      it('should announce filtered results', async () => {
        renderWithProp(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))
        await expect.element(page.getByLabelText('Filter items')).toHaveFocus()

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toEqual('3 items available, 0 selected.')
            } else {
              expect(getLiveRegion().getMessage('polite')!.trim()).toEqual(
                'Filter items, filter text box and list of items, Focused item: item one, not selected, 1 of 3',
              )
            }
          },
          {timeout: 3000}, // increased timeout because we don't want the test to compare with previous announcement
        )

        await userEvent.type(page.getByRole('combobox'), 'o')
        expect(page.getByRole('option').elements()).toHaveLength(2)

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')).toBe('2 items available, 0 selected.')
            } else {
              expect(getLiveRegion().getMessage('polite')).toBe(
                'List updated, Focused item: item one, not selected, 1 of 2',
              )
            }
          },
          {timeout: 3000}, // increased timeout because we don't want the test to compare with previous announcement
        )

        await userEvent.type(page.getByRole('combobox'), 'ne') // now: one
        expect(page.getByRole('option').elements()).toHaveLength(1)

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toBe('1 item available, 0 selected.')
            } else {
              expect(getLiveRegion().getMessage('polite').trim()).toBe(
                'List updated, Focused item: item one, not selected, 1 of 1',
              )
            }
          },
          {timeout: 3000},
        )
      })

      it('should announce default empty message when no results are available (no custom message is provided)', async () => {
        renderWithProp(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await userEvent.type(page.getByRole('combobox'), 'zero')
        await expect.element(page.getByRole('option')).not.toBeInTheDocument()

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toBe('No items available.')
            } else {
              expect(getLiveRegion().getMessage('polite').trim()).toBe('No items available.')
            }
          },
          {timeout: 3000},
        )
      })

      it('should announce custom empty message when no results are available', async () => {
        function SelectPanelWithCustomEmptyMessage() {
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              placeholder="Select items"
              placeholderText="Filter items"
              open={open}
              items={[]}
              onFilterChange={value => {
                setFilter(value)
              }}
              filterValue={filter}
              selected={[]}
              onSelectedChange={() => {}}
              onOpenChange={isOpen => {
                setOpen(isOpen)
              }}
              message={{
                title: 'Nothing found',
                body: `There's nothing here.`,
                variant: 'empty',
              }}
            />
          )
        }

        renderWithProp(<SelectPanelWithCustomEmptyMessage />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await userEvent.type(page.getByRole('combobox'), 'zero')
        await expect.element(page.getByRole('option')).not.toBeInTheDocument()

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toBe("Nothing found. There's nothing here.")
            } else {
              expect(getLiveRegion().getMessage('polite').trim()).toBe("Nothing found. There's nothing here.")
            }
          },
          {timeout: 3000},
        )
      })

      it('should accept a className to style the component', async () => {
        renderWithProp(<BasicSelectPanel className="test-class" />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect.element(page.getByTestId('filtered-action-list')).toHaveClass('test-class')
      })
    })

    describe('Empty state', () => {
      it('should display the default empty state message when there is no matching item after filtering (No custom message is provided)', async () => {
        renderWithProp(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        expect(page.getByRole('option').elements()).toHaveLength(3)

        await userEvent.type(page.getByRole('combobox'), 'something')
        await expect.element(page.getByText('No items available', {exact: true})).toBeInTheDocument()
      })

      it('should display the default empty state message when there is no item after the initial load (No custom message is provided)', async () => {
        renderWithProp(<NoItemAvailableSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))
        await expect.element(page.getByTestId('filtered-action-list-spinner')).toBeInTheDocument()
        await userEvent.keyboard('{Escape}')
        await userEvent.click(page.getByText('Select items', {exact: true}))
        await expect.element(page.getByText('No items available', {exact: true})).toBeInTheDocument()
      })
      it('should display the custom empty state message when there is no matching item after filtering', async () => {
        renderWithProp(
          <SelectPanelWithCustomMessages
            items={[
              {
                text: 'item one',
              },
              {
                text: 'item two',
              },
              {
                text: 'item three',
              },
            ]}
          />,
          usingRemoveActiveDescendant,
        )

        await userEvent.click(page.getByText('Select items', {exact: true}))

        expect(page.getByRole('option').elements()).toHaveLength(3)

        await userEvent.type(page.getByRole('combobox'), 'something')
        await expect.element(page.getByText('No language found for something', {exact: true})).toBeInTheDocument()
        await expect
          .element(page.getByText('Adjust your search term to find other languages', {exact: true}))
          .toBeInTheDocument()
      })

      it('should display the custom empty state message when there is no item after the initial load', async () => {
        renderWithProp(<SelectPanelWithCustomMessages items={[]} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))
        await expect.element(page.getByText("You haven't created any projects yet", {exact: true})).toBeInTheDocument()
        await expect
          .element(page.getByText('Start your first project to organise your issues', {exact: true}))
          .toBeInTheDocument()
      })

      it('should display action button in custom empty state message', async () => {
        const handleAction = vi.fn()

        renderWithProp(
          <SelectPanelWithCustomMessages items={[]} withAction={true} onAction={handleAction} />,
          usingRemoveActiveDescendant,
        )

        await userEvent.click(page.getByText('Select items', {exact: true}))
        await expect.element(page.getByText("You haven't created any projects yet", {exact: true})).toBeInTheDocument()
        await expect
          .element(page.getByText('Start your first project to organise your issues', {exact: true}))
          .toBeInTheDocument()

        // Check that action button is in the document
        const actionButton = page.getByTestId('create-project-action')
        await expect.element(actionButton).toBeInTheDocument()
        await expect.element(actionButton).toHaveTextContent('Create new project')

        // Test that action button is clickable
        await userEvent.click(actionButton)
        expect(handleAction).toHaveBeenCalledTimes(1)
      })
    })

    describe('with footer', () => {
      function SelectPanelWithFooter() {
        const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
        const [filter, setFilter] = React.useState('')
        const [open, setOpen] = React.useState(false)

        const onSelectedChange = (selected: SelectPanelProps['items']) => {
          setSelected(selected)
        }

        return (
          <SelectPanel
            title="test title"
            subtitle="test subtitle"
            footer={<div>test footer</div>}
            items={items}
            placeholder="Select items"
            placeholderText="Filter items"
            selected={selected}
            onSelectedChange={onSelectedChange}
            filterValue={filter}
            onFilterChange={value => {
              setFilter(value)
            }}
            open={open}
            onOpenChange={isOpen => {
              setOpen(isOpen)
            }}
          />
        )
      }

      it('should render the provided `footer` at the bottom of the dialog', async () => {
        renderWithProp(<SelectPanelWithFooter />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))
        await expect.element(page.getByText('test footer', {exact: true})).toBeInTheDocument()
      })
    })

    const listOfItems: Array<ItemInput> = [
      {
        id: '1',
        key: 1,
        text: 'Item 1',
        groupId: '1',
      },
      {
        id: '2',
        key: 2,
        text: 'Item 2',
        groupId: '1',
      },
      {
        id: '3',
        key: 3,
        text: 'Item 3',
        groupId: '2',
      },
      {
        id: '4',
        key: 4,
        text: 'Item 4',
        groupId: '3',
      },
    ]

    const groupMetadata: GroupedListProps['groupMetadata'] = [
      {groupId: '1', header: {title: 'Group title 1'}},
      {groupId: '2', header: {title: 'Group title 2'}},
      {groupId: '3', header: {title: 'Group title 3'}},
    ]

    function SelectPanelWithGroups() {
      const [selectedItems, setSelectedItems] = React.useState<SelectPanelProps['items']>([])
      const [open, setOpen] = React.useState(false)
      const [filter, setFilter] = React.useState('')

      const onSelectedChange = (selections: ItemInput[]) => {
        setSelectedItems(selections)
      }

      return (
        <SelectPanel
          title="test title"
          subtitle="test subtitle"
          groupMetadata={groupMetadata}
          placeholderText="Filter items"
          placeholder="Select items"
          items={listOfItems}
          selected={selectedItems}
          onSelectedChange={onSelectedChange}
          open={open}
          onOpenChange={isOpen => {
            setOpen(isOpen)
          }}
          filterValue={filter}
          onFilterChange={value => {
            setFilter(value)
          }}
        />
      )
    }

    describe('with groups', () => {
      it('should render groups with items', async () => {
        renderWithProp(<SelectPanelWithGroups />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))
        const listbox = page.getByRole('listbox')
        await expect.element(listbox).toBeInTheDocument()
        await expect.element(listbox).toHaveAttribute('aria-multiselectable', 'true')

        // listbox should has 3 groups and each have heading
        const groups = page.getByRole('group').elements()
        expect(groups).toHaveLength(3)
        await expect.element(groups[0]).toHaveAttribute('aria-label', 'Group title 1')
        await expect.element(groups[1]).toHaveAttribute('aria-label', 'Group title 2')
        await expect.element(groups[2]).toHaveAttribute('aria-label', 'Group title 3')

        expect(page.getByRole('option').elements()).toHaveLength(4)
      })
      it('should select items within groups', async () => {
        renderWithProp(<SelectPanelWithGroups />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        // Select the first item
        await userEvent.click(page.getByRole('option', {name: 'Item 1'}))
        await expect
          .element(
            page.getByRole('option', {
              name: 'Item 1',
            }),
          )
          .toHaveAttribute('aria-selected', 'true')

        await userEvent.click(page.getByRole('option', {name: 'Item 3'}))
        await expect
          .element(
            page.getByRole('option', {
              name: 'Item 3',
            }),
          )
          .toHaveAttribute('aria-selected', 'true')

        await userEvent.click(page.getByRole('option', {name: 'Item 4'}))
        await expect
          .element(
            page.getByRole('option', {
              name: 'Item 4',
            }),
          )
          .toHaveAttribute('aria-selected', 'true')
      })
    })

    describe('As Modal', () => {
      it('selections render as radios when variant modal and single select', async () => {
        renderWithProp(
          <BasicSelectPanel variant="modal" onCancel={() => {}} selected={undefined} />,
          usingRemoveActiveDescendant,
        )

        await userEvent.click(page.getByText('Select items', {exact: true}))

        expect(page.getByRole('radio', {includeHidden: true}).elements()).toHaveLength(items.length)

        await expect.element(page.getByRole('button', {name: 'Save'})).toBeInTheDocument()
        await expect.element(page.getByRole('button', {name: 'Cancel'})).toBeInTheDocument()
      })
      it('save and oncancel buttons are present when variant modal', async () => {
        renderWithProp(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect.element(page.getByRole('button', {name: 'Save'})).toBeInTheDocument()
        await expect.element(page.getByRole('button', {name: 'Cancel'})).toBeInTheDocument()
      })

      it('locks body scroll when modal is open', async () => {
        renderWithProp(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        expect(document.body.style.overflow).not.toBe('hidden')

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await waitFor(() => {
          expect(document.body.style.overflow).toBe('hidden')
        })
      })

      it('restores body scroll when modal is closed', async () => {
        renderWithProp(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))
        await waitFor(() => {
          expect(document.body.style.overflow).toBe('hidden')
        })

        await userEvent.click(page.getByRole('button', {name: 'Cancel'}))
        await waitFor(() => {
          expect(document.body.style.overflow).not.toBe('hidden')
        })
      })
    })

    describe('sorting', () => {
      const items = [
        {
          text: 'item one',
          id: '3',
        },
        {
          text: 'item two',
          id: '1',
          selected: true,
        },
        {
          text: 'item three',
          id: '2',
        },
      ]

      it('should render selected items at the top by default when FF on', async () => {
        renderWithProp(
          <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
            <BasicSelectPanel items={items} selected={[items[1]]} />
          </FeatureFlags>,
          usingRemoveActiveDescendant,
        )

        await userEvent.click(page.getByText('item two', {exact: true})) // item two is selected so that's what the anchor text is

        const options = page.getByRole('option').elements()
        await expect.element(options[0]).toHaveTextContent('item two') // item two is selected
        await expect.element(options[1]).toHaveTextContent('item one')
        await expect.element(options[2]).toHaveTextContent('item three')
      })
      it('should not render selected items at the top by default when FF off', async () => {
        renderWithProp(
          <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: false}}>
            <BasicSelectPanel items={items} selected={[items[1]]} />
          </FeatureFlags>,
          usingRemoveActiveDescendant,
        )

        await userEvent.click(page.getByText('item two', {exact: true})) // item two is selected so that's what the anchor text is

        const options = page.getByRole('option').elements()
        await expect.element(options[0]).toHaveTextContent('item one')
        await expect.element(options[1]).toHaveTextContent('item two') // item two is selected
        await expect.element(options[2]).toHaveTextContent('item three')
      })
      it('should not render selected items at the top when showSelectedOptionsFirst set to false', async () => {
        renderWithProp(
          <BasicSelectPanel items={items} selected={[items[1]]} showSelectedOptionsFirst={false} />,
          usingRemoveActiveDescendant,
        )

        await userEvent.click(page.getByText('item two', {exact: true})) // item two is selected so that's what the anchor text is

        const options = page.getByRole('option').elements()
        await expect.element(options[0]).toHaveTextContent('item one')
        await expect.element(options[1]).toHaveTextContent('item two') // item two is selected
        await expect.element(options[2]).toHaveTextContent('item three')
      })
    })

    describe('disableFullscreenOnNarrow prop', () => {
      const renderSelectPanelWithFlags = (flags: Record<string, boolean>, props: Record<string, unknown> = {}) => {
        return renderWithProp(
          <FeatureFlags flags={flags}>
            <SingleSelectPanel {...props} />
          </FeatureFlags>,
          usingRemoveActiveDescendant,
        )
      }

      // Create a single-select version to test ResponsiveCloseButton behavior
      function SingleSelectPanel(passthroughProps: Record<string, unknown>) {
        const [filter, setFilter] = React.useState('')
        const [open, setOpen] = React.useState(false)

        return (
          <SelectPanel
            title="test title"
            subtitle="test subtitle"
            items={items}
            placeholder="Select an item"
            placeholderText="Filter items"
            selected={undefined}
            onSelectedChange={() => {}}
            filterValue={filter}
            onFilterChange={value => {
              setFilter(value)
            }}
            open={open}
            onOpenChange={open => setOpen(open)}
            {...passthroughProps}
          />
        )
      }

      it('should opt out of fullscreen when disableFullscreenOnNarrow=true even when feature flag is enabled', async () => {
        renderSelectPanelWithFlags(
          {
            primer_react_select_panel_fullscreen_on_narrow: true,
          },
          {disableFullscreenOnNarrow: true},
        )

        await userEvent.click(page.getByText('Select an item', {exact: true}))

        // When disableFullscreenOnNarrow=true, the ResponsiveCloseButton should not be present
        // even when the feature flag is enabled, indicating no fullscreen behavior
        const responsiveCloseButton = page.getByRole('button', {name: 'Cancel and close'})
        await expect.element(responsiveCloseButton).not.toBeInTheDocument()
      })

      it('should use fullscreen behavior when disableFullscreenOnNarrow=false and feature flag is enabled', async () => {
        renderSelectPanelWithFlags(
          {
            primer_react_select_panel_fullscreen_on_narrow: true,
          },
          {disableFullscreenOnNarrow: false},
        )

        await userEvent.click(page.getByText('Select an item', {exact: true}))

        // When feature flag is true and disableFullscreenOnNarrow is false, the ResponsiveCloseButton should be present
        // indicating fullscreen behavior is active
        const responsiveCloseButton = page.getByRole('button', {name: 'Cancel and close'})
        await expect.element(responsiveCloseButton).toBeInTheDocument()
      })

      it('should default to feature flag value when disableFullscreenOnNarrow is undefined', async () => {
        // Test with feature flag disabled
        renderSelectPanelWithFlags({
          primer_react_select_panel_fullscreen_on_narrow: false,
        })

        await userEvent.click(page.getByText('Select an item', {exact: true}))

        // When feature flag is false and disableFullscreenOnNarrow is undefined,
        // the ResponsiveCloseButton should not be present
        const responsiveCloseButton = page.getByRole('button', {name: 'Cancel and close'})
        await expect.element(responsiveCloseButton).not.toBeInTheDocument()
      })
    })

    describe('Select all', () => {
      function SelectAllSelectPanel({showSelectAll = true}: {showSelectAll?: boolean} = {}) {
        const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
        const [filter, setFilter] = React.useState('')
        const [open, setOpen] = React.useState(false)

        const onSelectedChange = (selected: SelectPanelProps['items']) => {
          setSelected(selected)
        }

        return (
          <SelectPanel
            title="test title"
            subtitle="test subtitle"
            items={items}
            placeholder="Select items"
            placeholderText="Filter items"
            selected={selected}
            onSelectedChange={onSelectedChange}
            filterValue={filter}
            onFilterChange={value => {
              setFilter(value)
            }}
            open={open}
            onOpenChange={isOpen => {
              setOpen(isOpen)
            }}
            showSelectAll={showSelectAll}
          />
        )
      }

      it('should render a Select All checkbox when showSelectAll is true', async () => {
        renderWithProp(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect.element(page.getByText('Select all', {exact: true})).toBeInTheDocument()
        await expect.element(page.getByRole('checkbox', {name: 'Select all'})).toBeInTheDocument()
        await expect.element(page.getByRole('checkbox', {name: 'Select all'})).not.toBeChecked()
      })

      it('should not render a Select All checkbox when showSelectAll is false', async () => {
        renderWithProp(<SelectAllSelectPanel showSelectAll={false} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect.element(page.getByText('Select all', {exact: true})).not.toBeInTheDocument()
        await expect.element(page.getByRole('checkbox', {name: 'Select all'})).not.toBeInTheDocument()
      })

      it('should select all items when the Select All checkbox is clicked', async () => {
        renderWithProp(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await userEvent.click(page.getByRole('checkbox', {name: 'Select all'}))

        // All options should now be selected
        for (const item of items) {
          await expect.element(page.getByRole('option', {name: item.text})).toHaveAttribute('aria-selected', 'true')
        }
      })

      it('should deselect all items when the Deselect All checkbox is clicked', async () => {
        renderWithProp(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        // First select all
        await userEvent.click(page.getByRole('checkbox', {name: 'Select all'}))

        // Then deselect all
        await userEvent.click(page.getByRole('checkbox', {name: 'Deselect all'}))

        // All options should now be deselected
        for (const item of items) {
          if (item.text) {
            await expect.element(page.getByRole('option', {name: item.text})).toHaveAttribute('aria-selected', 'false')
          }
        }
      })

      it('should update Select All checkbox to indeterminate state when some items (but not all) are selected', async () => {
        renderWithProp(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        // Select only one item
        await userEvent.click(page.getByText('item one', {exact: true}))

        // Check that Select All is in indeterminate state
        const selectAllCheckbox = page.getByRole('checkbox', {name: 'Select all'})
        await expect.element(selectAllCheckbox).not.toBeChecked()
        expect(selectAllCheckbox.element()).toHaveProperty('indeterminate', true)
      })

      it('should update Select All checkbox to checked when all items are selected manually', async () => {
        renderWithProp(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        // Select all items individually
        for (const item of items) {
          if (item.text) {
            await userEvent.click(page.getByText(item.text, {exact: true}))
          }
        }

        // Check that Deselect All is checked
        await expect.element(page.getByRole('checkbox', {name: 'Deselect all'})).toBeChecked()
      })

      it('should update Select All checkbox label to "Deselect all" when all items are selected', async () => {
        renderWithProp(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        // Select all items
        await userEvent.click(page.getByRole('checkbox', {name: 'Select all'}))

        // Check that the label has changed to "Deselect all"
        await expect.element(page.getByText('Deselect all', {exact: true})).toBeInTheDocument()
        await expect.element(page.getByRole('checkbox', {name: 'Deselect all'})).toBeInTheDocument()
      })

      it('should apply Select All only to filtered items and maintain selection state when filters are cleared', async () => {
        function FilterableSelectAllPanel() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          const onSelectedChange = (selected: SelectPanelProps['items']) => {
            setSelected(selected)
          }

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              items={items.filter(item => item.text?.includes(filter))}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={onSelectedChange}
              filterValue={filter}
              onFilterChange={value => {
                setFilter(value)
              }}
              open={open}
              onOpenChange={isOpen => {
                setOpen(isOpen)
              }}
              showSelectAll={true}
            />
          )
        }

        renderWithProp(<FilterableSelectAllPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        // Filter to only show "item one"
        await userEvent.type(page.getByLabelText('Filter items'), 'one')

        // Only "item one" should be visible
        expect(page.getByRole('option').elements()).toHaveLength(1)
        await expect.element(page.getByText('item one', {exact: true})).toBeInTheDocument()

        // Select all (which is just the one visible item)
        await userEvent.click(page.getByRole('checkbox', {name: 'Select all'}))

        // The visible item should be selected
        await expect.element(page.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'true')

        // Clear the filter
        await userEvent.clear(page.getByLabelText('Filter items'))

        // Now all items should be visible, but only "item one" should be selected
        expect(page.getByRole('option').elements()).toHaveLength(3)
        await expect.element(page.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'true')
        await expect.element(page.getByRole('option', {name: 'item two'})).toHaveAttribute('aria-selected', 'false')
        await expect.element(page.getByRole('option', {name: 'item three'})).toHaveAttribute('aria-selected', 'false')

        // Select All checkbox should be in indeterminate state
        const selectAllCheckbox = page.getByRole('checkbox', {name: 'Select all'})
        await expect.element(selectAllCheckbox).not.toBeChecked()
        expect(selectAllCheckbox.element()).toHaveProperty('indeterminate', true)
      })
    })

    describe('disableSelectOnHover', () => {
      it('should not update aria-activedescendant when hovering over items when disableSelectOnHover is true', async () => {
        render(<BasicSelectPanel disableSelectOnHover={true} />)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        const input = page.getByPlaceholder('Filter items')
        const options = page.getByRole('option').elements()

        // Initially, aria-activedescendant should not be set if setInitialFocus is false (default)
        const initialActiveDescendant = input.element().getAttribute('aria-activedescendant')

        // Hover over the first item
        await userEvent.hover(options[0])

        // aria-activedescendant should not change when disableSelectOnHover is true
        expect(input.element().getAttribute('aria-activedescendant')).toBe(initialActiveDescendant)

        // Hover over the second item
        await userEvent.hover(options[1])

        // aria-activedescendant should still not change
        expect(input.element().getAttribute('aria-activedescendant')).toBe(initialActiveDescendant)
      })

      it('should update aria-activedescendant when hovering over items when disableSelectOnHover is false (default)', async () => {
        render(<BasicSelectPanel />)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        const input = page.getByPlaceholder('Filter items')
        const options = page.getByRole('option').elements()

        // Hover over the first item
        await userEvent.hover(options[0])

        // aria-activedescendant should be set to the first item
        expect(input.element().getAttribute('aria-activedescendant')).toBe(options[0].id)

        // Hover over the second item
        await userEvent.hover(options[1])

        // aria-activedescendant should be updated to the second item
        expect(input.element().getAttribute('aria-activedescendant')).toBe(options[1].id)
      })
    })

    describe('setInitialFocus', () => {
      it('should not set aria-activedescendant until user interaction when setInitialFocus is true', async () => {
        render(<BasicSelectPanel setInitialFocus={true} />)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        const input = page.getByPlaceholder('Filter items')
        const options = page.getByRole('option').elements()

        // Initially, aria-activedescendant should not be set
        expect(input.element().getAttribute('aria-activedescendant')).toBeFalsy()

        // User interacts with keyboard
        await userEvent.keyboard('{ArrowDown}')

        // Now aria-activedescendant should be set to the first item
        expect(input.element().getAttribute('aria-activedescendant')).toBe(options[0].id)
      })

      it('should set aria-activedescendant to the first item on mount when setInitialFocus is false (default)', async () => {
        render(<BasicSelectPanel />)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        const input = page.getByPlaceholder('Filter items')
        const options = page.getByRole('option').elements()

        await waitFor(() => {
          expect(input.element().getAttribute('aria-activedescendant')).toBe(options[0].id)
        })
      })

      it('should not set aria-activedescendant on mouse hover until after first interaction when setInitialFocus is true', async () => {
        render(<BasicSelectPanel setInitialFocus={true} />)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        const input = page.getByPlaceholder('Filter items')
        const options = page.getByRole('option').elements()

        // Initially, aria-activedescendant should not be set
        expect(input.element().getAttribute('aria-activedescendant')).toBeFalsy()

        // Hover over the first item (this is the first interaction)
        await userEvent.hover(options[0])

        // Now aria-activedescendant should be set to the first item
        expect(input.element().getAttribute('aria-activedescendant')).toBe(options[0].id)

        // Hover over the second item
        await userEvent.hover(options[1])

        // aria-activedescendant should update to the second item
        expect(input.element().getAttribute('aria-activedescendant')).toBe(options[1].id)
      })
    })

    describe('data-component attributes', () => {
      it('renders SelectPanel with data-component attribute', async () => {
        renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel"]'))
          .toBeInTheDocument()
      })

      it('renders SelectPanel.Header with data-component attribute', async () => {
        renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.Header"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.Title with data-component attribute', async () => {
        renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.Title"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.Subtitle with data-component attribute', async () => {
        renderWithProp(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.Subtitle"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.Footer with data-component attribute when using deprecated footer prop', async () => {
        function SelectPanelWithFooter() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              footer={<div>test footer</div>}
              items={items}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
            />
          )
        }

        renderWithProp(<SelectPanelWithFooter />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.Footer"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.Footer with data-component attribute when using modal variant', async () => {
        renderWithProp(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.Footer"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.CancelButton with data-component attribute', async () => {
        renderWithProp(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel.CancelButton"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.SaveButton with data-component attribute', async () => {
        renderWithProp(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.SaveButton"]'),
          )
          .toBeInTheDocument()
      })

      // Note: SelectPanel.CloseButton is only rendered on non-narrow screens in modal variant.
      // On narrow screens, AnchoredOverlay handles the close button display.

      it('renders SelectPanel.Backdrop with data-component attribute in modal variant', async () => {
        renderWithProp(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(document.querySelector<HTMLElement>('[data-component="SelectPanel.Backdrop"]'))
          .toBeInTheDocument()
      })

      it('renders SelectPanel.SecondaryAction with data-component attribute', async () => {
        function SelectPanelWithSecondaryAction() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              secondaryAction={<SelectPanel.SecondaryActionButton>Action</SelectPanel.SecondaryActionButton>}
              items={items}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
              variant="modal"
              onCancel={() => {}}
            />
          )
        }

        renderWithProp(<SelectPanelWithSecondaryAction />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel.SecondaryAction"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.SecondaryActionButton with data-component attribute', async () => {
        function SelectPanelWithSecondaryActionButton() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              secondaryAction={<SelectPanel.SecondaryActionButton>Action</SelectPanel.SecondaryActionButton>}
              items={items}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
              variant="modal"
              onCancel={() => {}}
            />
          )
        }

        renderWithProp(<SelectPanelWithSecondaryActionButton />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel.SecondaryActionButton"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.SecondaryActionLink with data-component attribute', async () => {
        function SelectPanelWithSecondaryActionLink() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              secondaryAction={<SelectPanel.SecondaryActionLink href="#">Link</SelectPanel.SecondaryActionLink>}
              items={items}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
              variant="modal"
              onCancel={() => {}}
            />
          )
        }

        renderWithProp(<SelectPanelWithSecondaryActionLink />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel.SecondaryActionLink"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.Notice with data-component attribute', async () => {
        function SelectPanelWithNotice() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              notice={{text: 'This is a notice', variant: 'info'}}
              items={items}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
            />
          )
        }

        renderWithProp(<SelectPanelWithNotice />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.Notice"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.Message with data-component attribute when message is shown', async () => {
        function SelectPanelWithMessage() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              message={{title: 'Message title', body: 'Message body', variant: 'warning'}}
              items={[]}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
            />
          )
        }

        renderWithProp(<SelectPanelWithMessage />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.Message"]'),
          )
          .toBeInTheDocument()
        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.MessageIcon"]'),
          )
          .toBeInTheDocument()
        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel.MessageTitle"]'),
          )
          .toBeInTheDocument()
        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.MessageBody"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.MessageAction with data-component attribute when action is provided', async () => {
        function SelectPanelWithMessageAction() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              message={{
                title: 'Error',
                body: 'Something went wrong',
                variant: 'error',
                action: <button type="button">Retry</button>,
              }}
              items={[]}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
            />
          )
        }

        renderWithProp(<SelectPanelWithMessageAction />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel.MessageAction"]'),
          )
          .toBeInTheDocument()
      })

      it('allows accessing nested ActionList data-component attributes from SelectPanel', async () => {
        const itemsWithLeadingVisual = [
          {text: 'item one', leadingVisual: () => <span>Icon</span>},
          {text: 'item two', leadingVisual: () => <span>Icon</span>},
        ]

        function SelectPanelWithLeadingVisuals() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <SelectPanel
              title="test title"
              subtitle="test subtitle"
              items={itemsWithLeadingVisual}
              placeholder="Select items"
              placeholderText="Filter items"
              selected={selected}
              onSelectedChange={setSelected}
              filterValue={filter}
              onFilterChange={setFilter}
              open={open}
              onOpenChange={setOpen}
            />
          )
        }

        renderWithProp(<SelectPanelWithLeadingVisuals />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        // Test that you can query for ActionList primitives nested within SelectPanel
        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel"] [data-component="ActionList.Item"]'),
          )
          .toBeInTheDocument()

        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel"] [data-component="ActionList.LeadingVisual"]'),
          )
          .toBeInTheDocument()

        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel"] [data-component="ActionList.Item.Label"]'),
          )
          .toBeInTheDocument()

        // Test that you can query for the TextInput nested within SelectPanel
        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>(
                '[data-component="SelectPanel"] [data-component="TextInput"] [data-component="input"]',
              ),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.CloseButton with data-component attribute on wide viewports in modal variant', async () => {
        await page.viewport(1400, 728)

        renderWithProp(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page.getByRole('dialog').element().querySelector<HTMLElement>('[data-component="SelectPanel.CloseButton"]'),
          )
          .toBeInTheDocument()
      })

      it('renders SelectPanel.SaveAndCloseButton with data-component attribute on narrow viewports', async () => {
        await page.viewport(320, 568)

        function MultiSelectPanelWithoutCancel() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          return (
            <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: true}}>
              <SelectPanel
                title="test title"
                subtitle="test subtitle"
                items={items}
                placeholder="Select items"
                placeholderText="Filter items"
                selected={selected}
                onSelectedChange={setSelected}
                filterValue={filter}
                onFilterChange={setFilter}
                open={open}
                onOpenChange={setOpen}
              />
            </FeatureFlags>
          )
        }

        render(<MultiSelectPanelWithoutCancel />)

        await userEvent.click(page.getByText('Select items', {exact: true}))

        await expect
          .element(
            page
              .getByRole('dialog')
              .element()
              .querySelector<HTMLElement>('[data-component="SelectPanel.SaveAndCloseButton"]'),
          )
          .toBeInTheDocument()
      })
    })
  })

  describe('Event propagation', () => {
    function EventSelectPanel() {
      const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
      const [filter, setFilter] = React.useState('')
      const [open, setOpen] = React.useState(false)

      const onSelectedChange = (selected: SelectPanelProps['items']) => {
        setSelected(selected)
      }

      return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            const isAlphabetKey = e.key.length === 1 && /[a-z\d]/i.test(e.key)
            const container = e.currentTarget

            if (!isAlphabetKey) return
            container.setAttribute('data-keydown-called', 'true')
          }}
          data-keydown-called="false"
        >
          <button type="button" onClick={() => setOpen(!open)}>
            Toggle SelectPanel
          </button>
          <SelectPanel
            title="test title"
            subtitle="test subtitle"
            items={items}
            placeholder="Select items"
            placeholderText="Filter items"
            selected={selected}
            onSelectedChange={onSelectedChange}
            filterValue={filter}
            onFilterChange={value => {
              setFilter(value)
            }}
            open={open}
            onOpenChange={isOpen => {
              setOpen(isOpen)
            }}
            _PrivateFocusManagement="roving-tabindex"
          />
        </div>
      )
    }

    it('should prevent event propagation when using keyboard while focusing on an item', async () => {
      render(<EventSelectPanel />)

      const toggleButton = page.getByRole('button', {name: 'Toggle SelectPanel'})
      const container = toggleButton.element().parentElement

      await userEvent.click(toggleButton)

      await expect.element(page.getByText('Select items', {exact: true})).toBeInTheDocument()

      const listbox = page.getByRole('listbox')
      await expect.element(listbox).toBeInTheDocument()
      await expect.element(listbox).toHaveAttribute('aria-multiselectable', 'true')

      const options = page.getByRole('option').elements()
      expect(options).toHaveLength(3)

      const firstOption = options[0]
      await expect.element(firstOption).toHaveTextContent('item one')

      await userEvent.keyboard('{ArrowDown}')

      await expect.element(firstOption).toHaveFocus()

      await userEvent.keyboard('{ArrowDown}')

      // Trigger alphabet key that should not propagate
      await userEvent.keyboard('A')

      await expect.element(options[1]).toHaveFocus()
      expect(container?.getAttribute('data-keydown-called')).toBe('false')
    })
  })
}

describe('SelectPanel displayInViewport prop', () => {
  const mockGetAnchoredPosition = vi.mocked(getAnchoredPosition)

  beforeEach(() => {
    mockGetAnchoredPosition.mockClear()
  })

  it('should forward displayInViewport={true} to getAnchoredPosition', async () => {
    render(<BasicSelectPanel displayInViewport={true} />)

    await userEvent.click(page.getByRole('button', {name: 'Select items'}))

    await waitFor(async () => {
      await expect.element(page.getByRole('listbox')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(mockGetAnchoredPosition).toHaveBeenCalled()
    })

    const calls = mockGetAnchoredPosition.mock.calls
    const lastCall = calls[calls.length - 1]
    expect(lastCall[2]?.displayInViewport).toBe(true)
  })

  it('should not set displayInViewport when prop is not provided', async () => {
    render(<BasicSelectPanel />)

    await userEvent.click(page.getByRole('button', {name: 'Select items'}))

    await waitFor(async () => {
      await expect.element(page.getByRole('listbox')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(mockGetAnchoredPosition).toHaveBeenCalled()
    })

    const calls = mockGetAnchoredPosition.mock.calls
    const lastCall = calls[calls.length - 1]
    expect(lastCall[2]?.displayInViewport).not.toBe(true)
  })
})

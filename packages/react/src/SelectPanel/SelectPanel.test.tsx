import {render, screen, waitFor} from '@testing-library/react'
import {describe, expect, it, beforeEach, vi} from 'vitest'
import React from 'react'
import {SelectPanel, type SelectPanelProps, type ItemInput, type GroupedListProps} from '../SelectPanel'
import {userEvent} from '@testing-library/user-event'
import {FeatureFlags} from '../FeatureFlags'
import type {InitialLoadingType} from './SelectPanel'
import type {LiveRegionElement} from '@primer/live-region-element'
import {IconButton} from '../Button'
import {ArrowLeftIcon} from '@primer/octicons-react'
import classes from './SelectPanel.test.module.css'

// Instead of importing from live-region/__tests__/test-helpers.ts, we define our own getLiveRegion function
export function getLiveRegion(): LiveRegionElement {
  const liveRegion = document.querySelector('live-region')
  if (liveRegion) {
    return liveRegion as LiveRegionElement
  }
  throw new Error('No live-region found')
}

const renderWithFlag = (children: React.ReactNode, flag: boolean) => {
  return render(
    <FeatureFlags
      flags={{
        primer_react_select_panel_remove_active_descendant: flag,
      }}
    >
      {children}
    </FeatureFlags>,
  )
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
      {...passthroughProps}
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
    />
  )
}

globalThis.Element.prototype.scrollTo = vi.fn()

for (const usingRemoveActiveDescendant of [false, true]) {
  describe('SelectPanel', () => {
    it('should render an anchor to open the select panel using `placeholder`', () => {
      renderWithFlag(<BasicSelectPanel />, usingRemoveActiveDescendant)

      expect(screen.getByText('Select items')).toBeInTheDocument()

      const trigger = screen.getByRole('button', {
        name: 'Select items',
      })
      expect(trigger).toHaveAttribute('aria-haspopup', 'true')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('should open the select panel when activating the trigger', async () => {
      const user = userEvent.setup()

      renderWithFlag(<BasicSelectPanel />, usingRemoveActiveDescendant)

      await user.click(screen.getByText('Select items'))

      // Verify that the button has `aria-expanded="true"` after opening
      const trigger = screen.getByRole('button', {
        name: 'Select items',
      })
      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      // Verify that the input and listbox are in the document
      expect(screen.getByPlaceholderText('Filter items')).toBeInTheDocument()
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      // The input box must have focus
      expect(document.activeElement?.tagName.toLowerCase()).toBe('input')
    })

    it('should close the select panel when pressing Escape', async () => {
      const user = userEvent.setup()

      renderWithFlag(<BasicSelectPanel />, usingRemoveActiveDescendant)

      await user.click(screen.getByText('Select items'))
      await user.keyboard('{Escape}')

      expect(screen.getByRole('button', {name: 'Select items'})).toHaveFocus()
      expect(screen.getByRole('button', {name: 'Select items'})).toHaveAttribute('aria-expanded', 'false')
    })

    it('should close the select panel when clicking outside of the select panel', async () => {
      const user = userEvent.setup()

      renderWithFlag(
        <>
          <button type="button">outer button</button>
          <BasicSelectPanel />
        </>,
        usingRemoveActiveDescendant,
      )

      await user.click(screen.getByText('Select items'))
      await user.click(screen.getByText('outer button'))

      expect(screen.getByRole('button', {name: 'Select items'})).toHaveAttribute('aria-expanded', 'false')
    })

    it('should open a dialog that is labelled by `title` and described by `subtitle`', async () => {
      const user = userEvent.setup()

      renderWithFlag(<BasicSelectPanel />, usingRemoveActiveDescendant)

      await user.click(screen.getByText('Select items'))

      expect(
        screen.getByRole('dialog', {
          name: 'test title',
          description: 'test subtitle',
        }),
      ).toBeInTheDocument()
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

      const user = userEvent.setup()

      renderWithFlag(<SelectPanelOpenChange />, usingRemoveActiveDescendant)

      // Open by click
      await user.click(screen.getByText('Select items'))
      expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-click')

      // Close by click on anchor
      await user.click(screen.getByText('Select items'))
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'anchor-click')

      // Open by button activation
      await user.type(screen.getByText('Select items'), '{Space}')
      expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-click')

      // Close by Escape key
      await user.keyboard('{Escape}')
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'escape')

      // Close by click outside
      await user.click(screen.getByText('Select items'))
      await user.click(screen.getByText('Outside of select panel'))
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'click-outside')
    })

    it('should label the list by title unless a aria-label is explicitly passed', async () => {
      const user = userEvent.setup()

      renderWithFlag(<BasicSelectPanel />, usingRemoveActiveDescendant)
      await user.click(screen.getByText('Select items'))
      expect(screen.getByRole('listbox', {name: 'test title'})).toBeInTheDocument()
    })

    it('should label the list by aria-label when explicitly passed', async () => {
      const user = userEvent.setup()

      renderWithFlag(<BasicSelectPanel aria-label="Custom label" />, usingRemoveActiveDescendant)
      await user.click(screen.getByText('Select items'))
      expect(screen.getByRole('listbox', {name: 'Custom label'})).toBeInTheDocument()
    })

    it('should focus the filter input on open', async () => {
      const user = userEvent.setup()

      // This panel contains another focusable thing (the IconButton) that should not receive focus
      // when the panel opens.
      renderWithFlag(
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

      await user.click(screen.getByText('Select items'))
      expect(screen.getByLabelText('Filter items')).toHaveFocus()
    })

    describe('selection', () => {
      it('should select an active option when activated', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        await user.type(document.activeElement!, '{Enter}')
        expect(
          screen.getByRole('option', {
            name: 'item one',
          }),
        ).toHaveAttribute('aria-selected', 'true')

        await user.type(document.activeElement!, '{Enter}')
        expect(
          screen.getByRole('option', {
            name: 'item one',
          }),
        ).toHaveAttribute('aria-selected', 'false')

        await user.click(screen.getByText('item one'))
        expect(
          screen.getByRole('option', {
            name: 'item one',
          }),
        ).toHaveAttribute('aria-selected', 'true')

        await user.click(screen.getByRole('option', {name: 'item one'}))
        expect(
          screen.getByRole('option', {
            name: 'item one',
          }),
        ).toHaveAttribute('aria-selected', 'false')
      })

      it('should support navigating through items with ArrowUp and ArrowDown', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        if (usingRemoveActiveDescendant) {
          expect(document.activeElement!).toHaveAttribute('role', 'combobox')

          await user.keyboard('{ArrowDown}')
          expect(document.activeElement!).toHaveAccessibleName('item one')

          await user.keyboard('{ArrowDown}')
          expect(document.activeElement!).toHaveAccessibleName('item two')

          await user.keyboard('{ArrowDown}')
          expect(document.activeElement!).toHaveAccessibleName('item three')

          // At end of list, should wrap to the beginning
          await user.keyboard('{ArrowDown}')
          expect(document.activeElement!).toHaveAccessibleName('item one')

          // At beginning of list, ArrowUp should wrap to the end
          await user.keyboard('{ArrowUp}')
          expect(document.activeElement!).toHaveAccessibleName('item three')

          await user.keyboard('{ArrowUp}')
          expect(document.activeElement!).toHaveAccessibleName('item two')

          await user.keyboard('{ArrowUp}')
          expect(document.activeElement!).toHaveAccessibleName('item one')
        } else {
          // First item by default should be the active element
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item one'}).id,
          )

          await user.type(document.activeElement!, '{ArrowDown}')
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item two'}).id,
          )

          await user.type(document.activeElement!, '{ArrowDown}')
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item three'}).id,
          )

          // At end of list, should wrap to the beginning
          await user.type(document.activeElement!, '{ArrowDown}')
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item one'}).id,
          )

          // At beginning of list, ArrowUp should wrap to the end
          await user.type(document.activeElement!, '{ArrowUp}')
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item three'}).id,
          )

          await user.type(document.activeElement!, '{ArrowUp}')
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item two'}).id,
          )

          await user.type(document.activeElement!, '{ArrowUp}')
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item one'}).id,
          )
        }
      })

      it('should support navigating through items with PageDown and PageUp', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        if (usingRemoveActiveDescendant) {
          await user.type(document.activeElement!, '{ArrowDown}')

          expect(document.activeElement!).toHaveAccessibleName('item one')

          await user.type(document.activeElement!, '{PageDown}')

          expect(document.activeElement!).toHaveAccessibleName('item three')

          await user.type(document.activeElement!, '{PageUp}')

          expect(document.activeElement!).toHaveAccessibleName('item one')
        } else {
          // First item by default should be the active element
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item one'}).id,
          )

          await user.type(document.activeElement!, '{PageDown}')

          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item three'}).id,
          )

          await user.type(document.activeElement!, '{PageUp}')
          expect(document.activeElement!).toHaveAttribute(
            'aria-activedescendant',
            screen.getByRole('option', {name: 'item one'}).id,
          )
        }
      })

      it('should select an item (by item.id) even when items are defined in the component', async () => {
        const user = userEvent.setup()

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

        renderWithFlag(<Fixture />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        await user.click(screen.getByText('item one'))
        expect(screen.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'true')

        await user.click(screen.getByText('item two'))
        expect(screen.getByRole('option', {name: 'item two'})).toHaveAttribute('aria-selected', 'true')

        await user.click(screen.getByRole('option', {name: 'item one'}))
        expect(screen.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'false')
      })
    })

    function FilterableSelectPanel() {
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
        const user = userEvent.setup()

        renderWithFlag(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.getAllByRole('option')).toHaveLength(3)

        await user.type(document.activeElement!, 'two')
        expect(screen.getAllByRole('option')).toHaveLength(1)
      })
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
        const user = userEvent.setup()

        renderWithFlag(<LoadingSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.getByTestId('filtered-action-list-spinner')).toBeTruthy()
      })

      it('displays a loading skeleton on first open', async () => {
        const user = userEvent.setup()

        renderWithFlag(<LoadingSelectPanel initialLoadingType="skeleton" />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.getByTestId('filtered-action-list-skeleton')).toBeTruthy()
      })

      it('displays a loading spinner in the text input if items are already loaded', async () => {
        const user = userEvent.setup()

        renderWithFlag(<LoadingSelectPanel items={items} />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.getAllByRole('option')).toHaveLength(3)

        // since the test component never repopulates the panel's list of items, the panel will
        // enter the loading state after the following line executes and stay there indefinitely
        await user.type(document.activeElement!, 'two')

        // The aria-describedby attribute is only available if the icon is present. The input
        // field has a role of combobox.
        expect(screen.getByRole('combobox').hasAttribute('aria-describedby')).toBeTruthy()
      })

      it('should announce initially focused item', async () => {
        const user = userEvent.setup()
        renderWithFlag(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))
        expect(screen.getByLabelText('Filter items')).toHaveFocus()

        // we wait because announcement is intentionally updated after a timeout to not interrupt user input
        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toEqual('3 items available, 0 selected.')
            } else {
              expect(getLiveRegion().getMessage('polite')!.trim()).toEqual(
                'List updated, Focused item: item one, not selected, 1 of 3',
              )
            }
          },
          {timeout: 3000},
        )
      })

      it('should announce notice text', async () => {
        const user = userEvent.setup()

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

        renderWithFlag(<SelectPanelWithNotice />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))
        expect(screen.getByLabelText('Filter items')).toHaveFocus()

        expect(getLiveRegion().getMessage('polite')?.trim()).toContain('This is a notice')
      })

      it('should announce filtered results', async () => {
        const user = userEvent.setup()
        renderWithFlag(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))
        expect(screen.getByLabelText('Filter items')).toHaveFocus()

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toEqual('3 items available, 0 selected.')
            } else {
              expect(getLiveRegion().getMessage('polite')!.trim()).toEqual(
                'List updated, Focused item: item one, not selected, 1 of 3',
              )
            }
          },
          {timeout: 3000}, // increased timeout because we don't want the test to compare with previous announcement
        )

        await user.type(document.activeElement!, 'o')
        expect(screen.getAllByRole('option')).toHaveLength(2)

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

        await user.type(document.activeElement!, 'ne') // now: one
        expect(screen.getAllByRole('option')).toHaveLength(1)

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toBe('1 item available, 0 selected.')
            } else {
              expect(getLiveRegion().getMessage('polite')?.trim()).toBe(
                'List updated, Focused item: item one, not selected, 1 of 1',
              )
            }
          },
          {timeout: 3000},
        )
      })

      it('should announce default empty message when no results are available (no custom message is provided)', async () => {
        const user = userEvent.setup()
        renderWithFlag(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        await user.type(document.activeElement!, 'zero')
        expect(screen.queryByRole('option')).toBeNull()

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toBe('No items available.')
            } else {
              expect(getLiveRegion().getMessage('polite')?.trim()).toBe('No items available.')
            }
          },
          {timeout: 3000},
        )
      })

      it('should announce custom empty message when no results are available', async () => {
        const user = userEvent.setup()

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

        renderWithFlag(<SelectPanelWithCustomEmptyMessage />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        await user.type(document.activeElement!, 'zero')
        expect(screen.queryByRole('option')).toBeNull()

        await waitFor(
          async () => {
            if (usingRemoveActiveDescendant) {
              expect(getLiveRegion().getMessage('polite')!.trim()).toBe("Nothing found. There's nothing here.")
            } else {
              expect(getLiveRegion().getMessage('polite')?.trim()).toBe("Nothing found. There's nothing here.")
            }
          },
          {timeout: 3000},
        )
      })

      it('should accept a className to style the component', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel className="test-class" />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.getByTestId('filtered-action-list')).toHaveClass('test-class')
      })
    })

    describe('Empty state', () => {
      it('should display the default empty state message when there is no matching item after filtering (No custom message is provided)', async () => {
        const user = userEvent.setup()

        renderWithFlag(<FilterableSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.getAllByRole('option')).toHaveLength(3)

        await user.type(document.activeElement!, 'something')
        expect(screen.getByText('No items available')).toBeInTheDocument()
      })

      it('should display the default empty state message when there is no item after the initial load (No custom message is provided)', async () => {
        const user = userEvent.setup()

        renderWithFlag(<NoItemAvailableSelectPanel />, usingRemoveActiveDescendant)

        await waitFor(async () => {
          await user.click(screen.getByText('Select items'))
          expect(screen.getByText('No items available')).toBeInTheDocument()
        })
      })
      it('should display the custom empty state message when there is no matching item after filtering', async () => {
        const user = userEvent.setup()

        renderWithFlag(
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

        await user.click(screen.getByText('Select items'))

        expect(screen.getAllByRole('option')).toHaveLength(3)

        await user.type(document.activeElement!, 'something')
        expect(screen.getByText('No language found for something')).toBeInTheDocument()
        expect(screen.getByText('Adjust your search term to find other languages')).toBeInTheDocument()
      })

      it('should display the custom empty state message when there is no item after the initial load', async () => {
        const user = userEvent.setup()

        renderWithFlag(<SelectPanelWithCustomMessages items={[]} />, usingRemoveActiveDescendant)

        await waitFor(async () => {
          await user.click(screen.getByText('Select items'))
          expect(screen.getByText("You haven't created any projects yet")).toBeInTheDocument()
          expect(screen.getByText('Start your first project to organise your issues')).toBeInTheDocument()
        })
      })

      it('should display action button in custom empty state message', async () => {
        const handleAction = vi.fn()
        const user = userEvent.setup()

        renderWithFlag(
          <SelectPanelWithCustomMessages items={[]} withAction={true} onAction={handleAction} />,
          usingRemoveActiveDescendant,
        )

        await waitFor(async () => {
          await user.click(screen.getByText('Select items'))
          expect(screen.getByText("You haven't created any projects yet")).toBeInTheDocument()
          expect(screen.getByText('Start your first project to organise your issues')).toBeInTheDocument()

          // Check that action button is in the document
          const actionButton = screen.getByTestId('create-project-action')
          expect(actionButton).toBeInTheDocument()
          expect(actionButton).toHaveTextContent('Create new project')
        })

        // Test that action button is clickable
        const actionButton = screen.getByTestId('create-project-action')
        await user.click(actionButton)
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
        const user = userEvent.setup()

        renderWithFlag(<SelectPanelWithFooter />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))
        expect(screen.getByText('test footer')).toBeInTheDocument()
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
        const user = userEvent.setup()

        renderWithFlag(<SelectPanelWithGroups />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))
        const listbox = screen.getByRole('listbox')
        expect(listbox).toBeInTheDocument()
        expect(listbox).toHaveAttribute('aria-multiselectable', 'true')

        // listbox should has 3 groups and each have heading
        const groups = screen.getAllByRole('group')
        expect(groups).toHaveLength(3)
        expect(groups[0]).toHaveAttribute('aria-label', 'Group title 1')
        expect(groups[1]).toHaveAttribute('aria-label', 'Group title 2')
        expect(groups[2]).toHaveAttribute('aria-label', 'Group title 3')

        expect(screen.getAllByRole('option')).toHaveLength(4)
      })
      it('should select items within groups', async () => {
        const user = userEvent.setup()

        renderWithFlag(<SelectPanelWithGroups />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        // Select the first item
        await user.click(screen.getByRole('option', {name: 'Item 1'}))
        expect(
          screen.getByRole('option', {
            name: 'Item 1',
          }),
        ).toHaveAttribute('aria-selected', 'true')

        await user.click(screen.getByRole('option', {name: 'Item 3'}))
        expect(
          screen.getByRole('option', {
            name: 'Item 3',
          }),
        ).toHaveAttribute('aria-selected', 'true')

        await user.click(screen.getByRole('option', {name: 'Item 4'}))
        expect(
          screen.getByRole('option', {
            name: 'Item 4',
          }),
        ).toHaveAttribute('aria-selected', 'true')
      })
    })

    describe('As Modal', () => {
      it('selections render as radios when variant modal and single select', async () => {
        const user = userEvent.setup()

        renderWithFlag(
          <BasicSelectPanel variant="modal" onCancel={() => {}} selected={undefined} />,
          usingRemoveActiveDescendant,
        )

        await user.click(screen.getByText('Select items'))

        expect(screen.getAllByRole('radio', {hidden: true}).length).toBe(items.length)

        expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument()
      })
      it('save and oncancel buttons are present when variant modal', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel variant="modal" onCancel={() => {}} />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument()
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
        const user = userEvent.setup()

        renderWithFlag(
          <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
            <BasicSelectPanel items={items} selected={[items[1]]} />
          </FeatureFlags>,
          usingRemoveActiveDescendant,
        )

        await user.click(screen.getByText('item two')) // item two is selected so that's what the anchor text is

        const options = screen.getAllByRole('option')
        expect(options[0]).toHaveTextContent('item two') // item two is selected
        expect(options[1]).toHaveTextContent('item one')
        expect(options[2]).toHaveTextContent('item three')
      })
      it('should not render selected items at the top by default when FF off', async () => {
        const user = userEvent.setup()

        renderWithFlag(
          <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: false}}>
            <BasicSelectPanel items={items} selected={[items[1]]} />
          </FeatureFlags>,
          usingRemoveActiveDescendant,
        )

        await user.click(screen.getByText('item two')) // item two is selected so that's what the anchor text is

        const options = screen.getAllByRole('option')
        expect(options[0]).toHaveTextContent('item one')
        expect(options[1]).toHaveTextContent('item two') // item two is selected
        expect(options[2]).toHaveTextContent('item three')
      })
      it('should not render selected items at the top when showSelectedOptionsFirst set to false', async () => {
        const user = userEvent.setup()

        renderWithFlag(
          <BasicSelectPanel items={items} selected={[items[1]]} showSelectedOptionsFirst={false} />,
          usingRemoveActiveDescendant,
        )

        await user.click(screen.getByText('item two')) // item two is selected so that's what the anchor text is

        const options = screen.getAllByRole('option')
        expect(options[0]).toHaveTextContent('item one')
        expect(options[1]).toHaveTextContent('item two') // item two is selected
        expect(options[2]).toHaveTextContent('item three')
      })
    })

    describe('disableFullscreenOnNarrow prop', () => {
      const renderSelectPanelWithFlags = (flags: Record<string, boolean>, props: Record<string, unknown> = {}) => {
        return renderWithFlag(
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
            {...passthroughProps}
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
          />
        )
      }

      it('should opt out of fullscreen when disableFullscreenOnNarrow=true even when feature flag is enabled', async () => {
        const user = userEvent.setup()

        renderSelectPanelWithFlags(
          {
            primer_react_select_panel_fullscreen_on_narrow: true,
          },
          {disableFullscreenOnNarrow: true},
        )

        await user.click(screen.getByText('Select an item'))

        // When disableFullscreenOnNarrow=true, the ResponsiveCloseButton should not be present
        // even when the feature flag is enabled, indicating no fullscreen behavior
        const responsiveCloseButton = screen.queryByRole('button', {name: 'Cancel and close'})
        expect(responsiveCloseButton).not.toBeInTheDocument()
      })

      it('should use fullscreen behavior when disableFullscreenOnNarrow=false and feature flag is enabled', async () => {
        const user = userEvent.setup()

        renderSelectPanelWithFlags(
          {
            primer_react_select_panel_fullscreen_on_narrow: true,
          },
          {disableFullscreenOnNarrow: false},
        )

        await user.click(screen.getByText('Select an item'))

        // When feature flag is true and disableFullscreenOnNarrow is false, the ResponsiveCloseButton should be present
        // indicating fullscreen behavior is active
        const responsiveCloseButton = screen.getByRole('button', {name: 'Cancel and close'})
        expect(responsiveCloseButton).toBeInTheDocument()
      })

      it('should default to feature flag value when disableFullscreenOnNarrow is undefined', async () => {
        const user = userEvent.setup()

        // Test with feature flag disabled
        renderSelectPanelWithFlags({
          primer_react_select_panel_fullscreen_on_narrow: false,
        })

        await user.click(screen.getByText('Select an item'))

        // When feature flag is false and disableFullscreenOnNarrow is undefined,
        // the ResponsiveCloseButton should not be present
        const responsiveCloseButton = screen.queryByRole('button', {name: 'Cancel and close'})
        expect(responsiveCloseButton).not.toBeInTheDocument()
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
        const user = userEvent.setup()

        renderWithFlag(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.getByText('Select all')).toBeInTheDocument()
        expect(screen.getByRole('checkbox', {name: 'Select all'})).toBeInTheDocument()
        expect(screen.getByRole('checkbox', {name: 'Select all'})).not.toBeChecked()
      })

      it('should not render a Select All checkbox when showSelectAll is false', async () => {
        const user = userEvent.setup()

        renderWithFlag(<SelectAllSelectPanel showSelectAll={false} />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        expect(screen.queryByText('Select all')).not.toBeInTheDocument()
        expect(screen.queryByRole('checkbox', {name: 'Select all'})).not.toBeInTheDocument()
      })

      it('should select all items when the Select All checkbox is clicked', async () => {
        const user = userEvent.setup()

        renderWithFlag(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        await user.click(screen.getByRole('checkbox', {name: 'Select all'}))

        // All options should now be selected
        for (const item of items) {
          expect(screen.getByRole('option', {name: item.text})).toHaveAttribute('aria-selected', 'true')
        }
      })

      it('should deselect all items when the Deselect All checkbox is clicked', async () => {
        const user = userEvent.setup()

        renderWithFlag(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        // First select all
        await user.click(screen.getByRole('checkbox', {name: 'Select all'}))

        // Then deselect all
        await user.click(screen.getByRole('checkbox', {name: 'Deselect all'}))

        // All options should now be deselected
        for (const item of items) {
          if (item.text) {
            expect(screen.getByRole('option', {name: item.text})).toHaveAttribute('aria-selected', 'false')
          }
        }
      })

      it('should update Select All checkbox to indeterminate state when some items (but not all) are selected', async () => {
        const user = userEvent.setup()

        renderWithFlag(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        // Select only one item
        await user.click(screen.getByText('item one'))

        // Check that Select All is in indeterminate state
        const selectAllCheckbox = screen.getByRole('checkbox', {name: 'Select all'})
        expect(selectAllCheckbox).not.toBeChecked()
        expect(selectAllCheckbox).toHaveProperty('indeterminate', true)
      })

      it('should update Select All checkbox to checked when all items are selected manually', async () => {
        const user = userEvent.setup()

        renderWithFlag(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        // Select all items individually
        for (const item of items) {
          if (item.text) {
            await user.click(screen.getByText(item.text))
          }
        }

        // Check that Deselect All is checked
        expect(screen.getByRole('checkbox', {name: 'Deselect all'})).toBeChecked()
      })

      it('should update Select All checkbox label to "Deselect all" when all items are selected', async () => {
        const user = userEvent.setup()

        renderWithFlag(<SelectAllSelectPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        // Select all items
        await user.click(screen.getByRole('checkbox', {name: 'Select all'}))

        // Check that the label has changed to "Deselect all"
        expect(screen.getByText('Deselect all')).toBeInTheDocument()
        expect(screen.getByRole('checkbox', {name: 'Deselect all'})).toBeInTheDocument()
      })

      it('should apply Select All only to filtered items and maintain selection state when filters are cleared', async () => {
        const user = userEvent.setup()

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

        renderWithFlag(<FilterableSelectAllPanel />, usingRemoveActiveDescendant)

        await user.click(screen.getByText('Select items'))

        // Filter to only show "item one"
        await user.type(screen.getByLabelText('Filter items'), 'one')

        // Only "item one" should be visible
        expect(screen.getAllByRole('option')).toHaveLength(1)
        expect(screen.getByText('item one')).toBeInTheDocument()

        // Select all (which is just the one visible item)
        await user.click(screen.getByRole('checkbox', {name: 'Select all'}))

        // The visible item should be selected
        expect(screen.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'true')

        // Clear the filter
        await user.clear(screen.getByLabelText('Filter items'))

        // Now all items should be visible, but only "item one" should be selected
        expect(screen.getAllByRole('option')).toHaveLength(3)
        expect(screen.getByRole('option', {name: 'item one'})).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByRole('option', {name: 'item two'})).toHaveAttribute('aria-selected', 'false')
        expect(screen.getByRole('option', {name: 'item three'})).toHaveAttribute('aria-selected', 'false')

        // Select All checkbox should be in indeterminate state
        const selectAllCheckbox = screen.getByRole('checkbox', {name: 'Select all'})
        expect(selectAllCheckbox).not.toBeChecked()
        expect(selectAllCheckbox).toHaveProperty('indeterminate', true)
      })
    })
  })
}

import {render, screen, waitFor} from '@testing-library/react'
import React from 'react'
import {SelectPanel, type SelectPanelProps} from '../SelectPanel'
import type {ItemInput, GroupedListProps} from '../deprecated/ActionList/List'
import {userEvent} from '@testing-library/user-event'
import ThemeProvider from '../ThemeProvider'
import {FeatureFlags} from '../FeatureFlags'
import type {InitialLoadingType} from './SelectPanel'
import {getLiveRegion} from '../utils/testing'
import {IconButton} from '../Button'
import {ArrowLeftIcon} from '@primer/octicons-react'
import Box from '../Box'
import {setupMatchMedia} from '../utils/test-helpers'

setupMatchMedia()

const renderWithFlag = (children: React.ReactNode, flag: boolean) => {
  return render(
    <FeatureFlags flags={{primer_react_select_panel_with_modern_action_list: flag}}>{children}</FeatureFlags>,
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
    <ThemeProvider>
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
    </ThemeProvider>
  )
}

global.Element.prototype.scrollTo = jest.fn()

for (const useModernActionList of [false, true]) {
  describe('SelectPanel', () => {
    describe(`primer_react_select_panel_with_modern_action_list: ${useModernActionList}`, () => {
      it('should render an anchor to open the select panel using `placeholder`', () => {
        renderWithFlag(<BasicSelectPanel />, useModernActionList)

        expect(screen.getByText('Select items')).toBeInTheDocument()

        const trigger = screen.getByRole('button', {
          name: 'Select items',
        })
        expect(trigger).toHaveAttribute('aria-haspopup', 'true')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
      })

      it('should open the select panel when activating the trigger', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel />, useModernActionList)

        await user.click(screen.getByText('Select items'))

        // Verify that the button has `aria-expanded="true"` after opening
        const trigger = screen.getByRole('button', {
          name: 'Select items',
        })
        expect(trigger).toHaveAttribute('aria-expanded', 'true')

        // Verify that the input and listbox are visible
        expect(screen.getByLabelText('Filter items')).toBeVisible()
        expect(screen.getByRole('listbox')).toBeVisible()

        expect(screen.getByLabelText('Filter items')).toHaveFocus()
      })

      it('should close the select panel when pressing Escape', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel />, useModernActionList)

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
          useModernActionList,
        )

        await user.click(screen.getByText('Select items'))
        await user.click(screen.getByText('outer button'))

        expect(screen.getByRole('button', {name: 'Select items'})).toHaveAttribute('aria-expanded', 'false')
      })

      it('should open a dialog that is labelled by `title` and described by `subtitle`', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel />, useModernActionList)

        await user.click(screen.getByText('Select items'))

        expect(
          screen.getByRole('dialog', {
            name: 'test title',
            description: 'test subtitle',
          }),
        ).toBeInTheDocument()
      })

      it('should call `onOpenChange` when opening and closing the dialog', async () => {
        const onOpenChange = jest.fn()

        function SelectPanelOpenChange() {
          const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
          const [filter, setFilter] = React.useState('')
          const [open, setOpen] = React.useState(false)

          const onSelectedChange = (selected: SelectPanelProps['items']) => {
            setSelected(selected)
          }

          return (
            <ThemeProvider>
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
            </ThemeProvider>
          )
        }

        const user = userEvent.setup()

        renderWithFlag(<SelectPanelOpenChange />, useModernActionList)

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

        renderWithFlag(<BasicSelectPanel />, useModernActionList)
        await user.click(screen.getByText('Select items'))
        expect(screen.getByRole('listbox', {name: 'test title'})).toBeInTheDocument()
      })

      it('should label the list by aria-label when explicitly passed', async () => {
        const user = userEvent.setup()

        renderWithFlag(<BasicSelectPanel aria-label="Custom label" />, useModernActionList)
        await user.click(screen.getByText('Select items'))
        expect(screen.getByRole('listbox', {name: 'Custom label'})).toBeInTheDocument()
      })

      it('should focus the filter input on open', async () => {
        const user = userEvent.setup()

        // This panel contains another focusable thing (the IconButton) that should not receive focus
        // when the panel opens.
        renderWithFlag(
          <ThemeProvider>
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
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                  <IconButton icon={ArrowLeftIcon} aria-label="Back" />
                  <span>Title</span>
                </Box>
              }
            />
          </ThemeProvider>,
          useModernActionList,
        )

        await user.click(screen.getByText('Select items'))
        expect(screen.getByLabelText('Filter items')).toHaveFocus()
      })

      describe('selection', () => {
        it('should select an active option when activated', async () => {
          const user = userEvent.setup()

          renderWithFlag(<BasicSelectPanel />, useModernActionList)

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

          renderWithFlag(<BasicSelectPanel />, useModernActionList)

          await user.click(screen.getByText('Select items'))

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
        })

        it('should support navigating through items with PageDown and PageUp', async () => {
          if (!useModernActionList) return // this feature is only enabled with feature flag on

          const user = userEvent.setup()

          renderWithFlag(<BasicSelectPanel />, useModernActionList)

          await user.click(screen.getByText('Select items'))

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
              <ThemeProvider>
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
              </ThemeProvider>
            )
          }

          renderWithFlag(<Fixture />, useModernActionList)

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
          <ThemeProvider>
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
          </ThemeProvider>
        )
      }

      describe('filtering', () => {
        it('should filter the list of items when the user types into the input', async () => {
          const user = userEvent.setup()

          renderWithFlag(<FilterableSelectPanel />, useModernActionList)

          await user.click(screen.getByText('Select items'))

          expect(screen.getAllByRole('option')).toHaveLength(3)

          await user.type(document.activeElement!, 'two')
          expect(screen.getAllByRole('option')).toHaveLength(1)
        })
      })

      describe('screen reader announcements', () => {
        // this is only implemented with the feature flag
        if (!useModernActionList) return

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
            <ThemeProvider>
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
            </ThemeProvider>
          )
        }

        it('displays a loading spinner on first open', async () => {
          const user = userEvent.setup()

          renderWithFlag(<LoadingSelectPanel />, useModernActionList)

          await user.click(screen.getByText('Select items'))

          expect(screen.getByTestId('filtered-action-list-spinner')).toBeTruthy()
        })

        it('displays a loading skeleton on first open', async () => {
          const user = userEvent.setup()

          renderWithFlag(<LoadingSelectPanel initialLoadingType="skeleton" />, useModernActionList)

          await user.click(screen.getByText('Select items'))

          expect(screen.getByTestId('filtered-action-list-skeleton')).toBeTruthy()
        })

        it('displays a loading spinner in the text input if items are already loaded', async () => {
          const user = userEvent.setup()

          renderWithFlag(<LoadingSelectPanel items={items} />, useModernActionList)

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
          renderWithFlag(<FilterableSelectPanel />, useModernActionList)

          await user.click(screen.getByText('Select items'))
          expect(screen.getByLabelText('Filter items')).toHaveFocus()

          // we wait because announcement is intentionally updated after a timeout to not interrupt user input
          await waitFor(async () => {
            expect(getLiveRegion().getMessage('polite')).toBe(
              'List updated, Focused item: item one, not selected, 1 of 3',
            )
          })
        })

        it('should announce filtered results', async () => {
          const user = userEvent.setup()
          renderWithFlag(<FilterableSelectPanel />, useModernActionList)

          await user.click(screen.getByText('Select items'))
          expect(screen.getByLabelText('Filter items')).toHaveFocus()

          await waitFor(
            async () => {
              expect(getLiveRegion().getMessage('polite')).toBe(
                'List updated, Focused item: item one, not selected, 1 of 3',
              )
            },
            {timeout: 3000}, // increased timeout because we don't want the test to compare with previous announcement
          )

          await user.type(document.activeElement!, 'o')
          expect(screen.getAllByRole('option')).toHaveLength(2)

          await waitFor(
            async () => {
              expect(getLiveRegion().getMessage('polite')).toBe(
                'List updated, Focused item: item one, not selected, 1 of 2',
              )
            },
            {timeout: 3000}, // increased timeout because we don't want the test to compare with previous announcement
          )

          await user.type(document.activeElement!, 'ne') // now: one
          expect(screen.getAllByRole('option')).toHaveLength(1)

          await waitFor(async () => {
            expect(getLiveRegion().getMessage('polite')).toBe(
              'List updated, Focused item: item one, not selected, 1 of 1',
            )
          })
        })

        it('should announce when no results are available', async () => {
          const user = userEvent.setup()
          renderWithFlag(<FilterableSelectPanel />, useModernActionList)

          await user.click(screen.getByText('Select items'))

          await user.type(document.activeElement!, 'zero')
          expect(screen.queryByRole('option')).toBeNull()

          await waitFor(async () => {
            expect(getLiveRegion().getMessage('polite')).toBe('No matching items.')
          })
        })

        it('should accept a className to style the component', async () => {
          const user = userEvent.setup()

          renderWithFlag(<BasicSelectPanel className="test-class" />, useModernActionList)

          await user.click(screen.getByText('Select items'))

          expect(screen.getByTestId('filtered-action-list')).toHaveClass('test-class')
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
            <ThemeProvider>
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
            </ThemeProvider>
          )
        }

        it('should render the provided `footer` at the bottom of the dialog', async () => {
          const user = userEvent.setup()

          renderWithFlag(<SelectPanelWithFooter />, useModernActionList)

          await user.click(screen.getByText('Select items'))
          expect(screen.getByText('test footer')).toBeVisible()
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
          <ThemeProvider>
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
          </ThemeProvider>
        )
      }

      describe('with groups', () => {
        it('should render groups with items', async () => {
          const user = userEvent.setup()

          renderWithFlag(<SelectPanelWithGroups />, useModernActionList)

          await user.click(screen.getByText('Select items'))
          const listbox = screen.getByRole('listbox')
          expect(listbox).toBeVisible()
          expect(listbox).toHaveAttribute('aria-multiselectable', 'true')

          // listbox should has 3 groups and each have heading
          if (useModernActionList) {
            const groups = screen.getAllByRole('group')
            expect(groups).toHaveLength(3)
            expect(groups[0]).toHaveAttribute('aria-label', 'Group title 1')
            expect(groups[1]).toHaveAttribute('aria-label', 'Group title 2')
            expect(groups[2]).toHaveAttribute('aria-label', 'Group title 3')
          } else {
            const headings = screen.getAllByRole('heading')
            expect(headings[1]).toHaveTextContent('Group title 1')
            expect(headings[2]).toHaveTextContent('Group title 2')
            expect(headings[3]).toHaveTextContent('Group title 3')
          }

          expect(screen.getAllByRole('option')).toHaveLength(4)
        })
        it('should select items within groups', async () => {
          const user = userEvent.setup()

          renderWithFlag(<SelectPanelWithGroups />, useModernActionList)

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
    })
  })
}

import {render, fireEvent, act} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import React from 'react'
import {describe, test, expect, vi} from 'vitest'
import {Tabs, TabList, Tab, TabPanel} from './Tabs'
import {useTabList} from './useTabList'
import {FeatureFlags} from '../../FeatureFlags'
import {implementsClassName} from '../../utils/testing'

describe('Tabs', () => {
  implementsClassName(TabList)
  implementsClassName(props => (
    <Tabs defaultValue="a">
      <TabList aria-label="Test tabs">
        <Tab {...props} />
      </TabList>
    </Tabs>
  ))
  implementsClassName(props => (
    <Tabs defaultValue="a">
      <TabPanel {...props}></TabPanel>
    </Tabs>
  ))
  test('`defaultValue` sets the default selected tab', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabB = page.getByRole('tab', {name: 'Tab B'})
    const tabC = page.getByRole('tab', {name: 'Tab C'})

    await expect.element(tabA).toHaveAttribute('aria-selected', 'true')
    await expect.element(tabB).toHaveAttribute('aria-selected', 'false')
    await expect.element(tabC).toHaveAttribute('aria-selected', 'false')
  })

  test('`value` prop controls the selected tab when provided', async () => {
    function Wrapper() {
      const [value, setValue] = React.useState('a')
      return (
        <Tabs value={value} onValueChange={({value}) => setValue(value)}>
          <TabList aria-label="Tablist">
            <Tab value="a">Tab A</Tab>
            <Tab value="b">Tab B</Tab>
            <Tab value="c">Tab C</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
          <TabPanel value="c">Panel C</TabPanel>
        </Tabs>
      )
    }

    render(<Wrapper />)

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    await expect.element(tabA).toHaveAttribute('aria-selected', 'true')
  })

  test('onValueChange is called when tab changes', async () => {
    const onValueChange = vi.fn()

    render(
      <Tabs defaultValue="a" onValueChange={onValueChange}>
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    )

    const tabB = page.getByRole('tab', {name: 'Tab B'})
    await userEvent.click(tabB)

    expect(onValueChange).toHaveBeenCalledWith({value: 'b'})
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  test('onValueChange is not called when the selected tab is re-selected', async () => {
    const onValueChange = vi.fn()

    render(
      <Tabs defaultValue="a" onValueChange={onValueChange}>
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    )

    await userEvent.click(page.getByRole('tab', {name: 'Tab A'}))

    expect(onValueChange).not.toHaveBeenCalled()
  })

  describe('TabList', () => {
    test('renders with role="tablist"', async () => {
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="Test tabs">
            <Tab value="a">Tab A</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
        </Tabs>,
      )

      const tablist = page.getByRole('tablist')
      await expect.element(tablist).toBeInTheDocument()
      await expect.element(tablist).toHaveAttribute('aria-label', 'Test tabs')
    })

    test('supports labeling with aria-label', async () => {
      render(
        <div>
          <Tabs defaultValue="a">
            <TabList aria-label="Test Tabs">
              <Tab value="a">Tab A</Tab>
            </TabList>
            <TabPanel value="a">Panel A</TabPanel>
          </Tabs>
        </div>,
      )

      await expect
        .element(
          page.getByRole('tablist', {
            name: 'Test Tabs',
          }),
        )
        .toBeInTheDocument()
    })

    test('supports labeling with aria-labelledby', async () => {
      render(
        <div>
          <span id="tabs-label">test</span>
          <Tabs defaultValue="a">
            <TabList aria-labelledby="tabs-label">
              <Tab value="a">Tab A</Tab>
            </TabList>
            <TabPanel value="a">Panel A</TabPanel>
          </Tabs>
        </div>,
      )

      await expect
        .element(
          page.getByRole('tablist', {
            name: 'test',
          }),
        )
        .toBeInTheDocument()
    })
  })

  describe('Tab', () => {
    test('renders with default tabIndex based on selection', async () => {
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="Test tabs">
            <Tab value="a">Tab A</Tab>
            <Tab value="b">Tab B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>,
      )

      const tabA = page.getByRole('tab', {name: 'Tab A'})
      const tabB = page.getByRole('tab', {name: 'Tab B'})

      await expect.element(tabA).toHaveAttribute('tabindex', '0')
      await expect.element(tabB).toHaveAttribute('tabindex', '-1')
    })

    test('sets `aria-disabled` to true when `disabled`', async () => {
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="Test tabs">
            <Tab value="a">Tab A</Tab>
            <Tab value="b" disabled>
              Tab B
            </Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>,
      )

      const tabB = page.getByRole('tab', {name: 'Tab B'})
      await expect.element(tabB).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('TabPanel', () => {
    test('renders with role="tabpanel"', async () => {
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="Test tabs">
            <Tab value="a">Tab A</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
        </Tabs>,
      )

      const panel = page.getByRole('tabpanel')
      await expect.element(panel).toBeInTheDocument()
      await expect.element(panel).toHaveTextContent('Panel A')
    })
  })

  test('Tab and TabPanel are properly associated with aria attributes', () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
      </Tabs>,
    )

    const tab = page.getByRole('tab', {name: 'Tab A'})
    const panel = page.getByRole('tabpanel')

    const tabId = tab.element().getAttribute('id')
    const panelId = panel.element().getAttribute('id')
    const tabControls = tab.element().getAttribute('aria-controls')
    const panelLabelledBy = panel.element().getAttribute('aria-labelledby')

    expect(tabId).toBeTruthy()
    expect(panelId).toBeTruthy()
    expect(tabControls).toBe(panelId)
    expect(panelLabelledBy).toBe(tabId)
  })

  test('TabPanel has data-selected attribute when selected', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    )

    const panelA = page.getByText('Panel A')
    const panelB = page.getByText('Panel B')

    await expect.element(panelA).toHaveAttribute('data-selected', '')
    await expect.element(panelB).not.toHaveAttribute('data-selected')
  })

  test('clicking a tab selects it', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabB = page.getByRole('tab', {name: 'Tab B'})
    await userEvent.click(tabB)

    await expect.element(tabB).toHaveAttribute('aria-selected', 'true')
    await expect.element(tabB).toHaveAttribute('tabindex', '0')
  })

  test('ArrowRight navigates to next tab', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabB = page.getByRole('tab', {name: 'Tab B'})

    act(() => tabA.element().focus())
    await userEvent.keyboard('{ArrowRight}')

    await expect.element(tabB).toHaveFocus()
  })

  test('ArrowRight wraps from last tab to first tab', async () => {
    render(
      <Tabs defaultValue="c">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabC = page.getByRole('tab', {name: 'Tab C'})

    act(() => tabC.element().focus())
    await userEvent.keyboard('{ArrowRight}')

    await expect.element(tabA).toHaveFocus()
  })

  test('ArrowLeft navigates to previous tab', async () => {
    render(
      <Tabs defaultValue="b">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabB = page.getByRole('tab', {name: 'Tab B'})

    act(() => tabB.element().focus())
    await userEvent.keyboard('{ArrowLeft}')

    await expect.element(tabA).toHaveFocus()
  })

  test('ArrowLeft wraps from first tab to last tab', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabC = page.getByRole('tab', {name: 'Tab C'})

    act(() => tabA.element().focus())
    await userEvent.keyboard('{ArrowLeft}')

    await expect.element(tabC).toHaveFocus()
  })

  test('Home key navigates to first tab', async () => {
    render(
      <Tabs defaultValue="c">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabC = page.getByRole('tab', {name: 'Tab C'})

    act(() => tabC.element().focus())
    await userEvent.keyboard('{Home}')

    await expect.element(tabA).toHaveFocus()
  })

  test('End key navigates to last tab', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabC = page.getByRole('tab', {name: 'Tab C'})
    act(() => tabA.element().focus())
    await userEvent.keyboard('{End}')

    await expect.element(tabC).toHaveFocus()
  })

  test('Space key activates focused tab', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabB = page.getByRole('tab', {name: 'Tab B'})

    act(() => tabA.element().focus())
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard(' ')

    await expect.element(tabB).toHaveAttribute('aria-selected', 'true')
  })

  test('Enter key activates focused tab', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabB = page.getByRole('tab', {name: 'Tab B'})

    act(() => tabA.element().focus())
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{Enter}')

    await expect.element(tabB).toHaveAttribute('aria-selected', 'true')
  })

  test('focusing a non-selected tab selects it', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    )

    const tabB = page.getByRole('tab', {name: 'Tab B'})

    act(() => {
      tabB.element().focus()
    })

    await expect.element(tabB).toHaveAttribute('aria-selected', 'true')
  })

  test('disabled tabs are skipped during keyboard navigation', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b" disabled>
            Tab B
          </Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabC = page.getByRole('tab', {name: 'Tab C'})

    act(() => tabA.element().focus())
    await userEvent.keyboard('{ArrowRight}')

    await expect.element(tabC).toHaveFocus()
  })

  test('clicking disabled tab does not select it', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b" disabled>
            Tab B
          </Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabB = page.getByRole('tab', {name: 'Tab B'})

    // Verify the disabled tab has aria-disabled attribute
    await expect.element(tabB).toHaveAttribute('aria-disabled', 'true')

    await act(() => {
      fireEvent.click(tabB.element())
    })

    // The selected tab should remain the same (tabA)
    await expect.element(tabA).toHaveAttribute('aria-selected', 'true')
    await expect.element(tabB).toHaveAttribute('aria-selected', 'false')
  })

  test('only selected tab is included in tab sequence', async () => {
    render(
      <Tabs defaultValue="b">
        <TabList aria-label="Test tabs">
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    )

    const tabA = page.getByRole('tab', {name: 'Tab A'})
    const tabB = page.getByRole('tab', {name: 'Tab B'})
    const tabC = page.getByRole('tab', {name: 'Tab C'})

    await expect.element(tabA).toHaveAttribute('tabindex', '-1')
    await expect.element(tabB).toHaveAttribute('tabindex', '0')
    await expect.element(tabC).toHaveAttribute('tabindex', '-1')
  })

  describe('manual activation', () => {
    const renderManualTabs = (onValueChange?: (args: {value: string}) => void) =>
      render(
        <Tabs defaultValue="a" activationMode="manual" onValueChange={onValueChange}>
          <TabList aria-label="Test tabs">
            <Tab value="a">Tab A</Tab>
            <Tab value="b">Tab B</Tab>
            <Tab value="c">Tab C</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
          <TabPanel value="c">Panel C</TabPanel>
        </Tabs>,
      )

    test('arrow keys move focus without changing selection', async () => {
      const onValueChange = vi.fn()
      renderManualTabs(onValueChange)

      const tabA = page.getByRole('tab', {name: 'Tab A'})
      const tabB = page.getByRole('tab', {name: 'Tab B'})

      act(() => tabA.element().focus())
      await userEvent.keyboard('{ArrowRight}')

      await expect.element(tabB).toHaveFocus()
      await expect.element(tabA).toHaveAttribute('aria-selected', 'true')
      await expect.element(tabB).toHaveAttribute('aria-selected', 'false')
      expect(onValueChange).not.toHaveBeenCalled()
      await expect.element(tabB).toHaveAttribute('tabindex', '0')
      await expect.element(tabA).toHaveAttribute('tabindex', '-1')
    })

    test('Enter commits the focused tab', async () => {
      const onValueChange = vi.fn()
      renderManualTabs(onValueChange)

      const tabA = page.getByRole('tab', {name: 'Tab A'})
      const tabB = page.getByRole('tab', {name: 'Tab B'})

      act(() => tabA.element().focus())
      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard('{Enter}')

      await expect.element(tabB).toHaveAttribute('aria-selected', 'true')
      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onValueChange).toHaveBeenCalledWith({value: 'b'})
    })

    test('Space commits the focused tab', async () => {
      const onValueChange = vi.fn()
      renderManualTabs(onValueChange)

      const tabA = page.getByRole('tab', {name: 'Tab A'})
      const tabC = page.getByRole('tab', {name: 'Tab C'})

      act(() => tabA.element().focus())
      await userEvent.keyboard('{ArrowLeft}')
      await userEvent.keyboard(' ')

      await expect.element(tabC).toHaveAttribute('aria-selected', 'true')
      expect(onValueChange).toHaveBeenCalledWith({value: 'c'})
    })

    test('clicking commits selection', async () => {
      const onValueChange = vi.fn()
      renderManualTabs(onValueChange)

      const tabB = page.getByRole('tab', {name: 'Tab B'})

      await tabB.click()

      await expect.element(tabB).toHaveAttribute('aria-selected', 'true')
      expect(onValueChange).toHaveBeenCalledWith({value: 'b'})
    })

    test('subsequent arrow keys move relative to the focused tab, not the selected tab', async () => {
      renderManualTabs()

      const tabA = page.getByRole('tab', {name: 'Tab A'})
      const tabB = page.getByRole('tab', {name: 'Tab B'})
      const tabC = page.getByRole('tab', {name: 'Tab C'})

      act(() => tabA.element().focus())
      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard('{ArrowRight}')

      await expect.element(tabA).toHaveAttribute('aria-selected', 'true')
      await expect.element(tabC).toHaveFocus()
      await expect.element(tabB).not.toHaveFocus()
    })
  })
})

function TabListRefHarness({tabRef}: {tabRef: React.Ref<HTMLDivElement | null>}) {
  const {tabListProps} = useTabList<HTMLDivElement>({'aria-label': 'Test tabs', ref: tabRef})
  return (
    // @ts-expect-error it needs a non nullable ref
    <div {...tabListProps} />
  )
}

describe('useTabList forwarded ref (primer_react_merged_forwarded_refs)', () => {
  for (const enabled of [true, false]) {
    describe(`with the flag ${enabled ? 'enabled' : 'disabled'}`, () => {
      test('forwards a ref object to the tablist', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <TabListRefHarness tabRef={ref} />
          </FeatureFlags>,
        )
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      test('calls a callback ref with the tablist', () => {
        const refCallback = vi.fn()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <TabListRefHarness tabRef={refCallback} />
          </FeatureFlags>,
        )
        expect(refCallback.mock.calls.some(([el]) => el instanceof HTMLDivElement)).toBe(true)
      })
    })
  }
})

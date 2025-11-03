import {render, screen} from '@testing-library/react'
import {userEvent} from 'vitest/browser'
import React from 'react'
import {describe, test, expect, vi} from 'vitest'
import {Tabs, TabList, Tab, TabPanel} from '.'

describe('Tabs', () => {
  test('`defaultValue` sets the default selected tab', () => {
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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabB = screen.getByRole('tab', {name: 'Tab B'})
    const tabC = screen.getByRole('tab', {name: 'Tab C'})

    expect(tabA).toHaveAttribute('aria-selected', 'true')
    expect(tabB).toHaveAttribute('aria-selected', 'false')
    expect(tabC).toHaveAttribute('aria-selected', 'false')
  })

  test('`value` prop controls the selected tab when provided', async () => {
    function Wrapper() {
      const [value, setValue] = React.useState('a')
      return (
        <Tabs defaultValue="a" value={value} onValueChange={({value}) => setValue(value)}>
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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    expect(tabA).toHaveAttribute('aria-selected', 'true')
  })

  test('onValueChange is called when tab changes', async () => {
    const user = userEvent.setup()
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

    const tabB = screen.getByRole('tab', {name: 'Tab B'})
    await user.click(tabB)

    expect(onValueChange).toHaveBeenCalledWith({value: 'b'})
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  describe('TabList', () => {
    test('renders with role="tablist"', () => {
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="Test tabs">
            <Tab value="a">Tab A</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
        </Tabs>,
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toBeInTheDocument()
      expect(tablist).toHaveAttribute('aria-label', 'Test tabs')
    })

    test('supports labeling with aria-label', () => {
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

      expect(
        screen.getByRole('tablist', {
          name: 'test',
        }),
      ).toBeInTheDocument()
    })

    test('supports labeling with aria-labelledby', () => {
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

      expect(
        screen.getByRole('tablist', {
          name: 'test',
        }),
      ).toBeInTheDocument()
    })
  })

  describe('Tab', () => {
    test('renders with default tabIndex based on selection', () => {
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

      const tabA = screen.getByRole('tab', {name: 'Tab A'})
      const tabB = screen.getByRole('tab', {name: 'Tab B'})

      expect(tabA).toHaveAttribute('tabindex', '0')
      expect(tabB).toHaveAttribute('tabindex', '-1')
    })

    test('sets `aria-disabled` to true when `disabled`', () => {
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

      const tabB = screen.getByRole('tab', {name: 'Tab B'})
      expect(tabB).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('TabPanel', () => {
    test('renders with role="tabpanel"', () => {
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="Test tabs">
            <Tab value="a">Tab A</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
        </Tabs>,
      )

      const panel = screen.getByRole('tabpanel')
      expect(panel).toBeInTheDocument()
      expect(panel).toHaveTextContent('Panel A')
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

    const tab = screen.getByRole('tab', {name: 'Tab A'})
    const panel = screen.getByRole('tabpanel')

    const tabId = tab.getAttribute('id')
    const panelId = panel.getAttribute('id')
    const tabControls = tab.getAttribute('aria-controls')
    const panelLabelledBy = panel.getAttribute('aria-labelledby')

    expect(tabId).toBeTruthy()
    expect(panelId).toBeTruthy()
    expect(tabControls).toBe(panelId)
    expect(panelLabelledBy).toBe(tabId)
  })

  test('TabPanel has data-selected attribute when selected', () => {
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

    const panelA = screen.getByText('Panel A')
    const panelB = screen.getByText('Panel B')

    expect(panelA).toHaveAttribute('data-selected', '')
    expect(panelB).not.toHaveAttribute('data-selected')
  })

  test('clicking a tab selects it', async () => {
    const user = userEvent.setup()

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

    const tabB = screen.getByRole('tab', {name: 'Tab B'})
    await user.click(tabB)

    expect(tabB).toHaveAttribute('aria-selected', 'true')
    expect(tabB).toHaveAttribute('tabindex', '0')
  })

  test('ArrowRight navigates to next tab', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabB = screen.getByRole('tab', {name: 'Tab B'})

    tabA.focus()
    await user.keyboard('{ArrowRight}')

    expect(tabB).toHaveFocus()
  })

  test('ArrowRight wraps from last tab to first tab', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabC = screen.getByRole('tab', {name: 'Tab C'})

    tabC.focus()
    await user.keyboard('{ArrowRight}')

    expect(tabA).toHaveFocus()
  })

  test('ArrowLeft navigates to previous tab', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabB = screen.getByRole('tab', {name: 'Tab B'})

    tabB.focus()
    await user.keyboard('{ArrowLeft}')

    expect(tabA).toHaveFocus()
  })

  test('ArrowLeft wraps from first tab to last tab', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabC = screen.getByRole('tab', {name: 'Tab C'})

    tabA.focus()
    await user.keyboard('{ArrowLeft}')

    expect(tabC).toHaveFocus()
  })

  test('Home key navigates to first tab', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabC = screen.getByRole('tab', {name: 'Tab C'})

    tabC.focus()
    await user.keyboard('{Home}')

    expect(tabA).toHaveFocus()
  })

  test('End key navigates to last tab', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabC = screen.getByRole('tab', {name: 'Tab C'})

    tabA.focus()
    await user.keyboard('{End}')

    expect(tabC).toHaveFocus()
  })

  test('Space key activates focused tab', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabB = screen.getByRole('tab', {name: 'Tab B'})

    tabA.focus()
    await user.keyboard('{ArrowRight}')
    await user.keyboard(' ')

    expect(tabB).toHaveAttribute('aria-selected', 'true')
  })

  test('Enter key activates focused tab', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabB = screen.getByRole('tab', {name: 'Tab B'})

    tabA.focus()
    await user.keyboard('{ArrowRight}')
    await user.keyboard('{Enter}')

    expect(tabB).toHaveAttribute('aria-selected', 'true')
  })

  test('focusing a non-selected tab selects it', async () => {
    const user = userEvent.setup()

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

    const tabB = screen.getByRole('tab', {name: 'Tab B'})

    await user.tab()
    await user.tab()

    expect(tabB).toHaveAttribute('aria-selected', 'true')
  })

  test('disabled tabs are skipped during keyboard navigation', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabC = screen.getByRole('tab', {name: 'Tab C'})

    tabA.focus()
    await user.keyboard('{ArrowRight}')

    expect(tabC).toHaveFocus()
  })

  test('clicking disabled tab does not select it', async () => {
    const user = userEvent.setup()

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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabB = screen.getByRole('tab', {name: 'Tab B'})

    await user.click(tabB)

    expect(tabA).toHaveAttribute('aria-selected', 'true')
    expect(tabB).toHaveAttribute('aria-selected', 'false')
  })

  test('only selected tab is included in tab sequence', () => {
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

    const tabA = screen.getByRole('tab', {name: 'Tab A'})
    const tabB = screen.getByRole('tab', {name: 'Tab B'})
    const tabC = screen.getByRole('tab', {name: 'Tab C'})

    expect(tabA).toHaveAttribute('tabindex', '-1')
    expect(tabB).toHaveAttribute('tabindex', '0')
    expect(tabC).toHaveAttribute('tabindex', '-1')
  })
})

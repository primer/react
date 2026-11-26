import {describe, expect, it} from 'vitest'
import TabNav from '..'
import {render, act} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {Button} from '../../Button'
import {implementsClassName} from '../../utils/testing'
import classes from '../TabNav.module.css'

describe('TabNav', () => {
  implementsClassName(TabNav)
  const tabNavMarkup = (
    <div>
      <TabNav>
        <TabNav.Link id="first" href="#" as="div">
          First
        </TabNav.Link>
        <TabNav.Link id="middle" href="#" selected as="div">
          Middle
          <a href="https://example.com">Focusable Link</a>
        </TabNav.Link>
        <TabNav.Link id="last" href="#">
          Last
        </TabNav.Link>
      </TabNav>
      <Button id="my-button">My Button</Button>
    </div>
  )

  describe('TabNav.Link', () => {
    implementsClassName(TabNav.Link, classes.TabNavLink)
    it('renders without crashing', async () => {
      render(<TabNav.Link href="#">Link Text</TabNav.Link>)
      await expect.element(page.getByText('Link Text')).toBeInTheDocument()
    })
  })

  it('renders data-component attributes', async () => {
    render(
      <TabNav>
        <TabNav.Link href="#">Link Text</TabNav.Link>
      </TabNav>,
    )

    await expect
      .element(page.getByRole('navigation').element().parentElement)
      .toHaveAttribute('data-component', 'TabNav')
    await expect.element(page.getByRole('tab')).toHaveAttribute('data-component', 'TabNav.Link')
  })

  it('sets aria-label appropriately', async () => {
    render(<TabNav aria-label="Test label" />)
    await expect.element(page.getByLabelText('Test label')).toBeInTheDocument()
    expect(page.getByLabelText('Test label').element().tagName).toEqual('NAV')
  })

  it('selects a tab when tab is loaded', async () => {
    render(tabNavMarkup)
    await expect.element(page.getByRole('tab', {name: /Middle/})).toHaveClass('selected')
  })

  it('selects next tab when pressing right arrow', async () => {
    render(tabNavMarkup)
    const middleTab = page.getByRole('tab', {name: /Middle/})
    const lastTab = page.getByRole('tab', {name: 'Last'})

    act(() => middleTab.element().focus())
    await userEvent.keyboard('{ArrowRight}')

    await expect.element(lastTab).toHaveFocus()
  })

  it('selects previous tab when pressing left arrow', async () => {
    render(tabNavMarkup)
    const middleTab = page.getByRole('tab', {name: /Middle/})
    const firstTab = page.getByRole('tab', {name: 'First'})

    act(() => middleTab.element().focus())
    await userEvent.keyboard('{ArrowLeft}')

    await expect.element(firstTab).toHaveFocus()
  })

  it('selects last tab when pressing left arrow on first tab', async () => {
    render(tabNavMarkup)
    const firstTab = page.getByRole('tab', {name: 'First'})
    const lastTab = page.getByRole('tab', {name: 'Last'})

    act(() => firstTab.element().focus())
    await userEvent.keyboard('{ArrowLeft}')

    await expect.element(lastTab).toHaveFocus()
  })

  it('selects first tab when pressing right arrow on last tab', async () => {
    render(tabNavMarkup)
    const lastTab = page.getByRole('tab', {name: 'Last'})
    const firstTab = page.getByRole('tab', {name: 'First'})

    act(() => lastTab.element().focus())
    await userEvent.keyboard('{ArrowRight}')

    await expect.element(firstTab).toHaveFocus()
  })

  it('moves focus away from TabNav when pressing tab', async () => {
    render(tabNavMarkup)
    const middleTab = page.getByRole('tab', {name: /Middle/})
    const link = page.getByText('Focusable Link')
    const button = page.getByRole('button')

    // Target the tab's padding rather than its nested link.
    await userEvent.click(middleTab, {position: {x: 5, y: 5}})
    await expect.element(middleTab).toHaveFocus()
    await userEvent.tab()

    await expect.element(link).toHaveFocus()
    await userEvent.tab()

    await expect.element(button).toHaveFocus()
  })

  it('moves focus to selected tab when TabNav regains focus', async () => {
    render(tabNavMarkup)
    const middleTab = page.getByRole('tab', {name: /Middle/})
    const button = page.getByRole('button')

    await userEvent.click(button)
    await expect.element(button).toHaveFocus()
    await userEvent.tab({shift: true})

    await expect.element(middleTab).toHaveFocus()
  })
})

import {describe, expect, it} from 'vitest'
import TabNav from '..'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Button} from '../../Button'

describe('TabNav', () => {
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
    it('renders without crashing', () => {
      render(<TabNav.Link href="#">Link Text</TabNav.Link>)
      expect(screen.getByText('Link Text')).toBeInTheDocument()
    })
  })

  it('sets aria-label appropriately', () => {
    render(<TabNav aria-label="Test label" />)
    expect(screen.getByLabelText('Test label')).toBeTruthy()
    expect(screen.getByLabelText('Test label').tagName).toEqual('NAV')
  })

  it('selects a tab when tab is loaded', () => {
    render(tabNavMarkup)
    expect(screen.getByRole('tab', {name: /Middle/})).toHaveClass('selected')
  })

  it('selects next tab when pressing right arrow', () => {
    const {getByText} = render(tabNavMarkup)
    const middleTab = getByText('Middle')
    const lastTab = getByText('Last')

    middleTab.focus()
    middleTab.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}))

    expect(lastTab).toHaveFocus()
  })

  it('selects previous tab when pressing left arrow', () => {
    const {getByText} = render(tabNavMarkup)
    const middleTab = getByText('Middle')
    const firstTab = getByText('First')

    middleTab.focus()
    middleTab.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}))

    expect(firstTab).toHaveFocus()
  })

  it('selects last tab when pressing left arrow on first tab', () => {
    const {getByText} = render(tabNavMarkup)
    const firstTab = getByText('First')
    const lastTab = getByText('Last')

    firstTab.focus()
    firstTab.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}))

    expect(lastTab).toHaveFocus()
  })

  it('selects first tab when pressing right arrow on last tab', () => {
    render(tabNavMarkup)
    const lastTab = screen.getByText('Last')
    const firstTab = screen.getByText('First')

    lastTab.focus()
    lastTab.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}))

    expect(firstTab).toHaveFocus()
  })

  it('moves focus away from TabNav when pressing tab', async () => {
    const user = userEvent.setup()
    render(tabNavMarkup)
    const middleTab = screen.getByText('Middle')
    const link = screen.getByText('Focusable Link')
    const button = screen.getByRole('button')

    await user.click(middleTab)
    expect(middleTab).toHaveFocus()
    await user.tab()

    expect(link).toHaveFocus()
    await user.tab()

    expect(button).toHaveFocus()
  })

  it('moves focus to selected tab when TabNav regains focus', async () => {
    const user = userEvent.setup()
    render(tabNavMarkup)
    const middleTab = screen.getByText('Middle')
    const button = screen.getByRole('button')

    await user.click(button)
    expect(button).toHaveFocus()
    await user.tab({shift: true})

    expect(middleTab).toHaveFocus()
  })
})

import React from 'react'
import TabNav from '..'
import {behavesAsComponent, checkExports} from '../../utils/testing'
import {fireEvent, render as HTMLRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe} from 'jest-axe'
import {Button} from '../../Button'
import Box from '../../Box'

describe('TabNav', () => {
  const tabNavMarkup = (
    <Box>
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
    </Box>
  )

  behavesAsComponent({Component: TabNav})

  checkExports('TabNav', {
    default: TabNav,
  })

  describe('TabNav.Link', () => {
    behavesAsComponent({Component: TabNav.Link})
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<TabNav aria-label="Test Label" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('sets aria-label appropriately', () => {
    const {getByLabelText} = HTMLRender(<TabNav aria-label="Test label" />)
    expect(getByLabelText('Test label')).toBeTruthy()
    expect(getByLabelText('Test label').tagName).toEqual('NAV')
  })

  it('selects a tab when tab is loaded', () => {
    const {getByRole} = HTMLRender(tabNavMarkup)
    expect(getByRole('tab', {name: /Middle/})).toHaveClass('selected')
  })

  it('selects next tab when pressing right arrow', () => {
    const {getByText} = HTMLRender(tabNavMarkup)
    const middleTab = getByText('Middle')
    const lastTab = getByText('Last')

    fireEvent.focus(middleTab)
    fireEvent.keyDown(middleTab, {key: 'ArrowRight'})

    expect(lastTab).toHaveFocus()
  })

  it('selects previous tab when pressing left arrow', () => {
    const {getByText} = HTMLRender(tabNavMarkup)
    const middleTab = getByText('Middle')
    const firstTab = getByText('First')

    fireEvent.focus(middleTab)
    fireEvent.keyDown(middleTab, {key: 'ArrowLeft'})

    expect(firstTab).toHaveFocus()
  })

  it('selects last tab when pressing left arrow on first tab', () => {
    const {getByText} = HTMLRender(tabNavMarkup)
    const firstTab = getByText('First')
    const lastTab = getByText('Last')

    fireEvent.focus(firstTab)
    fireEvent.keyDown(firstTab, {key: 'ArrowLeft'})

    expect(lastTab).toHaveFocus()
  })

  it('selects first tab when pressing right arrow on last tab', () => {
    const {getByText} = HTMLRender(tabNavMarkup)
    const lastTab = getByText('Last')
    const firstTab = getByText('First')

    fireEvent.focus(lastTab)
    fireEvent.keyDown(lastTab, {key: 'ArrowRight'})

    expect(firstTab).toHaveFocus()
  })

  it('moves focus away from TabNav when pressing tab', async () => {
    const user = userEvent.setup()
    const {getByText, getByRole} = HTMLRender(tabNavMarkup)
    const middleTab = getByText('Middle')
    const link = getByText('Focusable Link')
    const button = getByRole('button')

    await user.click(middleTab)
    expect(middleTab).toHaveFocus()
    await user.tab()

    expect(link).toHaveFocus()
    await user.tab()

    expect(button).toHaveFocus()
  })

  it('moves focus to selected tab when TabNav regains focus', async () => {
    const user = userEvent.setup()
    const {getByText, getByRole} = HTMLRender(tabNavMarkup)
    const middleTab = getByText('Middle')
    const button = getByRole('button')

    await user.click(button)
    expect(button).toHaveFocus()
    await user.tab({shift: true})

    expect(middleTab).toHaveFocus()
  })
})

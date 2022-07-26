import React from 'react'
import {TabNav} from '..'
import {mount, behavesAsComponent, checkExports} from '../utils/testing'
import {fireEvent, render as HTMLRender, cleanup} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {Button} from '../Button'
import Box from '../Box'
expect.extend(toHaveNoViolations)

describe('TabNav', () => {
  const tabNavMarkup = (
    <Box>
      <TabNav>
        <TabNav.Link id="first" href="#" as="div">
          First
        </TabNav.Link>
        <TabNav.Link id="middle" href="#" selected>
          Middle
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
    default: TabNav
  })

  describe('TabNav.Link', () => {
    behavesAsComponent({Component: TabNav.Link})
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<TabNav aria-label="main" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('sets aria-label appropriately', () => {
    const {getByLabelText} = HTMLRender(<TabNav aria-label="stuff" />)
    expect(getByLabelText('stuff')).toBeTruthy()
    expect(getByLabelText('stuff').tagName).toEqual('NAV')
  })

  it('selects a tab when tab is loaded', () => {
    const component = mount(tabNavMarkup)
    const tab = component.find('#middle').first()
    expect(tab.getDOMNode().classList).toContain('selected')
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
    const button = getByRole('button')

    await user.click(middleTab)
    expect(middleTab).toHaveFocus()
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

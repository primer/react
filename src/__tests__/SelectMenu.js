import React from 'react'
import SelectMenu from '../SelectMenu'
import Button from '../Button'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

const BasicSelectMenu = () => {
  return (
    <SelectMenu>
      <Button as="summary">Projects</Button>
      <SelectMenu.Modal title="Projects">
        <SelectMenu.List>
          <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
          <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
          <SelectMenu.Divider>stuff</SelectMenu.Divider>
          <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
          <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
          <SelectMenu.Footer>footer</SelectMenu.Footer>
        </SelectMenu.List>
      </SelectMenu.Modal>
    </SelectMenu>
  )
}

const MenuWithTabs = () => {
  return (
    <SelectMenu>
      <Button as="summary">Projects</Button>
      <SelectMenu.Modal title="Projects">
        <SelectMenu.Tabs>
          <SelectMenu.Tab index={0} tabName="Repository"/>
          <SelectMenu.Tab index={1} tabName="Organization"/>
        </SelectMenu.Tabs>
        <SelectMenu.TabPanel tabName="Repository">
          <SelectMenu.Item href="#">Primer Components bugs</SelectMenu.Item>
          <SelectMenu.Item href="#">Primer Components roadmap</SelectMenu.Item>
          <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
          <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
        </SelectMenu.TabPanel>
        <SelectMenu.TabPanel tabName="Organization">
          <SelectMenu.Item href="#"> Project 2</SelectMenu.Item>
        </SelectMenu.TabPanel>
        <SelectMenu.Footer>Showing 3 of 3</SelectMenu.Footer>
      </SelectMenu.Modal>
    </SelectMenu>
  )
}

describe('SelectMenu', () => {
  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<BasicSelectMenu />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
  it('implements system props', () => {
    expect(SelectMenu).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(SelectMenu).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<SelectMenu as="span" />).type).toEqual('span')
  })

  it('snapshot matches', () => {
    expect(render(<SelectMenu />)).toMatchSnapshot()
  })

  // initialTab shows correct tab and applies hidden to the other tab

  // clicking on a tab opens the tab

  // clicking on the trigger opens the menu

  // selected list items have the selected icon showing

  // unselected list items do not have the selected icon showing

  // clicking on a list item calls onClick prop

  // clicking on tab calls onClick prop

  // clicking on an item closes the modal

})

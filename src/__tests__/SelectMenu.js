import React from 'react'
import SelectMenu from '../SelectMenu'
import Button from '../Button'
import {render, mount} from '../utils/testing'
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
          <SelectMenu.Item selected href="#">
            Primer Components bugs
          </SelectMenu.Item>
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
    <SelectMenu initialTab="Organization">
      <Button as="summary">Projects</Button>
      <SelectMenu.Modal title="Projects">
        <SelectMenu.Tabs>
          <SelectMenu.Tab index={0} tabName="Repository" />
          <SelectMenu.Tab index={1} data-test="orgTab" tabName="Organization" />
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

  // shallow rendering doesn't work because the component needs `ref` to be defined to render the keyboard hook
  // using mount returns [Function type] for the type
  it('respects the "as" prop', () => {
    expect(mount(<BasicSelectMenu as="span" />).type).toEqual('span')
  })

  // same as above, returns ReactWraper{} instead of snapshot
  it('snapshot matches', () => {
    expect(mount(<BasicSelectMenu />)).toMatchSnapshot()
  })

  // initialTab shows correct tab and applies hidden to the other tab
  it('shows correct initial tab', () => {
    const wrapper = mount(<MenuWithTabs />)
    expect(
      wrapper
        .find('[aria-selected="true"]')
        .first()
        .prop('tabName')
    ).toEqual('Organization')
  })

  // clicking on a tab opens the tab

  // selected list items have the selected icon showing
  // it seems like finding by aria-selected isn't working?! finding by a data- attribute works
  it('shows check svg in item when selected', () => {
    const wrapper = mount(<Basic />)
    expect(
      wrapper
        .find('[aria-selected="true"]')
        .first()
        .prop('tabName')
    ).toEqual('Organization')
  })

  // unselected list items do not have the selected icon showing

  // clicking on a list item calls onClick prop

  // clicking on tab calls onClick prop

  // clicking on an item closes the modal
})

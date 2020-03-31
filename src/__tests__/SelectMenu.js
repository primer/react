import React from 'react'
import SelectMenu from '../SelectMenu'
import Button from '../Button'
import {mount, render, renderRoot} from '../utils/testing'
import TestRenderer from 'react-test-renderer'
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
          <SelectMenu.Tab index={0} data-test="repo-tab" aria-role={true} tabName="Repository" />
          <SelectMenu.Tab index={1} tabName="Organization" />
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

  it('does not allow the "as" prop on SelectMenu', () => {
    expect(render(<SelectMenu as="span" />).type).toEqual('span')
  })

  it('shows correct initial tab', () => {
    const testInstance = renderRoot(<MenuWithTabs/>)
    expect(testInstance.findByProps({"aria-selected": true}).props.children).toBe('Organization')
  })

  // clicking on a tab opens the tab
  xit('clicking on a tab opens the tab', () => {
    const root = renderRoot(<MenuWithTabs/>)
    expect(root.findByProps({"aria-selected": true}).props["data-test"]).toBe('repo-tab')
  });


  it('selected items have aria-checked', () => {
    const testInstance = renderRoot(<BasicSelectMenu/>)
    expect(testInstance.findByProps({"aria-checked": true}).props.children[1]).toBe('Primer Components bugs')
  })

  // clicking on a list item calls onClick prop

  // clicking on tab calls onClick prop

  // clicking on an item closes the modal
})

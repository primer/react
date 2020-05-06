import React from 'react'
import SelectMenu from '../SelectMenu'
import Button from '../Button'
import {mount, render, renderRoot, COMPONENT_DISPLAY_NAME_REGEX} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

const BasicSelectMenu = ({onClick, as, align = 'left'}) => {
  return (
    <SelectMenu as={as}>
      <Button as="summary">Projects</Button>
      <SelectMenu.Modal title="Projects" align={align}>
        <SelectMenu.List>
          <SelectMenu.Item selected href="#">
            Primer Components bugs
          </SelectMenu.Item>
          <SelectMenu.Item onClick={onClick} as={as} data-test="menu-item" href="#">
            Primer Components roadmap
          </SelectMenu.Item>
          <SelectMenu.Divider>stuff</SelectMenu.Divider>
          <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
          <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
          <SelectMenu.Footer>footer</SelectMenu.Footer>
        </SelectMenu.List>
      </SelectMenu.Modal>
    </SelectMenu>
  )
}

const MenuWithTabs = ({onClick}) => {
  return (
    <SelectMenu initialTab="Organization">
      <Button as="summary">Projects</Button>
      <SelectMenu.Modal title="Projects">
        <SelectMenu.Tabs>
          <SelectMenu.Tab index={0} onClick={onClick} data-test="repo-tab" tabName="Repository" />
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
  for (const subComp of ['List', 'Divider', 'Filter', 'Item', 'List', 'Modal', 'Tabs', 'Tab', 'TabPanel', 'Header']) {
    const Comp = SelectMenu[subComp]

    it('implements the sx prop', () => {
      expect(Comp).toImplementSxProp()
    })

    it('sets a valid displayName', () => {
      expect(Comp.displayName).toMatch(COMPONENT_DISPLAY_NAME_REGEX)
    })
  }

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
    const component = mount(<BasicSelectMenu as="span" />)
    expect(component.find('details').length).toEqual(1)
  })

  it('shows correct initial tab', () => {
    const testInstance = renderRoot(<MenuWithTabs />)
    expect(testInstance.findByProps({'aria-selected': true}).props.children).toBe('Organization')
  })

  it('clicking on a tab opens the tab', () => {
    const component = mount(<MenuWithTabs />)
    const tab = component.find("[data-test='repo-tab']").first()
    tab.simulate('click')
    expect(tab.getDOMNode().attributes['aria-selected']).toBeTruthy()
  })

  it('selected items have aria-checked', () => {
    const testInstance = renderRoot(<BasicSelectMenu />)
    expect(testInstance.findByProps({'aria-checked': true}).props.children[1]).toBe('Primer Components bugs')
  })

  it('clicking on a list item calls user provided onClick handler', () => {
    const mockClick = jest.fn()
    const component = mount(<BasicSelectMenu onClick={mockClick} />)
    const item = component.find("[data-test='menu-item']").first()
    item.simulate('click')
    expect(mockClick.mock.calls.length).toEqual(1)
  })

  it('clicking on a tab calls user provided onClick handler', () => {
    const mockClick = jest.fn()
    const component = mount(<MenuWithTabs onClick={mockClick} />)
    const item = component.find("[data-test='repo-tab']").first()
    item.simulate('click')
    expect(mockClick.mock.calls.length).toEqual(1)
  })

  it('clicking on an item closes the modal', () => {
    const component = mount(<BasicSelectMenu />)
    const item = component.find("[data-test='menu-item']").first()
    item.simulate('click')
    expect(component.getDOMNode().attributes.open).toBeFalsy()
  })

  it('right-aligned modal has right: 0px', () => {
    expect(render(<BasicSelectMenu align="right" />)).toMatchSnapshot()
  })
})

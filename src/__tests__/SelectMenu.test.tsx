import {render as HTMLRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {SelectMenu, Button} from '../deprecated'
import {render, renderRoot, COMPONENT_DISPLAY_NAME_REGEX, checkExports} from '../utils/testing'
import {axe} from 'jest-axe'
import {SelectMenuModalProps, SelectMenuItemProps, SelectMenuTabProps} from '../deprecated/SelectMenu'

const BasicSelectMenu = ({
  onClick,
  as,
  align = 'left'
}: {
  onClick?: SelectMenuItemProps['onClick']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any
  align?: SelectMenuModalProps['align']
}) => {
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

const MenuWithTabs = ({onClick}: {onClick?: SelectMenuTabProps['onClick']}) => {
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
  checkExports('deprecated/SelectMenu', {
    default: SelectMenu
  })

  for (const Comp of [
    SelectMenu.List,
    SelectMenu.Divider,
    SelectMenu.Filter,
    SelectMenu.Item,
    SelectMenu.List,
    SelectMenu.Modal,
    SelectMenu.Tabs,
    SelectMenu.Tab,
    SelectMenu.TabPanel,
    SelectMenu.Header
  ]) {
    it('sets a valid displayName', () => {
      expect(Comp.displayName).toMatch(COMPONENT_DISPLAY_NAME_REGEX)
    })
  }

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<BasicSelectMenu />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('does not allow the "as" prop on SelectMenu', () => {
    const {container} = HTMLRender(<BasicSelectMenu as="span" />)
    expect(container.firstElementChild?.tagName).toBe('DETAILS')
  })

  it('shows correct initial tab', () => {
    const testInstance = renderRoot(<MenuWithTabs />)
    expect(testInstance.findByProps({'aria-selected': true}).props.children).toBe('Organization')
  })

  it('clicking on a tab opens the tab', async () => {
    const user = userEvent.setup()
    const {getByRole} = HTMLRender(<MenuWithTabs />)

    await user.click(getByRole('tab', {name: 'Repository'}))

    expect(getByRole('tab', {name: 'Repository'})).toHaveAttribute('aria-selected', 'true')
  })

  it('selected items have aria-checked', () => {
    const testInstance = renderRoot(<BasicSelectMenu />)
    expect(testInstance.findByProps({'aria-checked': true}).props.children[1]).toBe('Primer Components bugs')
  })

  it('clicking on a list item calls user provided onClick handler', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    const {getByRole} = HTMLRender(<BasicSelectMenu onClick={onClick} />)

    await user.click(getByRole('menuitemcheckbox', {name: 'Primer Components roadmap'}))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('clicking on a tab calls user provided onClick handler', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    const {getByRole} = HTMLRender(<MenuWithTabs onClick={onClick} />)

    await user.click(getByRole('tab', {name: 'Repository'}))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('clicking on an item closes the modal', async () => {
    const user = userEvent.setup()
    const {container, getByRole} = HTMLRender(<BasicSelectMenu />)

    await user.click(getByRole('menuitemcheckbox', {name: 'Primer Components roadmap'}))

    expect(container.firstElementChild).not.toHaveAttribute('open')
  })

  it('right-aligned modal has right: 0px', () => {
    expect(render(<BasicSelectMenu align="right" />)).toMatchSnapshot()
  })
})

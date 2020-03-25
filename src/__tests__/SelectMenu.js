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
          <SelectMenu.Item href="#"> Project 3</SelectMenu.Item>
          <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
        </SelectMenu.List>
      </SelectMenu.Modal>
    </SelectMenu>
  )
}
describe('Basic Select Menu', () => {
  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<BasicSelectMenu />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})

describe('SelectMenu', () => {
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

})

// initialTab shows correct tab and applies hidden to the other tab
// aria roles are implemented correctly

describe('SelectMenu.Filter', () => {
  it('implements system props', () => {
    expect(SelectMenu.Filter).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(SelectMenu.Filter).toSetDefaultTheme()
  })

  it('snapshot matches', () => {
    expect(render(<SelectMenu.Filter value="stuff" />)).toMatchSnapshot()
  })

})
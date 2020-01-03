import React from 'react'
import Flex from '../Flex'
import {FLEX} from '../constants'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Flex.Item', () => {
  it('implements system props', () => {
    expect(Flex.Item).toImplementSystemProps(FLEX)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Flex.Item />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(Flex.Item).toSetDefaultTheme()
  })

  it('respects alignSelf', () => {
    expect(render(<Flex.Item alignSelf="center" />)).toMatchSnapshot()
  })

  it('renders as correct tag', () => {
    const item = render(
      <Flex.Item as="button" alignSelf="center">
        hi
      </Flex.Item>
    )
    expect(item.type).toEqual('button')
    expect(item).toMatchSnapshot()
  })
})

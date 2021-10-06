import React from 'react'
import {Box, Position, Absolute, Fixed, Relative, Sticky} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('position components', () => {
  describe('Absolute', () => {
    behavesAsComponent({Component: Absolute})

    checkExports('Position', {
      default: Position,
      Absolute,
      Fixed,
      Relative,
      Sticky
    })

    it('should have no axe violations', async () => {
      const {container} = HTMLRender(<Absolute />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
      cleanup()
    })

    it('sets position: absolute', () => {
      expect(render(<Absolute />)).toHaveStyleRule('position', 'absolute')
    })

    it('can render other components with the as prop', () => {
      const result = render(
        <Absolute as={Box} borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2} />
      )
      expect(result).toHaveStyleRule('position', 'absolute')
      expect(result).toHaveStyleRule('border-width', '1px')
      expect(result).toHaveStyleRule('border-style', 'solid')
    })
  })

  describe('Fixed', () => {
    behavesAsComponent({Component: Fixed})

    it('respects the "as" prop', () => {
      expect(render(<Fixed as="span" />).type).toEqual('span')
    })

    it('should have no axe violations', async () => {
      const {container} = HTMLRender(<Fixed />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
      cleanup()
    })

    it('sets position: fixed', () => {
      expect(render(<Fixed />)).toHaveStyleRule('position', 'fixed')
    })

    it('can render other components with the as prop', () => {
      const result = render(
        <Fixed as={Box} borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2} />
      )
      expect(result).toHaveStyleRule('position', 'fixed')
      expect(result).toHaveStyleRule('border-width', '1px')
      expect(result).toHaveStyleRule('border-style', 'solid')
    })
  })

  describe('Relative', () => {
    behavesAsComponent({Component: Relative})

    it('should have no axe violations', async () => {
      const {container} = HTMLRender(<Relative />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
      cleanup()
    })

    it('sets position: relative', () => {
      expect(render(<Relative />)).toHaveStyleRule('position', 'relative')
    })

    it('can render other components with the as prop', () => {
      const result = render(
        <Relative as={Box} borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2} />
      )
      expect(result).toHaveStyleRule('position', 'relative')
      expect(result).toHaveStyleRule('border-width', '1px')
      expect(result).toHaveStyleRule('border-style', 'solid')
    })
  })

  describe('Sticky', () => {
    behavesAsComponent({Component: Sticky})

    it('should have no axe violations', async () => {
      const {container} = HTMLRender(<Sticky />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
      cleanup()
    })

    it('sets position: sticky', () => {
      expect(render(<Sticky />)).toHaveStyleRule('position', 'sticky')
    })

    it('can render other components with the as prop', () => {
      const result = render(
        <Sticky as={Box} borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2} />
      )
      expect(result).toHaveStyleRule('position', 'sticky')
      expect(result).toHaveStyleRule('border-width', '1px')
      expect(result).toHaveStyleRule('border-style', 'solid')
    })
  })
})

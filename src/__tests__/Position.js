import React from 'react'
import {LAYOUT, POSITION} from '../constants'
import BorderBox from '../BorderBox'
import {Absolute, Fixed, Relative, Sticky} from '../Position'
import {render} from '../utils/testing'

describe('position components', () => {
  describe('Absolute', () => {
    it('implements system props', () => {
      expect(Absolute).toImplementSystemProps(LAYOUT)
      expect(Absolute).toImplementSystemProps(POSITION)
    })

    it('has default theme', () => {
      expect(Absolute).toSetDefaultTheme()
    })

    it('sets position: absolute', () => {
      expect(render(<Absolute />)).toHaveStyleRule('position', 'absolute')
    })
    it('cannot override position', () => {
      expect(render(<Absolute position="relative" />)).toHaveStyleRule('position', 'absolute')
    })
    it('can render other components with the is prop', () => {
      const result = render(<Absolute is={BorderBox} />)
      expect(result).toHaveStyleRule('position', 'absolute')
      expect(result).toHaveStyleRule('border', '1px solid')
    })

    it('respects the "is" prop', () => {
      expect(render(<Absolute is="span" />).type).toEqual('span')
    })
  })

  describe('Fixed', () => {
    it('implements system props', () => {
      expect(Fixed).toImplementSystemProps(LAYOUT)
      expect(Fixed).toImplementSystemProps(POSITION)
    })
    it('respects the "is" prop', () => {
      expect(render(<Fixed is="span" />).type).toEqual('span')
    })
    it('has default theme', () => {
      expect(Fixed).toSetDefaultTheme()
    })
    it('sets position: fixed', () => {
      expect(render(<Fixed />)).toHaveStyleRule('position', 'fixed')
    })
    it('cannot override position', () => {
      expect(render(<Fixed position="relative" />)).toHaveStyleRule('position', 'fixed')
    })
    it('can render other components with the is prop', () => {
      const result = render(<Fixed is={BorderBox} />)
      expect(result).toHaveStyleRule('position', 'fixed')
      expect(result).toHaveStyleRule('border', '1px solid')
    })
  })

  describe('Relative', () => {
    it('implements system props', () => {
      expect(Relative).toImplementSystemProps(LAYOUT)
      expect(Relative).toImplementSystemProps(POSITION)
    })
    it('respects the "is" prop', () => {
      expect(render(<Relative is="span" />).type).toEqual('span')
    })

    it('has default theme', () => {
      expect(Relative).toSetDefaultTheme()
    })
    it('sets position: relative', () => {
      expect(render(<Relative />)).toHaveStyleRule('position', 'relative')
    })
    it('cannot override position', () => {
      expect(render(<Relative position="absolute" />)).toHaveStyleRule('position', 'relative')
    })
    it('can render other components with the is prop', () => {
      const result = render(<Relative is={BorderBox} />)
      expect(result).toHaveStyleRule('position', 'relative')
      expect(result).toHaveStyleRule('border', '1px solid')
    })
  })

  describe('Sticky', () => {
    it('implements system props', () => {
      expect(Sticky).toImplementSystemProps(LAYOUT)
      expect(Sticky).toImplementSystemProps(POSITION)
    })
    it('respects the "is" prop', () => {
      expect(render(<Sticky is="span" />).type).toEqual('span')
    })
    it('sets position: sticky', () => {
      expect(render(<Sticky />)).toHaveStyleRule('position', 'sticky')
    })
    it('cannot override position', () => {
      expect(render(<Sticky position="absolute" />)).toHaveStyleRule('position', 'sticky')
    })
    it('can render other components with the is prop', () => {
      const result = render(<Sticky is={BorderBox} />)
      expect(result).toHaveStyleRule('position', 'sticky')
      expect(result).toHaveStyleRule('border', '1px solid')
    })
  })
})

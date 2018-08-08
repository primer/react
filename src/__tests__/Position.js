import React from 'react'
import {LAYOUT, POSITION} from '../system-props'
import {Absolute, Fixed, Relative, Sticky} from '../Position'
import {render} from '../utils/testing'

describe('position components', () => {
  // position components don't "implement" the position prop because
  // it's not in their propTypes, since it can't be overridden
  const positionProps = LAYOUT.concat(POSITION.filter(p => p !== 'position'))

  describe('Absolute', () => {
    it('implements system props', () => {
      expect(Absolute).toImplementSystemProps(positionProps)
    })
    it('sets position: absolute', () => {
      expect(render(<Absolute />)).toHaveStyleRule('position', 'absolute')
    })
    it('cannot override position', () => {
      expect(render(<Absolute position="relative" />)).toHaveStyleRule('position', 'absolute')
    })
  })

  describe('Fixed', () => {
    it('implements system props', () => {
      expect(Fixed).toImplementSystemProps(positionProps)
    })
    it('sets position: fixed', () => {
      expect(render(<Fixed />)).toHaveStyleRule('position', 'fixed')
    })
    it('cannot override position', () => {
      expect(render(<Fixed position="relative" />)).toHaveStyleRule('position', 'fixed')
    })
  })

  describe('Relative', () => {
    it('implements system props', () => {
      expect(Relative).toImplementSystemProps(positionProps)
    })
    it('sets position: relative', () => {
      expect(render(<Relative />)).toHaveStyleRule('position', 'relative')
    })
    it('cannot override position', () => {
      expect(render(<Relative position="absolute" />)).toHaveStyleRule('position', 'relative')
    })
  })

  describe('Sticky', () => {
    it('implements system props', () => {
      expect(Sticky).toImplementSystemProps(positionProps)
    })
    it('sets position: sticky', () => {
      expect(render(<Sticky />)).toHaveStyleRule('position', 'sticky')
    })
    it('cannot override position', () => {
      expect(render(<Sticky position="absolute" />)).toHaveStyleRule('position', 'sticky')
    })
  })
})

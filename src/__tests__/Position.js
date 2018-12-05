import React from 'react'
import {LAYOUT, POSITION} from '../system-props'
import BorderBox from '../BorderBox'
import {Absolute, Fixed, Relative, Sticky} from '../Position'
import {render, mount} from '../utils/testing'

describe('position components', () => {
  // position components don't "implement" the position prop because
  // it's not in their propTypes, since it can't be overridden
  const positionProps = LAYOUT.concat(POSITION.filter(p => p !== 'position'))

  describe('Absolute', () => {
    it('implements system props', () => {
      expect(Absolute).toImplementSystemProps(positionProps)
    })
    it('sets position: absolute', () => {
      expect(render(mount(<Absolute />))).toHaveStyleRule('position', 'absolute')
    })
    it('cannot override position', () => {
      expect(render(mount(<Absolute position="relative" />))).toHaveStyleRule('position', 'absolute')
    })
    it('can render other components with the is prop', () => {
      const result = render(mount(<Absolute is={BorderBox} />))
      expect(result).toHaveStyleRule('position', 'absolute')
      expect(result).toHaveStyleRule('border', '1px solid')
    })
  })

  describe('Fixed', () => {
    it('implements system props', () => {
      expect(Fixed).toImplementSystemProps(positionProps)
    })
    it('sets position: fixed', () => {
      expect(render(mount(<Fixed />))).toHaveStyleRule('position', 'fixed')
    })
    it('cannot override position', () => {
      expect(render(mount(<Fixed position="relative" />))).toHaveStyleRule('position', 'fixed')
    })
    it('can render other components with the is prop', () => {
      const result = render(mount(<Fixed is={BorderBox} />))
      expect(result).toHaveStyleRule('position', 'fixed')
      expect(result).toHaveStyleRule('border', '1px solid')
    })
  })

  describe('Relative', () => {
    it('implements system props', () => {
      expect(Relative).toImplementSystemProps(positionProps)
    })
    it('sets position: relative', () => {
      expect(render(mount(<Relative />))).toHaveStyleRule('position', 'relative')
    })
    it('cannot override position', () => {
      expect(render(mount(<Relative position="absolute" />))).toHaveStyleRule('position', 'relative')
    })
    it('can render other components with the is prop', () => {
      const result = render(mount(<Relative is={BorderBox} />))
      expect(result).toHaveStyleRule('position', 'relative')
      expect(result).toHaveStyleRule('border', '1px solid')
    })
  })

  describe('Sticky', () => {
    it('implements system props', () => {
      expect(Sticky).toImplementSystemProps(positionProps)
    })
    it('sets position: sticky', () => {
      expect(render(mount(<Sticky />))).toHaveStyleRule('position', 'sticky')
    })
    it('cannot override position', () => {
      expect(render(mount(<Sticky position="absolute" />))).toHaveStyleRule('position', 'sticky')
    })
    it('can render other components with the is prop', () => {
      const result = render(mount(<Sticky is={BorderBox} />))
      expect(result).toHaveStyleRule('position', 'sticky')
      expect(result).toHaveStyleRule('border', '1px solid')
    })
  })
})

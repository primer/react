import React from 'react'
import PropTypes from 'prop-types'
import {space, fontFamily} from 'styled-system'
import {render} from '../utils/testing'
import system, {getSystemProps, composeSystemProps, withSystemProps} from '../system-props'

describe('system props', () => {
  describe('getSystemProps()', () => {
    it('maps known prop names to styled-system', () => {
      expect(getSystemProps(['space', 'fontFamily'])).toEqual([space, fontFamily])
    })

    it('accepts functions as-is', () => {
      function foo() {}
      expect(getSystemProps([foo])).toEqual([foo])
    })

    it('throws on unknown prop strings', () => {
      expect(() => getSystemProps(['foo'])).toThrow()
    })
  })

  describe('composeSystemProps()', () => {
    it('returns a composed function', () => {
      const plusOne = d => d + 1
      const timesTwo = d => d * 2
      expect(composeSystemProps([plusOne, timesTwo])(1)).toBe(4)
    })

    it('adds propTypes for each function', () => {
      const a = () => ({})
      a.propTypes = {a: PropTypes.number}
      const b = () => ({})
      b.propTypes = {b: PropTypes.string}
      expect(composeSystemProps([a, b]).propTypes).toEqual({
        a: PropTypes.number,
        b: PropTypes.string
      })
    })

    it('merges multiple propTypes for each function', () => {
      const a = () => ({})
      a.propTypes = {a: PropTypes.number}
      const b = () => ({})
      b.propTypes = {b: PropTypes.string, c: PropTypes.bool}
      expect(composeSystemProps([a, b]).propTypes).toEqual({
        a: PropTypes.number,
        b: PropTypes.string,
        c: PropTypes.bool
      })
    })
  })

  describe('withSystemProps()', () => {
    it('merges all the propTypes', () => {
      const Component = props => <h1 />
      const Wrapped = withSystemProps(Component, ['fontFamily'])
      expect(Wrapped.propTypes).toEqual({
        ...fontFamily.propTypes,
        ...Component.propTypes
      })
    })

    it('renders the underlying component', () => {
      const Component = jest.fn(props => <h1 {...props} />)
      Component.propTypes = {
        foo: PropTypes.number
      }
      const Wrapped = withSystemProps(Component, ['fontFamily'])
      expect(render(<Wrapped />).type).toEqual('h1')
    })

    const theme = {
      space: [0, 8, 16],
      fonts: {
        sans: 'Helvetica,Verdana,sans-serif'
      }
    }

    it('applies one theme value', () => {
      const Component = jest.fn(props => <h1 {...props} />)
      const Wrapped = withSystemProps(Component, ['space'])
      const result = render(<Wrapped m={2} theme={theme} />)
      expect(Component.mock.calls.length).toEqual(1)
      expect(result).toMatchSnapshot()
      expect(result).toHaveStyleRule('margin', theme.space[2] + 'px')
    })

    it('applies multiple theme values', () => {
      const Component = jest.fn(props => <h1 {...props} />)
      const Wrapped = withSystemProps(Component, ['fontFamily', 'space'])
      const result = render(<Wrapped fontFamily='sans' m={2} theme={theme} />)
      expect(Component.mock.calls.length).toEqual(1)
      expect(result).toMatchSnapshot()
      expect(result).toHaveStyleRule('font-family', theme.fonts.sans)
      expect(result).toHaveStyleRule('margin', theme.space[2] + 'px')
    })
  })
})

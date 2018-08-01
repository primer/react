import PropTypes from 'prop-types'
import classnames from 'classnames'
import createMapper from 'system-classnames'
import {compose} from 'ramda'
import {defined} from './utils'
import theme from './theme'

export const breakpoints = [null].concat(theme.breakpointNames)

export function oneOrMoreOf(type) {
  return PropTypes.oneOfType([type, PropTypes.arrayOf(type)])
}

export const OneOrMoreNumbers = oneOrMoreOf(PropTypes.number)

export function createResponsiveMapper(props, getter = classPattern, propTypes = null) {
  const mapper = createMapper({
    breakpoints,
    props,
    getter
  })
  mapper.propTypes =
    propTypes ||
    props.reduce((types, prop) => {
      types[prop] = OneOrMoreNumbers
      return types
    }, {})
  return mapper
}

export function composeWithPropTypes(...funcs) {
  const composed = compose(...funcs)
  composed.propTypes = [...funcs].filter(f => f.propTypes).reduce((acc, {propTypes}) => ({...acc, ...propTypes}), {})
  return composed
}

export const StyleType = PropTypes.oneOfType([PropTypes.number, PropTypes.string])

export function stylizer(propsToPass, propTypes) {
  const mapper = props => {
    const copy = {...props}
    copy.style = propsToPass.reduce((acc, prop) => {
      if (prop in props) {
        acc[prop] = props[prop]
        delete copy[prop]
      }
      return acc
    }, props.style || {})
    return copy
  }
  mapper.propTypes = propTypes || {
    ...propsToPass.reduce((types, prop) => {
      types[prop] = StyleType
      return types
    }, {})
  }
  return mapper
}

export function classPattern({breakpoint, prop, value}) {
  return breakpoint ? [prop, breakpoint, value].join('-') : [prop, value].join('-')
}

export function createClassMapper(prop, mapValue, propType) {
  const mapper = props => {
    if (defined(props[prop])) {
      const {className, [prop]: value, ...rest} = props
      const classes = mapValue(value)
      return {className: classnames(className, classes), ...rest}
    } else {
      return props
    }
  }
  mapper.propTypes = {[prop]: propType}
  return mapper
}

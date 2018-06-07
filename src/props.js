import PropTypes from 'prop-types'
import classnames from 'classnames'
import createMapper from 'system-classnames'

const breakpoints = [null, 'sm', 'md', 'lg', 'xl']

const call = (f, v) => (typeof f === 'function') ? f(v) : f || v

export const oneOrMoreOf = type => PropTypes.oneOfType([
  type,
  PropTypes.arrayOf(type)
])

export const oneOrMoreNumbers = oneOrMoreOf(PropTypes.number)

export const createMapperWithPropTypes = config => {
  const mapper = createMapper(config)
  mapper.propTypes = config.props.reduce((propTypes, prop) => {
    propTypes[prop] = oneOrMoreNumbers
    return propTypes
  }, {})
  return mapper
}

const map = createMapperWithPropTypes({
  breakpoints,
  props: [
    'm', 'mt', 'mr', 'mb', 'ml', 'mx', 'my',
    'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'
  ],
  getter: ({breakpoint, prop, value}) => breakpoint
    ? [prop, breakpoint, value].join('-')
    : [prop, value].join('-')
})

export default map

function unique(values) {
  return values.filter((v, i) => values.indexOf(v) === i)
}

export function classifier(propsToMap) {
  return ({className: baseClassName, ...props}) => {
    const mapped = {}
    let classes = []
    for (let [key, value] of Object.entries(props)) {
      if (key in propsToMap) {
        const mapper = propsToMap[key]
        if (typeof mapper === 'function') {
          value = mapper(value)
        } else if (mapper) {
          value = mapper
        } else {
          continue
        }
        classes = classes.concat(value)
      } else {
        mapped[key] = props[key]
      }
    }
    const classNames = classnames(baseClassName, ...classes).trim().split(' ')
    const className = unique(classNames).join(' ')
    return className ? Object.assign(mapped, {className}) : mapped
  }
}

export function valueMapper(valueMap, fn, fallback) {
  return value => (value in valueMap)
    ? call(fn, valueMap[value])
    : (fallback === true)
      ? call(fn, value)
      : call(fallback, value)
}

export function expander(fn) {
  return value => Array.isArray(value)
    ? value.map(fn)
    : fn(value)
}

import PropTypes from 'prop-types'
import createMapper from 'system-classnames'

const breakpoints = [null, 'sm', 'md', 'lg', 'xl']

export const oneOrMoreOf = type => PropTypes.oneOfType([type, PropTypes.arrayOf(type)])

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
  props: ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'],
  getter: ({breakpoint, prop, value}) => (breakpoint ? [prop, breakpoint, value].join('-') : [prop, value].join('-'))
})

export default map

export function stylizer(propsToPass) {
  return props => {
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
}

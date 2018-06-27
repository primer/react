import PropTypes from 'prop-types'
import createMapper from 'system-classnames'

const breakpoints = [null, 'sm', 'md', 'lg', 'xl']

export const oneOrMoreOf = type => PropTypes.oneOfType([type, PropTypes.arrayOf(type)])

export const oneOrMoreNumbers = oneOrMoreOf(PropTypes.number)

export const createMapperWithPropTypes = props => {
  const mapper = createMapper({
    breakpoints,
    props,
    getter: ({breakpoint, prop, value}) => (breakpoint ? [prop, breakpoint, value].join('-') : [prop, value].join('-'))
  })
  mapper.propTypes = props.reduce((propTypes, prop) => {
    propTypes[prop] = oneOrMoreNumbers
    return propTypes
  }, {})
  return mapper
}

export const marginProps = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my']
export const paddingProps = ['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py']

export const mapWhitespaceProps = createMapperWithPropTypes(marginProps.concat(paddingProps))

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

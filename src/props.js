import PropTypes from 'prop-types'
import createMapper from 'system-classnames'

export const breakpoints = [null, 'sm', 'md', 'lg', 'xl']

export const oneOrMoreOf = type => PropTypes.oneOfType([type, PropTypes.arrayOf(type)])

export const oneOrMoreNumbers = oneOrMoreOf(PropTypes.number)

const flexPropNames = {
  justifyContent: 'justify',
  alignItems: 'items',
  alignContent: 'content'
}

const classPattern = (breakpoint, prop, value, type) => {
  let result = ''
  switch (type) {
    case 'flex':
      result = ['flex', breakpoint, flexPropNames[prop], value].join('-')
      break;
    case 'display':
      result = ['d', breakpoint, value].join('-')
      break;
    default:
      result = [prop, breakpoint, value].join('-')
  }
  return result.replace(/\-\-+/g, '-')
}

export const createMapperWithPropTypes = (props, type) => {
  const mapper = createMapper({
    breakpoints,
    props,
    getter: ({breakpoint, prop, value}) => classPattern(breakpoint, prop, value, type)
  })
  mapper.propTypes = props.reduce((propTypes, prop) => {
    propTypes[prop] = oneOrMoreNumbers
    return propTypes
  }, {})
  return mapper
}

export const marginProps = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my']
export const paddingProps = ['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py']
export const flexProps = ['wrap', 'direction', 'justifyContent', 'alignItems', 'alignContent']

export const mapWhitespaceProps = createMapperWithPropTypes(marginProps.concat(paddingProps))
export const mapFlexProps = createMapperWithPropTypes(flexProps, 'flex')
export const mapDisplayProps = createMapperWithPropTypes(['display'], 'display')
export const mapAllProps = props => {
  return mapWhitespaceProps(mapDisplayProps(mapFlexProps(props)))
}

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

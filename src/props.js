import PropTypes from 'prop-types'
import createMapper from 'system-classnames'

export const breakpoints = [null, 'sm', 'md', 'lg', 'xl']

export const oneOrMoreOf = type => PropTypes.oneOfType([type, PropTypes.arrayOf(type)])

export const oneOrMoreNumbers = oneOrMoreOf(PropTypes.number)

const flexPropNames = {
  justifyContent: 'justify',
  alignItems: 'items',
  alignContent: 'content',
  flex: 'd'
}

const classPattern = (breakpoint, prop, value, type) => {
  let result = ''
  if(type == 'flex') {
    result = ['flex', breakpoint, flexPropNames[prop], value].join('-')
  } else {
    result = [prop, breakpoint, value].join('-')
  }
  return result.replace(/\-\-+/g, '-')
}

export const createMapperWithPropTypes = (props, type) => {
  console.log(props)
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
export const flexProps = ['flex', 'wrap', 'direction', 'justifyContent', 'alignItems', 'alignContent']

export const mapWhitespaceProps = createMapperWithPropTypes(marginProps.concat(paddingProps))
export const mapFlexProps = createMapperWithPropTypes(flexProps, 'flex')

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

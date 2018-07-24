import PropTypes from 'prop-types'
import createMapper from 'system-classnames'
import {compose} from 'ramda'

export const breakpoints = [null, 'sm', 'md', 'lg', 'xl']

export function oneOrMoreOf(type) {
  return PropTypes.oneOfType([type, PropTypes.arrayOf(type)])
}

export const OneOrMoreNumbers = oneOrMoreOf(PropTypes.number)

export const createMapperWithPropTypes = (props, getter = classPattern, propTypes = null) => {
  const mapper = createMapper({
    breakpoints,
    props,
    getter
  })
  mapper.propTypes =
    propTypes ||
    props.reduce((propTypes, prop) => {
      propTypes[prop] = OneOrMoreNumbers
      return propTypes
    }, {})
  return mapper
}

export const marginProps = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my']
export const paddingProps = ['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py']
export const flexProps = ['wrap', 'direction', 'justifyContent', 'alignItems', 'alignContent']

export const mapWhitespaceProps = createMapperWithPropTypes(marginProps.concat(paddingProps))

export const mapFlexProps = createMapperWithPropTypes(flexProps, ({prop, ...data}) => {
  data.prop =
    {
      alignContent: 'flex-content',
      alignItems: 'flex-items',
      justifyContent: 'flex-justify'
    }[prop] || 'flex'
  return classPattern(data)
})
mapFlexProps.propTypes = {
  alignContent: PropTypes.oneOf(['start', 'end', 'center', 'around', 'stretch']),
  alignItems: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
  direction: PropTypes.oneOf(['column', 'row', 'row-reverse']),
  justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
  wrap: PropTypes.oneOf(['wrap', 'nowrap'])
}

export const mapDisplayProps = createMapperWithPropTypes(['display'], data => {
  return classPattern({...data, prop: 'd'})
})

export const mapAllProps = compose(
  mapWhitespaceProps,
  mapDisplayProps,
  mapFlexProps
)

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

function classPattern({breakpoint, prop, value}) {
  return breakpoint ? [prop, breakpoint, value].join('-') : [prop, value].join('-')
}

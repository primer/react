import PropTypes from 'prop-types'
import theme from './theme'
import {classPattern, createClassMapper, createResponsiveMapper, composeWithPropTypes, oneOrMoreOf} from './props'

const {colors, fontSizes, radii} = theme
const {bg: bgColors, border: borderColors, ...namedColors} = colors
const colorNames = Object.keys(namedColors).concat(getNestedKeys(namedColors))

export const marginProps = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my']
export const paddingProps = ['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py']
export const flexProps = ['wrap', 'direction', 'justifyContent', 'alignItems', 'alignContent']
export const displayValues = ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'none', 'table', 'table-cell']
export const positionValues = ['relative', 'absolute', 'fixed']

export const margin = createResponsiveMapper(marginProps)
export const padding = createResponsiveMapper(paddingProps)
export const whitespace = createResponsiveMapper(marginProps.concat(paddingProps))

export const position = createClassMapper('position', value => `position-${value}`, PropTypes.oneOf(positionValues))

export const flex = createResponsiveMapper(
  flexProps,
  ({prop, ...data}) => {
    data.prop =
      {
        alignContent: 'flex-content',
        alignItems: 'flex-items',
        justifyContent: 'flex-justify'
      }[prop] || 'flex'
    return classPattern(data)
  },
  {
    alignContent: oneOrMoreOf(PropTypes.oneOf(['start', 'end', 'center', 'around', 'stretch'])),
    alignItems: oneOrMoreOf(PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch'])),
    direction: oneOrMoreOf(PropTypes.oneOf(['column', 'row', 'row-reverse'])),
    justifyContent: oneOrMoreOf(PropTypes.oneOf(['start', 'end', 'center', 'between', 'around'])),
    wrap: oneOrMoreOf(PropTypes.oneOf(['wrap', 'nowrap']))
  }
)

export const display = createResponsiveMapper(
  ['display'],
  data => {
    return classPattern({...data, prop: 'd'})
  },
  {
    display: oneOrMoreOf(PropTypes.oneOf(displayValues))
  }
)

export const bg = createClassMapper(
  'bg',
  nestedKeyMapper(bgColors, key => `bg-${key}`),
  PropTypes.oneOf(Object.keys(bgColors))
)

export const borderColor = createClassMapper(
  'borderColor',
  value => `border-${value}`,
  PropTypes.oneOf(Object.keys(borderColors))
)

export const borderRadius = createResponsiveMapper(['borderRadius'], props => classPattern({...props, prop: 'round'}), {
  borderRadius: oneOrMoreOf(PropTypes.oneOf(range(0, radii.length - 1)))
})

export const color = createClassMapper(
  'color',
  nestedKeyMapper(namedColors, suffix => `color-${suffix}`),
  PropTypes.oneOf(colorNames)
)

export const fontSize = createResponsiveMapper(['fontSize'], values => classPattern({...values, prop: 'f'}), {
  fontSize: oneOrMoreOf(PropTypes.oneOf(range(0, fontSizes.length - 1)))
})

export const common = composeWithPropTypes(bg, color, display, flex, whitespace)

function nestedKeyMapper(source, mapValue) {
  return key => {
    const suffix = Array.isArray(source[key]) ? `${key}.5` : key
    return mapValue(suffix.replace(/\./g, '-'))
  }
}

function getNestedKeys(obj) {
  return Object.keys(obj).reduce((list, key) => {
    const value = obj[key]
    if (Array.isArray(value)) {
      list.push(...value.map((sub, i) => [key, i].join('.')))
    }
    /* else if (value && typeof value === 'object') {
      list.push(...Object.keys(value).map(sub => [key, sub].join('.')))
    } */
    return list
  }, [])
}

function range(start, end) {
  const numbers = []
  for (let i = start; i <= end; i++) {
    numbers.push(i)
  }
  return numbers
}

import PropTypes from 'prop-types'
import {get} from 'dotmap'
import {definedFallback} from './utils'
import theme from './theme'
import {classPattern, createClassMapper, createResponsiveMapper, composeWithPropTypes, oneOrMoreOf} from './props'

export function themeGet(key, fallback) {
  return definedFallback(get(theme, key), fallback)
}

export function getColor(key, fallback) {
  return themeGet(`colors.${key}`, fallback || key)
}

const {colors, fontSizes, radii} = theme
export const colorNames = Object.keys(colors).concat(getNestedKeys(colors))
export const ColorType = PropTypes.oneOf(colorNames)

export const position = createResponsiveMapper(['position'], classPattern, {
  position: PropTypes.oneOf(['relative', 'absolute', 'fixed'])
})

export const bg = createClassMapper(
  'bg',
  nestedKeyMapper(colorNames, key => `bg-${key}`),
  ColorType
)

export const borderColor = createClassMapper(
  'borderColor',
  nestedKeyMapper(colorNames, key => `border-${key}`),
  ColorType
)

export const borderRadius = createResponsiveMapper(['borderRadius'], props => classPattern({...props, prop: 'round'}), {
  borderRadius: oneOrMoreOf(PropTypes.oneOf(range(0, radii.length - 1)))
})

export const color = createClassMapper(
  'color',
  nestedKeyMapper(colorNames, key => `color-${key}`),
  ColorType
)

export const display = createResponsiveMapper(
  ['display'],
  data => {
    return classPattern({...data, prop: 'd'})
  },
  {
    display: oneOrMoreOf(
      PropTypes.oneOf(['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'none', 'table', 'table-cell'])
    )
  }
)

export const flex = createResponsiveMapper(
  ['wrap', 'direction', 'justifyContent', 'alignItems', 'alignContent'],
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

export const fontSize = createResponsiveMapper(['fontSize'], values => classPattern({...values, prop: 'f'}), {
  fontSize: oneOrMoreOf(PropTypes.oneOf(range(0, fontSizes.length - 1)))
})

export const margin = createResponsiveMapper(['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my'])

export const padding = createResponsiveMapper(['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'])

export const spacing = composeWithPropTypes(margin, padding)

export const common = composeWithPropTypes(bg, color, display, flex, spacing)

function nestedKeyMapper(source, mapValue) {
  return key => mapValue(key.replace(/\./g, '-'))
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
